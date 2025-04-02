package dev.theopenshelf.platform.services;

import java.util.Arrays;
import java.util.Map;
import java.util.UUID;

import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;

import dev.theopenshelf.platform.entities.NotificationEntity;
import dev.theopenshelf.platform.entities.UserEntity;
import dev.theopenshelf.platform.exceptions.CodedException;
import dev.theopenshelf.platform.exceptions.CodedError;
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
                                    .orElseThrow(() -> new CodedException(
                                            CodedError.INTERNAL_ERROR.getCode(),
                                            "Notification not found",
                                            Map.of("notificationId", notification.getId()),
                                            CodedError.INTERNAL_ERROR.getDocumentationUrl()));
                            entity.setAlreadyRead(true);
                            notificationRepository.save(entity);
                            log.debug("Marked notification {} as read", notification.getId());
                        });
                        log.info("Successfully acknowledged {} notifications", notifList.size());
                        return Mono.empty();
                    } catch (Exception e) {
                        log.error("Failed to acknowledge notifications", e);
                        if (e instanceof CodedException) {
                            return Mono.error(e);
                        }
                        return Mono.error(new CodedException(
                                CodedError.INTERNAL_ERROR.getCode(),
                                "Failed to acknowledge notifications",
                                Map.of("userId", userId, "error", e.getMessage()),
                                CodedError.INTERNAL_ERROR.getDocumentationUrl(),
                                e));
                    }
                });
    }

    public Flux<Notification> getNotifications(UUID userId) {
        log.info("Retrieving notifications for user {}", userId);
        try {
            return Flux.fromIterable(notificationRepository.findAllByUserId(userId))
                    .map(entity -> entity.toNotification().build());
        } catch (Exception e) {
            log.error("Failed to retrieve notifications", e);
            return Flux.error(new CodedException(
                    CodedError.INTERNAL_ERROR.getCode(),
                    "Failed to retrieve notifications",
                    Map.of("userId", userId, "error", e.getMessage()),
                    CodedError.INTERNAL_ERROR.getDocumentationUrl(),
                    e));
        }
    }

    public Mono<GetUnreadNotificationsCount200Response> getUnreadNotificationsCount(UUID userId) {
        log.info("Getting unread notifications count for user {}", userId);
        try {
            long count = notificationRepository.countByUserIdAndAlreadyReadFalse(userId);
            return Mono.just(new GetUnreadNotificationsCount200Response().count((int) count));
        } catch (Exception e) {
            log.error("Failed to get unread notifications count", e);
            return Mono.error(new CodedException(
                    CodedError.INTERNAL_ERROR.getCode(),
                    "Failed to get unread notifications count",
                    Map.of("userId", userId, "error", e.getMessage()),
                    CodedError.INTERNAL_ERROR.getDocumentationUrl(),
                    e));
        }
    }

    public Mono<Void> sendNotifications(UserEntity user, NotificationEntity notification) {
        try {
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
                        .args(getMessageArgs(notification))
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
        } catch (Exception e) {
            log.error("Failed to send notification", e);
            return Mono.error(new CodedException(
                    CodedError.INTERNAL_ERROR.getCode(),
                    "Failed to send notification",
                    Map.of("userId", user.getId(), "error", e.getMessage()),
                    CodedError.INTERNAL_ERROR.getDocumentationUrl(),
                    e));
        }
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