package dev.theopenshelf.platform.services;

import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;

import dev.theopenshelf.platform.entities.HelpArticleEntity;
import dev.theopenshelf.platform.entities.HelpCategoryEntity;
import dev.theopenshelf.platform.exceptions.CodedException;
import dev.theopenshelf.platform.exceptions.CodedError;
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
        helpArticleRepository.save(HelpArticleEntity.fromHelpArticle(article));
        return Mono.empty();
    }

    public Mono<Void> createHelpCategory(HelpCategory category) {
        helpCategoryRepository.save(HelpCategoryEntity.fromHelpCategory(category));
        return Mono.empty();
    }

    public Mono<Void> deleteHelpArticle(String articleId) {
        helpArticleRepository.deleteById(UUID.fromString(articleId));
        return Mono.empty();
    }

    public Mono<Void> deleteHelpCategory(String categoryId) {
        helpCategoryRepository.deleteById(UUID.fromString(categoryId));
        return Mono.empty();
    }

    public Mono<Void> updateHelpArticle(String articleId, HelpArticle article) {
        HelpArticleEntity entity = helpArticleRepository.findById(UUID.fromString(articleId))
                .orElseThrow(() -> new CodedException(CodedError.HELP_ARTICLE_NOT_FOUND.getCode(),
                        CodedError.HELP_ARTICLE_NOT_FOUND.getDefaultMessage(),
                        Map.of("articleId", articleId),
                        CodedError.HELP_ARTICLE_NOT_FOUND.getDocumentationUrl()));

        entity.updateFromHelpArticle(article);
        helpArticleRepository.save(entity);
        return Mono.empty();
    }

    public Mono<Void> updateHelpCategory(String categoryId, HelpCategory category) {
        HelpCategoryEntity entity = helpCategoryRepository.findById(UUID.fromString(categoryId))
                .orElseThrow(() -> new CodedException(CodedError.HELP_CATEGORY_NOT_FOUND.getCode(),
                        CodedError.HELP_CATEGORY_NOT_FOUND.getDefaultMessage(),
                        Map.of("categoryId", categoryId),
                        CodedError.HELP_CATEGORY_NOT_FOUND.getDocumentationUrl()));

        entity.updateFromHelpCategory(category);
        helpCategoryRepository.save(entity);
        return Mono.empty();
    }
}