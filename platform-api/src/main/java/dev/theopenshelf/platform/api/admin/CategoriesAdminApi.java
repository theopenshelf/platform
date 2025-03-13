package dev.theopenshelf.platform.api.admin;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ServerWebExchange;

import dev.theopenshelf.platform.api.CategoriesAdminApiApiDelegate;
import dev.theopenshelf.platform.model.Category;
import dev.theopenshelf.platform.services.CategoriesService;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class CategoriesAdminApi implements CategoriesAdminApiApiDelegate {

    private final CategoriesService categoriesService;

    public CategoriesAdminApi(CategoriesService categoriesService) {
        this.categoriesService = categoriesService;
    }

    @Override
    public Mono<ResponseEntity<Category>> addAdminCategory(Mono<Category> category, ServerWebExchange exchange) {
        return category.map(cat -> {
            Category savedCategory = categoriesService.createCategory(cat);
            return ResponseEntity.ok(savedCategory);
        });
    }

    @Override
    public Mono<ResponseEntity<Flux<Category>>> getAdminCategories(ServerWebExchange exchange) {
        Flux<Category> categories = Flux.fromIterable(categoriesService.getAllCategories());
        return Mono.just(ResponseEntity.ok(categories));
    }

    @Override
    public Mono<ResponseEntity<Category>> getAdminCategory(UUID categoryId, ServerWebExchange exchange) {
        return Mono.just(categoriesService.getCategoryById(categoryId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build()));
    }

    @Override
    public Mono<ResponseEntity<Flux<Category>>> getAdminItemCategories(ServerWebExchange exchange) {
        return getAdminCategories(exchange);
    }
}