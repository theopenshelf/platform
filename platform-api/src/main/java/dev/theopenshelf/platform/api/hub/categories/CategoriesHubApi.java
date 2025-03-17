package dev.theopenshelf.platform.api.hub.categories;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ServerWebExchange;

import dev.theopenshelf.platform.api.CategoriesHubApiApiDelegate;
import dev.theopenshelf.platform.model.Category;
import dev.theopenshelf.platform.services.CategoriesService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoriesHubApi implements CategoriesHubApiApiDelegate {

    private final CategoriesService categoriesService;

    @Override
    public Mono<ResponseEntity<Flux<Category>>> getCategories(ServerWebExchange exchange) {
        //TODO this can be cached for 24h by the browser
        return Mono.just(ResponseEntity.ok(Flux.fromIterable(categoriesService.getCategories())));
    }
}