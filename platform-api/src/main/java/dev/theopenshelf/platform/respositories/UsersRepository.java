package dev.theopenshelf.platform.respositories;

import java.util.UUID;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import dev.theopenshelf.platform.entities.UserEntity;
import reactor.core.publisher.Mono;

public interface UsersRepository extends ReactiveCrudRepository<UserEntity, UUID> {
    Mono<UserEntity> findByUsername(String login);
}
