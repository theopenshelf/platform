package dev.theopenshelf.platform.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.StreamSupport;

import org.springframework.stereotype.Service;

import dev.theopenshelf.platform.entities.CategoryEntity;
import dev.theopenshelf.platform.model.Category;
import dev.theopenshelf.platform.repositories.CategoryRepository;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class CategoriesService {
    private final CategoryRepository categoryRepository;

    public Flux<Category> getCategories() {
        return Flux.fromIterable(categoryRepository.findAll())
                .map(entity -> entity.toCategory().build());
    }

    public Mono<Category> createCategory(Category category) {
        CategoryEntity entity = CategoryEntity.builder()
                .id(category.getId() != null ? category.getId() : UUID.randomUUID())
                .name(category.getName())
                .icon(category.getIcon())
                .color(category.getColor())
                .template(category.getTemplate())
                .build();

        return Mono.just(categoryRepository.save(entity).toCategory().build());
    }

    public Flux<Category> getAllCategories() {
        return getCategories();
    }

    public Mono<Category> getCategoryById(UUID id) {
        return Mono.justOrEmpty(
                categoryRepository.findById(id)
                        .map(entity -> entity.toCategory().build())
                        .orElse(null)
        );
    }
}