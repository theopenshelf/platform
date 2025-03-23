package dev.theopenshelf.platform.api.hub.notifications;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ServerWebExchange;

import dev.theopenshelf.platform.api.NotificationsHubApiApiDelegate;
import dev.theopenshelf.platform.model.GetUnreadNotificationsCount200Response;
import dev.theopenshelf.platform.model.Notification;
import dev.theopenshelf.platform.services.NotificationsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationsHubApi implements NotificationsHubApiApiDelegate {

    private final NotificationsService notificationsService;

    @Override
    public Mono<ResponseEntity<Void>> acknowledgeNotifications(Flux<Notification> notifications,
            ServerWebExchange exchange) {
        return exchange.getPrincipal()
                .map(principal -> UUID.fromString(principal.getName()))
                .flatMap(userId -> notificationsService.acknowledgeNotifications(userId, notifications))
                .then(Mono.just(ResponseEntity.noContent().<Void>build()))
                .onErrorResume(e -> {
                    log.error("Error acknowledging notifications", e);
                    return Mono.just(ResponseEntity.internalServerError().<Void>build());
                });
    }

    @Override
    public Mono<ResponseEntity<Flux<Notification>>> getNotifications(ServerWebExchange exchange) {
        return exchange.getPrincipal()
                .map(principal -> UUID.fromString(principal.getName()))
                .map(userId -> ResponseEntity.ok(notificationsService.getNotifications(userId)));
    }

    @Override
    public Mono<ResponseEntity<GetUnreadNotificationsCount200Response>> getUnreadNotificationsCount(
            ServerWebExchange exchange) {
        return exchange.getPrincipal()
                .map(principal -> UUID.fromString(principal.getName()))
                .flatMap(notificationsService::getUnreadNotificationsCount)
                .map(ResponseEntity::ok);
    }
}