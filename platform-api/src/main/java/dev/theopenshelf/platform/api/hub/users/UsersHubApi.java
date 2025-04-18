package dev.theopenshelf.platform.api.hub.users;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ServerWebExchange;

import dev.theopenshelf.platform.api.UsersHubApiApiDelegate;
import dev.theopenshelf.platform.model.User;
import dev.theopenshelf.platform.services.UsersService;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class UsersHubApi implements UsersHubApiApiDelegate {

    private final UsersService usersService;

    @Override
    public Mono<ResponseEntity<User>> getHubUserById(UUID id, ServerWebExchange exchange) {
        return usersService.getUserById(id).map(ResponseEntity::ok); // Blocking to get the synchronous result
    }

    @Override
    public Mono<ResponseEntity<Flux<User>>> getHubUsers(String query, Integer limit, ServerWebExchange exchange) {
        return Mono.just(ResponseEntity.ok(usersService.getUsers(query, limit)));
    }
}