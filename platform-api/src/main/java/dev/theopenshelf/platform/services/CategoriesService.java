package dev.theopenshelf.platform.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.StreamSupport;

import org.springframework.stereotype.Service;

import dev.theopenshelf.platform.entities.CategoryEntity;
import dev.theopenshelf.platform.model.Category;
import dev.theopenshelf.platform.repositories.CategoryRepository;

@Service
public class CategoriesService {
    private final CategoryRepository categoryRepository;

    public CategoriesService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getCategories() {
        return StreamSupport.stream(categoryRepository.findAll().spliterator(), false)
                .map(entity -> entity.toCategory().build())
                .toList();
    }

    public Category createCategory(Category category) {
        CategoryEntity entity = CategoryEntity.builder()
                .id(category.getId() != null ? category.getId() : UUID.randomUUID())
                .name(category.getName())
                .icon(category.getIcon())
                .color(category.getColor())
                .template(category.getTemplate())
                .build();

        return categoryRepository.save(entity).toCategory().build();
    }

    public List<Category> getAllCategories() {
        return getCategories();
    }

    public Optional<Category> getCategoryById(UUID id) {
        return categoryRepository.findById(id)
                .map(entity -> entity.toCategory().build());
    }
}