package dev.theopenshelf.platform.api.publicapi.auth;

import java.util.Date;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.context.ServerSecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ServerWebExchange;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jwt.JWTClaimsSet;

import dev.theopenshelf.platform.api.AuthApiApiDelegate;
import dev.theopenshelf.platform.entities.UserEntity;
import dev.theopenshelf.platform.model.ConfirmResetPasswordRequest;
import dev.theopenshelf.platform.model.LoginRequest;
import dev.theopenshelf.platform.model.ResetPasswordRequest;
import dev.theopenshelf.platform.model.SignUpRequest;
import dev.theopenshelf.platform.model.User;
import dev.theopenshelf.platform.model.VerifyEmail200Response;
import dev.theopenshelf.platform.repositories.UsersRepository;
import dev.theopenshelf.platform.services.JwtService;
import dev.theopenshelf.platform.services.MailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;
import reactor.util.function.Tuples;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthApi implements AuthApiApiDelegate {
    private final ReactiveAuthenticationManager authenticationManager;
    private final UsersRepository usersRepository;
    private final ServerSecurityContextRepository serverSecurityContextRepository;
    private final PasswordEncoder passwordEncoder; // Add this field
    private final MailService mailService;
    private final JwtService jwtService;

    @Value("${oshelf.frontend-url}")
    private String frontendUrl;

    @Override
    public Mono<ResponseEntity<User>> login(Mono<LoginRequest> loginRequest, ServerWebExchange exchange) {
        return loginRequest
                .doOnNext(request -> log.info("Login attempt for user: {}", request.getUsername()))
                .flatMap(request -> authenticationManager.authenticate(UsernamePasswordAuthenticationToken
                        .unauthenticated(request.getUsername(), request.getPassword())))
                .flatMap(authentication -> {
                    log.info("User authenticated successfully: {}", authentication.getName());
                    return usersRepository.findById(UUID.fromString(authentication.getName()))
                            .map(userEntity -> {
                                SecurityContext context = SecurityContextHolder.createEmptyContext();
                                Authentication auth = new UsernamePasswordAuthenticationToken(
                                    userEntity.getId().toString(),
                                    null,
                                    authentication.getAuthorities()
                                );
                                context.setAuthentication(auth);
                                return Tuples.of(context, userEntity);
                            })
                            .map(Mono::just)
                            .orElse(Mono.empty());
                })
                .flatMap(tuple -> serverSecurityContextRepository
                        .save(exchange, tuple.getT1())
                        .thenReturn(tuple.getT2()))
                .map(userEntity -> {
                    log.info("Login successful for user: {}", userEntity.getUsername());
                    return ResponseEntity.ok(userEntity.toUser().build());
                })
                .onErrorResume(e -> {
                    if (e instanceof BadCredentialsException) {
                        log.warn("Login failed: Bad credentials");
                        return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
                    } else {
                        log.error("Login failed with unexpected error", e);
                        return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build());
                    }
                });
    }

    @Override
    public Mono<ResponseEntity<Void>> signUp(Mono<SignUpRequest> signUpRequest, ServerWebExchange exchange) {
        return signUpRequest.flatMap(request -> {
            log.info("Processing signup request for username: {}", request.getUsername());

            UserEntity user = usersRepository.findByUsername(request.getUsername());
            if (user != null) {
                log.warn("Signup failed: Username already exists: {}", request.getUsername());
                return Mono.error(new BadCredentialsException("User already exists"));
            }

            UserEntity newUser = new UserEntity();
            newUser.setId(UUID.randomUUID());
            newUser.setUsername(request.getUsername());
            String encodedPassword = passwordEncoder.encode(request.getPassword());
            newUser.setPassword(encodedPassword);
            newUser.setEmail(request.getEmail());
            newUser.setCity(request.getCity());
            newUser.setPostalCode(request.getPostalCode());
            newUser.setCountry(request.getCountry());
            newUser.setStreetAddress(request.getStreetAddress());
            newUser.setRoles(Set.of("hub-user"));

            log.debug("Created new user entity with ID: {}", newUser.getId());
            usersRepository.save(newUser);
            log.info("Saved new user: {}", newUser.getUsername());

            try {
                JWTClaimsSet.Builder claimsBuilder = new JWTClaimsSet.Builder()
                        .subject(newUser.getUsername())
                        .expirationTime(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                        .claim("type", "E_VERIFY")
                        .claim("email", newUser.getEmail());

                String token = jwtService.createToken(claimsBuilder);
                log.debug("Created verification token for user: {}", newUser.getUsername());

                mailService.sendTemplatedEmail(
                        request.getEmail(),
                        "Welcome to The Open Shelf",
                        "email/signup-email-verif",
                        Map.of(
                                "username", newUser.getUsername(),
                                "verif_url", frontendUrl + "/email-confirmation?token=" + token));
                log.info("Sent verification email to: {}", request.getEmail());

                return Mono.just(ResponseEntity.status(HttpStatus.CREATED).build());
            } catch (JOSEException e) {
                log.error("Failed to create email verification token for user: {}", newUser.getUsername(), e);
                return Mono.error(new InternalError("Failed to create email verification token"));
            }
        });
    }

    @Override
    public Mono<ResponseEntity<VerifyEmail200Response>> verifyEmail(String token, ServerWebExchange exchange) {
        log.info("Processing email verification request");
        try {
            JWTClaimsSet claims = jwtService.verifyToken(token);
            if (claims == null) {
                log.warn("Email verification failed: Invalid token");
                return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new VerifyEmail200Response()
                                .success(false)
                                .message("Invalid token")));
            }

            if (!claims.getClaim("type").equals("E_VERIFY")) {
                log.warn("Email verification failed: Invalid token type");
                return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new VerifyEmail200Response()
                                .success(false)
                                .message("Invalid token type")));
            }

            UserEntity user = usersRepository.findByUsername(claims.getSubject());
            if (user == null) {
                log.warn("Email verification failed: User not found for subject: {}", claims.getSubject());
                return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new VerifyEmail200Response()
                                .success(false)
                                .message("User not found")));
            }

            if (user.isEmailVerified()) {
                log.info("Email already verified for user: {}", user.getUsername());
                return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new VerifyEmail200Response()
                                .success(false)
                                .message("Email already verified")));
            }

            user.setEmailVerified(true);
            usersRepository.save(user);
            log.info("Email verified successfully for user: {}", user.getUsername());

            return Mono.just(ResponseEntity.status(HttpStatus.OK)
                    .body(new VerifyEmail200Response().success(true)));
        } catch (Exception e) {
            log.error("Email verification failed with exception", e);
            return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new VerifyEmail200Response()
                            .success(false)
                            .message(e.getMessage())));
        }
    }

    @Override
    public Mono<ResponseEntity<Void>> resetPassword(Mono<ResetPasswordRequest> request, ServerWebExchange exchange) {
        return request.map(req -> {
            UserEntity user = usersRepository.findByEmail(req.getEmail());
            if (user != null) {
                try {
                    String token = jwtService.createToken(new JWTClaimsSet.Builder()
                            .subject(user.getId().toString())
                            .expirationTime(new Date(System.currentTimeMillis() + 3600000))
                            .claim("type", "PWD_RESET"));

                    String resetUrl = frontendUrl + "/reset-password?token=" + token;

                    Map<String, Object> templateVars = Map.of(
                            "username", user.getUsername(),
                            "reset_url", resetUrl);

                    mailService.sendTemplatedEmail(
                            user.getEmail(),
                            "Reset Your Password - The Open Shelf",
                            "email/reset-password",
                            templateVars);
                } catch (Exception e) {
                    log.error("Failed to process password reset", e);
                }
            }
            return ResponseEntity.ok().<Void>build(); // Always return OK to not reveal email existence
        });
    }

    @Override
    public Mono<ResponseEntity<Void>> confirmResetPassword(Mono<ConfirmResetPasswordRequest> request,
            ServerWebExchange exchange) {
        return request.map(req -> {
            try {
                JWTClaimsSet claims = jwtService.verifyToken(req.getToken());
                if (!"PWD_RESET".equals(claims.getStringClaim("type"))) {
                    throw new IllegalArgumentException("Invalid token type");
                }

                UUID userId = UUID.fromString(claims.getSubject());
                UserEntity user = usersRepository.findById(userId).orElseThrow();
                user.setPassword(passwordEncoder.encode(req.getNewPassword()));
                usersRepository.save(user);

                return ResponseEntity.ok().<Void>build();
            } catch (Exception e) {
                throw new IllegalArgumentException("Invalid or expired token");
            }
        });
    }
}