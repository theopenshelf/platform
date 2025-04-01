package dev.theopenshelf.platform.api.hub.debug;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ServerWebExchange;

import dev.theopenshelf.platform.api.DebugApiApiDelegate;
import dev.theopenshelf.platform.entities.NotificationEntity;
import dev.theopenshelf.platform.entities.NotificationType;
import dev.theopenshelf.platform.entities.UserEntity;
import dev.theopenshelf.platform.model.DebugPostNotificationRequest;
import dev.theopenshelf.platform.model.Notification;
import dev.theopenshelf.platform.repositories.UsersRepository;
import dev.theopenshelf.platform.services.NotificationsService;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
public class DebugApi implements DebugApiApiDelegate {

    private final UsersRepository usersRepository;
    private final NotificationsService notificationService;

    @Override
    public Mono<ResponseEntity<Notification>> debugPostNotification(
            Mono<DebugPostNotificationRequest> debugPostNotificationRequest,
            ServerWebExchange exchange) {
        return debugPostNotificationRequest
                .map(request -> {
                    try {
                        UserEntity user = usersRepository.findById(request.getUserId())
                                .orElseThrow(() -> new IllegalArgumentException("User not found"));
                        Notification notification = request.getNotification();

                        // Set default values if not provided
                        if (notification.getAuthor() == null) {
                            notification.setAuthor("debug");
                        }
                        if (notification.getAlreadyRead() == null) {
                            notification.setAlreadyRead(false);
                        }
                        if (notification.getDate() == null) {
                            notification.setDate(OffsetDateTime.now(ZoneOffset.UTC));
                        }

                        @SuppressWarnings("unchecked")
                        Map<String, Object> payload = (Map<String, Object>) notification.getPayload();

                        NotificationEntity notificationEntity = NotificationEntity.builder()
                                .author(notification.getAuthor())
                                .date(notification.getDate().toInstant())
                                .type(NotificationType.valueOf(notification.getType().name()))
                                .alreadyRead(notification.getAlreadyRead())
                                .payload(payload)
                                .build();

                        notificationService.sendNotifications(user, notificationEntity);

                        return notificationEntity.toNotification().build();
                    } catch (Exception e) {
                        throw new IllegalArgumentException("Failed to process notification", e);
                    }
                })
                .map(ResponseEntity::ok)
                .onErrorResume(IllegalArgumentException.class,
                        e -> Mono.just(ResponseEntity.notFound().build()))
                .onErrorResume(Exception.class,
                        e -> Mono.just(ResponseEntity.badRequest().build()));
    }
}
