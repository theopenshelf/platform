package dev.theopenshelf.platform.api.publicapi;

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
import dev.theopenshelf.platform.model.LoginRequest;
import dev.theopenshelf.platform.model.SignUpRequest;
import dev.theopenshelf.platform.model.User;
import dev.theopenshelf.platform.model.VerifyEmail200Response;
import dev.theopenshelf.platform.respositories.UsersRepository;
import dev.theopenshelf.platform.services.JwtService;
import dev.theopenshelf.platform.services.MailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

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

    @Value("${oshelf.email-verification-url}")
    private String emailVerificationUrl;

    @Override
    public Mono<ResponseEntity<User>> login(Mono<LoginRequest> loginRequest, ServerWebExchange exchange) {
        return loginRequest
                .flatMap(request -> authenticationManager.authenticate(UsernamePasswordAuthenticationToken
                        .unauthenticated(request.getUsername(), request.getPassword())))
                .zipWhen(authentication -> Mono.just(usersRepository.findByUsername(authentication.getName())))
                .flatMap(tuple -> {
                    SecurityContext context = SecurityContextHolder.createEmptyContext();
                    context.setAuthentication(tuple.getT1());
                    SecurityContextHolder.setContext(context);
                    return serverSecurityContextRepository.save(exchange, context).thenReturn(tuple.getT2());
                })
                .map(user -> ResponseEntity.status(HttpStatus.OK).body(user.toUser().build()))
                .onErrorResume(e -> e instanceof BadCredentialsException
                        ? Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build())
                        : Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()));
    }

    @Override
    public Mono<ResponseEntity<Void>> signUp(Mono<SignUpRequest> signUpRequest, ServerWebExchange exchange) {
        return signUpRequest.flatMap(request -> {
            UserEntity user = usersRepository.findByUsername(request.getUsername());
            if (user != null) {
                return Mono.error(new BadCredentialsException("User already exists"));
            }
            UserEntity newUser = new UserEntity();
            newUser.setId(UUID.randomUUID());
            newUser.setUsername(request.getUsername());
            newUser.setPassword(passwordEncoder.encode(request.getPassword()));
            newUser.setEmail(request.getEmail());
            newUser.setCity(request.getCity());
            newUser.setPostalCode(request.getPostalCode());
            newUser.setCountry(request.getCountry());
            newUser.setStreetAddress(request.getStreetAddress());
            newUser.setRoles(Set.of("hub-user"));
            usersRepository.save(newUser);

            JWTClaimsSet.Builder claimsBuilder = new JWTClaimsSet.Builder()
                    .subject(newUser.getUsername())
                    .expirationTime(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                    .claim("type", "E_VERIFY")
                    .claim("email", newUser.getEmail());

            String token = null;
            try {
                token = jwtService.createToken(claimsBuilder);
            } catch (JOSEException e) {
                return Mono.error(new InternalError("Failed to create email verification token"));
            }

            mailService.sendTemplatedEmail(request.getEmail(), "Welcome to The Open Shelf",
                    "email/signup-email-verif",
                    Map.of("username", newUser.getUsername(),
                            "verif_url", emailVerificationUrl + "?token=" + token));

            return Mono.just(ResponseEntity.status(HttpStatus.CREATED).build());
        });
    }

    @Override
    public Mono<ResponseEntity<VerifyEmail200Response>> verifyEmail(String token, ServerWebExchange exchange) {
        try {
            JWTClaimsSet claims = jwtService.verifyToken(token);
            if (claims == null) {
                return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new VerifyEmail200Response()
                        .success(false)
                        .message("Invalid token")));
            }
            if (!claims.getClaim("type").equals("E_VERIFY")) {
                return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new VerifyEmail200Response()
                        .success(false)
                        .message("Invalid token type")));
            }
            UserEntity user = usersRepository.findByUsername(claims.getSubject());
            if (user == null) {
                return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new VerifyEmail200Response()
                        .success(false)
                        .message("User not found")));
            }

            if (user.isEmailVerified()) {
                return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new VerifyEmail200Response()
                        .success(false)
                        .message("Email already verified")));
            }
            user.setEmailVerified(true);
            usersRepository.save(user);

            return Mono.just(ResponseEntity.status(HttpStatus.OK).body(new VerifyEmail200Response().success(true)));
        } catch (Exception e) {
            return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new VerifyEmail200Response()
                    .success(false)
                    .message(e.getMessage())));
        }
    }

}