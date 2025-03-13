package dev.theopenshelf.platform.api.admin;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ServerWebExchange;

import dev.theopenshelf.platform.api.LibrariesAdminApiApiDelegate;
import dev.theopenshelf.platform.model.Library;
import dev.theopenshelf.platform.services.LibrariesService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class LibrariesAdminApi implements LibrariesAdminApiApiDelegate {

    private final LibrariesService librariesService;

    @Override
    public Mono<ResponseEntity<Library>> addAdminLibrary(Mono<Library> library, ServerWebExchange exchange) {
        return library
                .flatMap(l -> librariesService.createLibrary(l, UUID.randomUUID())
                        .map(entity -> ResponseEntity.status(201).body(entity.toLibrary().build())));
    }

    @Override
    public Mono<ResponseEntity<Library>> getAdminLibrary(UUID libraryId, ServerWebExchange exchange) {
        return librariesService.getLibrary(libraryId)
                .map(entity -> ResponseEntity.ok(entity.toLibrary().build()))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @Override
    public Mono<ResponseEntity<Flux<Library>>> getAdminLibraries(ServerWebExchange exchange) {
        return Mono.just(ResponseEntity.ok(
                librariesService.getLibraries(null)
                        .map(library -> library.toLibrary().build())));
    }

    @Override
    public Mono<ResponseEntity<Library>> updateAdminLibrary(UUID libraryId, Mono<Library> library,
            ServerWebExchange exchange) {
        return library
                .flatMap(l -> librariesService.updateLibrary(libraryId, l)
                        .map(entity -> ResponseEntity.ok(entity.toLibrary().build()))
                        .defaultIfEmpty(ResponseEntity.notFound().build()));
    }

    @Override
    public Mono<ResponseEntity<Void>> deleteAdminLibrary(UUID libraryId, ServerWebExchange exchange) {
        return librariesService.deleteLibrary(libraryId)
                .then(Mono.just(ResponseEntity.noContent().<Void>build()))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
}