package dev.theopenshelf.platform.api.admin;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ServerWebExchange;

import dev.theopenshelf.platform.api.HelpAdminApiApiDelegate;
import dev.theopenshelf.platform.model.HelpArticle;
import dev.theopenshelf.platform.model.HelpCategory;
import dev.theopenshelf.platform.services.HelpService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class HelpAdminApi implements HelpAdminApiApiDelegate {

    private final HelpService helpService;

    @Override
    public Mono<ResponseEntity<Void>> createHelpArticle(Mono<HelpArticle> helpArticle, ServerWebExchange exchange) {
        return helpArticle
                .flatMap(article -> helpService.createHelpArticle(article))
                .then(Mono.just(ResponseEntity.status(HttpStatus.CREATED).<Void>build()));
    }

    @Override
    public Mono<ResponseEntity<Void>> createHelpCategory(Mono<HelpCategory> helpCategory, ServerWebExchange exchange) {
        return helpCategory
                .flatMap(category -> helpService.createHelpCategory(category))
                .then(Mono.just(ResponseEntity.status(HttpStatus.CREATED).<Void>build()));
    }

    @Override
    public Mono<ResponseEntity<Void>> deleteHelpArticle(String articleId, ServerWebExchange exchange) {
        return helpService.deleteHelpArticle(articleId)
                .then(Mono.just(ResponseEntity.noContent().<Void>build()))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @Override
    public Mono<ResponseEntity<Void>> deleteHelpCategory(String categoryId, ServerWebExchange exchange) {
        return helpService.deleteHelpCategory(categoryId)
                .then(Mono.just(ResponseEntity.noContent().<Void>build()))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @Override
    public Mono<ResponseEntity<Flux<HelpArticle>>> getAdminHelpArticles(String categoryId, ServerWebExchange exchange) {
        return Mono.just(ResponseEntity.ok(helpService.getHelpArticles(categoryId)));
    }

    @Override
    public Mono<ResponseEntity<Flux<HelpCategory>>> getAdminHelpCategories(ServerWebExchange exchange) {
        return Mono.just(ResponseEntity.ok(helpService.getHelpCategories()));
    }

    @Override
    public Mono<ResponseEntity<Void>> updateHelpArticle(String articleId, Mono<HelpArticle> helpArticle,
            ServerWebExchange exchange) {
        return helpArticle
                .flatMap(article -> helpService.updateHelpArticle(articleId, article))
                .then(Mono.just(ResponseEntity.ok().<Void>build()))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @Override
    public Mono<ResponseEntity<Void>> updateHelpCategory(String categoryId, Mono<HelpCategory> helpCategory,
            ServerWebExchange exchange) {
        return helpCategory
                .flatMap(category -> helpService.updateHelpCategory(categoryId, category))
                .then(Mono.just(ResponseEntity.ok().<Void>build()))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
}