package dev.theopenshelf.platform.services;

import java.util.UUID;

import org.springframework.stereotype.Service;

import dev.theopenshelf.platform.entities.NotificationEntity;
import dev.theopenshelf.platform.model.GetUnreadNotificationsCount200Response;
import dev.theopenshelf.platform.model.Notification;
import dev.theopenshelf.platform.repositories.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationsService {
    private final NotificationRepository notificationRepository;

    public Mono<Void> acknowledgeNotifications(UUID userId, Flux<Notification> notifications) {
        return notifications.collectList()
                .flatMap(notifList -> {
                    try {
                        notifList.forEach(notification -> {
                            NotificationEntity entity = notificationRepository
                                    .findById(notification.getId())
                                    .orElseThrow();
                            entity.setAlreadyRead(true);
                            notificationRepository.save(entity);
                            log.debug("Marked notification {} as read", notification.getId());
                        });
                        log.info("Successfully acknowledged {} notifications", notifList.size());
                        return Mono.empty();
                    } catch (Exception e) {
                        log.error("Failed to acknowledge notifications", e);
                        return Mono.error(e);
                    }
                });
    }

    public Flux<Notification> getNotifications(UUID userId) {
        log.info("Retrieving notifications for user {}", userId);
        return Flux.fromIterable(notificationRepository.findAllByUserId(userId))
                .map(entity -> entity.toNotification().build());
    }

    public Mono<GetUnreadNotificationsCount200Response> getUnreadNotificationsCount(UUID userId) {
        log.info("Getting unread notifications count for user {}", userId);
        long count = notificationRepository.countByUserIdAndAlreadyReadFalse(userId);
        return Mono.just(new GetUnreadNotificationsCount200Response().count((int) count));
    }
}