package dev.theopenshelf.platform.services;

import java.util.UUID;

import org.springframework.stereotype.Service;

import dev.theopenshelf.platform.entities.HelpArticleEntity;
import dev.theopenshelf.platform.entities.HelpCategoryEntity;
import dev.theopenshelf.platform.model.HelpArticle;
import dev.theopenshelf.platform.model.HelpCategory;
import dev.theopenshelf.platform.repositories.HelpArticleRepository;
import dev.theopenshelf.platform.repositories.HelpCategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class HelpService {
    private final HelpArticleRepository helpArticleRepository;
    private final HelpCategoryRepository helpCategoryRepository;

    public Flux<HelpArticle> getHelpArticles(String categoryId) {
        return Flux.fromIterable(helpArticleRepository.findAllByCategoryId(UUID.fromString(categoryId)))
                .map(HelpArticleEntity::toHelpArticle)
                .map(HelpArticle.HelpArticleBuilder::build);
    }

    public Flux<HelpCategory> getHelpCategories() {
        return Flux.fromIterable(helpCategoryRepository.findAll())
                .map(HelpCategoryEntity::toHelpCategory)
                .map(HelpCategory.HelpCategoryBuilder::build);
    }

    public Mono<Void> createHelpArticle(HelpArticle article) {
        return Mono.fromRunnable(() -> {
            HelpArticleEntity entity = HelpArticleEntity.fromHelpArticle(article);
            helpArticleRepository.save(entity);
        });
    }

    public Mono<Void> createHelpCategory(HelpCategory category) {
        return Mono.fromRunnable(() -> {
            HelpCategoryEntity entity = HelpCategoryEntity.fromHelpCategory(category);
            helpCategoryRepository.save(entity);
        });
    }

    public Mono<Void> deleteHelpArticle(String articleId) {
        return Mono.fromRunnable(() -> {
            helpArticleRepository.deleteById(UUID.fromString(articleId));
        });
    }

    public Mono<Void> deleteHelpCategory(String categoryId) {
        return Mono.fromRunnable(() -> {
            helpCategoryRepository.deleteById(UUID.fromString(categoryId));
        });
    }

    public Mono<Void> updateHelpArticle(String articleId, HelpArticle article) {
        return Mono.fromRunnable(() -> {
            HelpArticleEntity entity = helpArticleRepository.findById(UUID.fromString(articleId))
                    .orElseThrow(() -> new RuntimeException("Article not found"));
            entity.updateFromHelpArticle(article);
            helpArticleRepository.save(entity);
        });
    }

    public Mono<Void> updateHelpCategory(String categoryId, HelpCategory category) {
        return Mono.fromRunnable(() -> {
            HelpCategoryEntity entity = helpCategoryRepository.findById(UUID.fromString(categoryId))
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            entity.updateFromHelpCategory(category);
            helpCategoryRepository.save(entity);
        });
    }
}