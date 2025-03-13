package dev.theopenshelf.platform.api.admin;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ServerWebExchange;

import dev.theopenshelf.platform.api.CustomPagesAdminApiApiDelegate;
import dev.theopenshelf.platform.model.CustomPage;
import dev.theopenshelf.platform.services.CustomPagesService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomPagesAdminApi implements CustomPagesAdminApiApiDelegate {

    private final CustomPagesService customPagesService;

    @Override
    public Mono<ResponseEntity<CustomPage>> createCustomPage(Mono<CustomPage> customPage, ServerWebExchange exchange) {
        return customPage
                .flatMap(page -> customPagesService.createCommunityCustomPage(null, page))
                .map(page -> ResponseEntity.status(HttpStatus.CREATED).body(page));
    }

    @Override
    public Mono<ResponseEntity<Void>> deleteCustomPage(String pageRef, ServerWebExchange exchange) {
        return customPagesService.deleteCommunityCustomPage(null, pageRef)
                .then(Mono.just(ResponseEntity.noContent().<Void>build()))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @Override
    public Mono<ResponseEntity<CustomPage>> getAdminCustomPage(String pageRef, ServerWebExchange exchange) {
        return customPagesService.getCustomPage(pageRef)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @Override
    public Mono<ResponseEntity<Flux<CustomPage>>> getAdminCustomPages(ServerWebExchange exchange) {
        return Mono.just(ResponseEntity.ok(customPagesService.getCustomPageRefs()
                .map(ref -> new CustomPage()
                        .ref(ref.getRef())
                        .title(ref.getTitle())
                        .position(CustomPage.PositionEnum.valueOf(ref.getPosition().name())))));
    }

    @Override
    public Mono<ResponseEntity<CustomPage>> updateCustomPage(String pageRef, Mono<CustomPage> customPage,
            ServerWebExchange exchange) {
        return customPage
                .flatMap(page -> customPagesService.updateCommunityCustomPage(null, pageRef, page))
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
}