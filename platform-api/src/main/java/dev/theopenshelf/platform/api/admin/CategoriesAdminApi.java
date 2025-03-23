package dev.theopenshelf.platform.api.admin;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ServerWebExchange;

import dev.theopenshelf.platform.api.CategoriesAdminApiApiDelegate;
import dev.theopenshelf.platform.model.Category;
import dev.theopenshelf.platform.services.CategoriesService;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class CategoriesAdminApi implements CategoriesAdminApiApiDelegate {

    private final CategoriesService categoriesService;

    @Override
    public Mono<ResponseEntity<Category>> addAdminCategory(Mono<Category> category, ServerWebExchange exchange) {
        return category.flatMap(categoriesService::createCategory).map(ResponseEntity::ok);
    }

    @Override
    public Mono<ResponseEntity<Flux<Category>>> getAdminCategories(ServerWebExchange exchange) {
        return Mono.just(ResponseEntity.ok(categoriesService.getAllCategories()));
    }

    @Override
    public Mono<ResponseEntity<Category>> getAdminCategory(UUID categoryId, ServerWebExchange exchange) {
        return categoriesService.getCategoryById(categoryId)
                .map(ResponseEntity::ok);
    }

    @Override
    public Mono<ResponseEntity<Flux<Category>>> getAdminItemCategories(ServerWebExchange exchange) {
        return getAdminCategories(exchange);
    }
}