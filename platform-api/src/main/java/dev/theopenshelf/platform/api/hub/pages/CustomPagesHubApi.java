package dev.theopenshelf.platform.api.hub.pages;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ServerWebExchange;

import dev.theopenshelf.platform.api.CustomPagesHubApiApiDelegate;
import dev.theopenshelf.platform.model.CustomPage;
import dev.theopenshelf.platform.model.GetCustomPageRefs200ResponseInner;
import dev.theopenshelf.platform.services.CustomPagesService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomPagesHubApi implements CustomPagesHubApiApiDelegate {

    private final CustomPagesService customPagesService;

    @Override
    public Mono<ResponseEntity<CustomPage>> createCommunityCustomPage(UUID communityId, Mono<CustomPage> customPage,
            ServerWebExchange exchange) {
        return exchange.getPrincipal()
                .map(principal -> UUID.fromString(principal.getName()))
                .flatMap(currentUserId -> customPage
                .flatMap(page -> customPagesService.createCommunityCustomPage(communityId, page, currentUserId))
                .map(page -> ResponseEntity.status(HttpStatus.CREATED).body(page)));
    }

    @Override
    public Mono<ResponseEntity<Void>> deleteCommunityCustomPage(UUID communityId, String pageRef,
            ServerWebExchange exchange) {
        return exchange.getPrincipal()
                .map(principal -> UUID.fromString(principal.getName()))
                .flatMap(currentUserId -> customPagesService.deleteCommunityCustomPage(communityId, pageRef, currentUserId)
                .then(Mono.just(ResponseEntity.noContent().<Void>build()))
                .defaultIfEmpty(ResponseEntity.notFound().build()));
    }

    @Override
    public Mono<ResponseEntity<CustomPage>> getCommunityCustomPage(UUID communityId, String pageRef,
            ServerWebExchange exchange) {
        return exchange.getPrincipal()
                .map(principal -> UUID.fromString(principal.getName()))
                .flatMap(currentUserId -> customPagesService.getCommunityCustomPage(communityId, pageRef, currentUserId)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build()));
    }

    @Override
    public Mono<ResponseEntity<Flux<CustomPage>>> getCommunityCustomPages(UUID communityId,
            ServerWebExchange exchange) {
        return exchange.getPrincipal()
                .map(principal -> UUID.fromString(principal.getName()))
                .map(currentUserId -> customPagesService.getCommunityCustomPages(communityId, currentUserId))
                .map(ResponseEntity::ok);
    }

    @Override
    public Mono<ResponseEntity<CustomPage>> getCustomPage(String pageRef, ServerWebExchange exchange) {
        return customPagesService.getCustomPage(pageRef)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @Override
    public Mono<ResponseEntity<Flux<GetCustomPageRefs200ResponseInner>>> getCustomPageRefs(ServerWebExchange exchange) {
        return Mono.just(ResponseEntity.ok(customPagesService.getCustomPageRefs()));
    }

    @Override
    public Mono<ResponseEntity<CustomPage>> updateCommunityCustomPage(UUID communityId, String pageRef,
            Mono<CustomPage> customPage, ServerWebExchange exchange) {
        return exchange.getPrincipal()
                .map(principal -> UUID.fromString(principal.getName()))
                .flatMap(currentUserId -> customPage.flatMap(page -> customPagesService.updateCommunityCustomPage(communityId, pageRef, page, currentUserId))
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build()));
    }
}