package dev.theopenshelf.platform.respositories;

import java.util.UUID;

import org.springframework.data.repository.CrudRepository;

import dev.theopenshelf.platform.entities.UserEntity;

public interface UsersRepository extends CrudRepository<UserEntity, UUID> {
    UserEntity findByUsername(String login);
}
