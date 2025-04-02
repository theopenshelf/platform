package dev.theopenshelf.platform.services;

import java.util.Arrays;
import java.util.UUID;

import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;

import dev.theopenshelf.platform.entities.NotificationEntity;
import dev.theopenshelf.platform.entities.UserEntity;
import dev.theopenshelf.platform.model.GetUnreadNotificationsCount200Response;
import dev.theopenshelf.platform.model.Notification;
import dev.theopenshelf.platform.repositories.NotificationRepository;
import dev.theopenshelf.platform.services.MailService.TemplateVariable;
import dev.theopenshelf.platform.services.MailService.TemplateVariableType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationsService {

    public static final String PLATFORM_AUTHOR = "Platform";
    private final NotificationRepository notificationRepository;
    private final MailService mailService;
    private final MessageSource messageSource;

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
        // TODO convert the payload so the itemId is replaced by the actual item
        return Flux.fromIterable(notificationRepository.findAllByUserId(userId))
                .map(entity -> entity.toNotification().build());
    }

    public Mono<GetUnreadNotificationsCount200Response> getUnreadNotificationsCount(UUID userId) {
        log.info("Getting unread notifications count for user {}", userId);
        long count = notificationRepository.countByUserIdAndAlreadyReadFalse(userId);
        return Mono.just(new GetUnreadNotificationsCount200Response().count((int) count));
    }

    public Mono<Void> sendNotifications(UserEntity user, NotificationEntity notification) {
        notification.setId(UUID.randomUUID());
        notification.setUserId(user.getId());
        notificationRepository.save(notification);

        if (user.getEmail().endsWith("example.com")) {
            log.info("Skipping email notification for @example.com mails");
        } else {
            // Create template variables for the email
            var titleVar = TemplateVariable.builder()
                    .type(TemplateVariableType.TRANSLATABLE_TEXT)
                    .ref("title")
                    .translateKey("notification." + notification.getType().name().toLowerCase() + ".title")
                    .args(getMessageArgs(notification))
                    .build();

            var contentVar = TemplateVariable.builder()
                    .type(TemplateVariableType.TRANSLATABLE_TEXT)
                    .ref("content")
                    .translateKey("notification." + notification.getType().name().toLowerCase() + ".content")
                    .args(getMessageArgs( notification))
                    .build();

            var usernameVar = TemplateVariable.builder()
                    .type(TemplateVariableType.RAW)
                    .ref("username")
                    .value(user.getUsername())
                    .build();

            mailService.sendTemplatedEmail(
                    user,
                    notification.getType().name(),
                    "email/notification",
                    Arrays.asList(titleVar, contentVar, usernameVar));
        }
        log.info("Successfully send {} notification", notification);
        return Mono.empty();
    }

    private Object[] getMessageArgs(NotificationEntity entity) {
        // Extract arguments from the notification payload based on type
        switch (entity.getType()) {
            case ITEM_AVAILABLE:
                return new Object[] {
                        entity.getPayload().get("itemName")
                };
            case ITEM_DUE:
                return new Object[] {
                        entity.getPayload().get("itemName"),
                        entity.getPayload().get("dueDate")
                };
            // Add cases for other notification types
            default:
                return new Object[] {};
        }
    }
}