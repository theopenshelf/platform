package dev.theopenshelf.platform.api.hub.profile;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ServerWebExchange;

import dev.theopenshelf.platform.api.ProfileHubApiApiDelegate;
import dev.theopenshelf.platform.model.User;
import dev.theopenshelf.platform.services.UsersService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileCommunityApi implements ProfileHubApiApiDelegate {

    private final UsersService usersService;

    @Override
    public Mono<ResponseEntity<User>> updateProfile(Mono<User> userMono, ServerWebExchange exchange) {
        //TODO only update the profile if the current user is trying to edit his profile. ie user.id === userId
        return exchange.getPrincipal()
                .map(principal -> UUID.fromString(principal.getName()))
                .flatMap(userId -> userMono.flatMap(user -> usersService.updateProfile(userId, user)
                        .map(ResponseEntity::ok)))
                .onErrorResume(e -> {
                    log.error("Failed to update user profile", e);
                    return Mono.just(ResponseEntity.internalServerError().build());
                });
    }
}