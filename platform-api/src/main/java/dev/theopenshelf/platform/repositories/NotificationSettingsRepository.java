package dev.theopenshelf.platform.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import dev.theopenshelf.platform.entities.NotificationSettingsEntity;
import dev.theopenshelf.platform.entities.UserEntity;

@Repository
public interface NotificationSettingsRepository extends CrudRepository<NotificationSettingsEntity, UUID> {
    Optional<NotificationSettingsEntity> findByUser(UserEntity user);
} 