package dev.theopenshelf.platform.api.publicapi;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.server.context.ServerSecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ServerWebExchange;

import dev.theopenshelf.platform.api.AuthApiDelegate;
import dev.theopenshelf.platform.model.LoginRequest;
import dev.theopenshelf.platform.model.User;
import dev.theopenshelf.platform.respositories.UsersRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthApi implements AuthApiDelegate {
    private final ReactiveAuthenticationManager authenticationManager;
    private final UsersRepository usersRepository;
    private final ServerSecurityContextRepository serverSecurityContextRepository;

    @Override
    public Mono<ResponseEntity<User>> login(Mono<LoginRequest> loginRequest, ServerWebExchange exchange) {
        return loginRequest
                .flatMap(request -> authenticationManager.authenticate(UsernamePasswordAuthenticationToken.unauthenticated(request.getUsername(), request.getPassword())))
                .zipWhen(authentication -> usersRepository.findByUsername(authentication.getName()))
                .flatMap(tuple -> {
                    SecurityContext context = SecurityContextHolder.createEmptyContext();
                    context.setAuthentication(tuple.getT1());
                    SecurityContextHolder.setContext(context);
                    return serverSecurityContextRepository.save(exchange, context).thenReturn(tuple.getT2());
                })
                .map(user -> ResponseEntity.status(HttpStatus.OK).body(user.toUser().build()))
                .onErrorResume(e -> e instanceof BadCredentialsException ?
                        Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()) :
                        Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build())
                );
    }
}