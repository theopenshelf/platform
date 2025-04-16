package dev.theopenshelf.platform.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;

import dev.theopenshelf.platform.entities.ItemImageEntity;
import dev.theopenshelf.platform.entities.NotificationEntity;
import dev.theopenshelf.platform.entities.NotificationType;
import dev.theopenshelf.platform.entities.UserEntity;
import dev.theopenshelf.platform.exceptions.CodedError;
import dev.theopenshelf.platform.exceptions.CodedException;
import dev.theopenshelf.platform.model.GetUnreadNotificationsCount200Response;
import dev.theopenshelf.platform.model.ItemImage;
import dev.theopenshelf.platform.model.Notification;
import dev.theopenshelf.platform.repositories.ItemImageRepository;
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
    private final ItemImageRepository itemImageRepository;

    @Value("${oshelf.frontend-url}")
    private String frontendUrl;

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
                    .flatMap(entity -> {
                        // Fetch the image with order = 0
                        Notification notification = entity.toNotification().build();
                        if (entity.getItem() != null) {
                            Optional<ItemImageEntity> imageOpt = itemImageRepository
                                    .findFirstImageByItemId(entity.getItem().getId());
                            imageOpt.ifPresent(image -> {
                                // Enrich the notification with image details
                                if (notification.getItem() != null) {
                                    notification.getItem().setImages(List.of(
                                            image.toItemImage()));
                                }
                            });
                        }
                        return Mono.just(notification);

                    });
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
        return this.sendNotifications(user, notification, user.getLocale());
    }

    public Mono<Void> sendNotifications(UserEntity user, NotificationEntity notification, Locale locale) {
        try {
            notification.setId(UUID.randomUUID());
            notification.setUserId(user.getId());
            notificationRepository.save(notification);

            // Create template variables for the email
            List<TemplateVariable> templateVariables = getTemplateVariables(notification.getType(), notification);

            templateVariables.add(
                    TemplateVariable.builder()
                            .type(TemplateVariableType.RAW)
                            .ref("username")
                            .value(user.getUsername())
                            .build());

            mailService.sendTemplatedEmail(
                    user,
                    "notification." + notification.getType().name().toLowerCase() + ".email.title",
                    "email/" + notification.getType().getEmailTemplate(),
                    templateVariables,
                    locale);
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

    private List<TemplateVariable> getTemplateVariables(NotificationType type, NotificationEntity notification) {
        List<TemplateVariable> variables = new ArrayList<>();

        if (notification.getItem() != null) {
            variables.add(
                    TemplateVariable.builder()
                            .type(TemplateVariableType.RAW)
                            .ref("itemName")
                            .value(notification.getItem().getName())
                            .build());
            Optional<String> imgUrl = notification.getItem().getImages().stream().filter(i -> i.getOrder() == 0)
                    .findFirst()
                    .map(ItemImageEntity::getImageUrl)
                    .map(u -> {
                        if (u.startsWith("/")) {
                            u = frontendUrl + u;
                        }
                        return u;
                    });
            imgUrl.ifPresent(u -> variables.add(
                    TemplateVariable.builder()
                            .type(TemplateVariableType.RAW)
                            .ref("itemImageUrl")
                            .value(u)
                            .build()));

            variables.add(
                    TemplateVariable.builder()
                            .type(TemplateVariableType.RAW)
                            .ref("itemOwner")
                            .value(notification.getItem().getOwner())
                            .build());

            variables.add(
                    TemplateVariable.builder()
                            .type(TemplateVariableType.RAW)
                            .ref("itemUrl")
                            .value(frontendUrl + "/hub/items/" + notification.getItem().getId())
                            .build());
        }

        switch (type) {
            case ITEM_AVAILABLE -> {
                // Already handled by common variables
            }
            case ITEM_DUE -> {
                variables.add(TemplateVariable.builder()
                        .type(TemplateVariableType.RAW)
                        .ref("dueDate")
                        .value(notification.getPayload().get("dueDate"))
                        .build());
            }
            case ITEM_BORROW_RESERVATION_DATE_START -> {
                variables.add(TemplateVariable.builder()
                        .type(TemplateVariableType.RAW)
                        .ref("startDate")
                        .value(notification.getPayload().get("startDate"))
                        .build());
            }
            case ITEM_RESERVED_NO_LONGER_AVAILABLE -> {
                // Already handled by common variables
            }
            case ITEM_NEW_RESERVATION_TO_CONFIRM -> {
                variables.addAll(Arrays.asList(
                        TemplateVariable.builder()
                                .type(TemplateVariableType.RAW)
                                .ref("borrowerName")
                                .value(notification.getPayload().get("borrowerName"))
                                .build(),
                        TemplateVariable.builder()
                                .type(TemplateVariableType.RAW)
                                .ref("confirmUrl")
                                .value(frontendUrl + "/admin/reservations/"
                                        + notification.getPayload().get("reservationId"))
                                .build()));
            }
            case ITEM_NEW_PICKUP_TO_CONFIRM -> {
                variables.addAll(Arrays.asList(
                        TemplateVariable.builder()
                                .type(TemplateVariableType.RAW)
                                .ref("borrowerName")
                                .value(notification.getPayload().get("borrowerName"))
                                .build(),
                        TemplateVariable.builder()
                                .type(TemplateVariableType.RAW)
                                .ref("confirmUrl")
                                .value(frontendUrl + "/admin/pickups/" + notification.getPayload().get("pickupId"))
                                .build()));
            }
            case ITEM_NEW_RETURN_TO_CONFIRM -> {
                variables.addAll(Arrays.asList(
                        TemplateVariable.builder()
                                .type(TemplateVariableType.RAW)
                                .ref("borrowerName")
                                .value(notification.getPayload().get("borrowerName"))
                                .build(),
                        TemplateVariable.builder()
                                .type(TemplateVariableType.RAW)
                                .ref("confirmUrl")
                                .value(frontendUrl + "/admin/returns/" + notification.getPayload().get("returnId"))
                                .build()));
            }
            case ITEM_RESERVATION_APPROVED, ITEM_PICK_UP_APPROVED, ITEM_RETURN_APPROVED -> {
                // Already handled by common variables
            }
        }
        return variables;
    }
}