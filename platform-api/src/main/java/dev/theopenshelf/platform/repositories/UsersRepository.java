package dev.theopenshelf.platform.repositories;

import java.util.UUID;

import org.springframework.data.repository.CrudRepository;

import dev.theopenshelf.platform.entities.UserEntity;

public interface UsersRepository extends CrudRepository<UserEntity, UUID> {
    UserEntity findByUsername(String login);

    UserEntity findByEmail(String email);
}
