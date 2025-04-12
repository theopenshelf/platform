package dev.theopenshelf.platform.services;

import java.util.UUID;

import org.springframework.stereotype.Service;

import dev.theopenshelf.platform.entities.NotificationSettingsEntity;
import dev.theopenshelf.platform.entities.UserEntity;
import dev.theopenshelf.platform.model.NotificationSettings;
import dev.theopenshelf.platform.repositories.NotificationSettingsRepository;
import dev.theopenshelf.platform.repositories.UsersRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationSettingsService {
    private final NotificationSettingsRepository notificationSettingsRepository;
    private final UsersRepository usersRepository;

    public Mono<NotificationSettings> getNotificationSettings(UUID userId) {
        log.info("Getting notification settings for user: {}", userId);
        UserEntity user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return Mono.just(notificationSettingsRepository.findByUser(user)
                .orElseGet(() -> createDefaultSettings(user))
                .toNotificationSettings());
    }

    public Mono<NotificationSettings> updateNotificationSettings(UUID userId, NotificationSettings settings) {
        log.info("Updating notification settings for user: {}", userId);
        UserEntity user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        NotificationSettingsEntity entity = notificationSettingsRepository.findByUser(user)
                .orElseGet(() -> NotificationSettingsEntity.builder()
                        .id(UUID.randomUUID())
                        .user(user)
                        .build());

        entity.setEnableNotifications(settings.getEnableNotifications());
        NotificationSettingsEntity savedEntity = notificationSettingsRepository.save(entity);
        return Mono.just(savedEntity.toNotificationSettings());
    }

    private NotificationSettingsEntity createDefaultSettings(UserEntity user) {
        NotificationSettingsEntity entity = NotificationSettingsEntity.builder()
                .id(UUID.randomUUID())
                .user(user)
                .enableNotifications(true) // Enable notifications by default
                .build();
        return notificationSettingsRepository.save(entity);
    }
} 