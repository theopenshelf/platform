package dev.theopenshelf.platform.api.hub.libraries;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ServerWebExchange;

import dev.theopenshelf.platform.api.LibrariesHubApiApiDelegate;
import dev.theopenshelf.platform.model.Library;
import dev.theopenshelf.platform.model.PaginatedLibraryMembersResponse;
import dev.theopenshelf.platform.model.PaginatedMembersResponse;
import dev.theopenshelf.platform.services.LibrariesService;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class LibrariesHubApi implements LibrariesHubApiApiDelegate {

    private final LibrariesService librariesService;

    public LibrariesHubApi(LibrariesService librariesService) {
        this.librariesService = librariesService;
    }

    @Override
    public Mono<ResponseEntity<Library>> addHubLibrary(Mono<Library> library, ServerWebExchange exchange) {
        return exchange.getPrincipal()
                .map(principal -> UUID.fromString(principal.getName()))
                .flatMap(userId -> library.flatMap(l -> librariesService.createLibrary(l, userId)
                        .map(entity -> ResponseEntity.status(201).body(entity.toLibrary().build()))));
    }

    @Override
    public Mono<ResponseEntity<Library>> getHubLibrary(UUID libraryId, ServerWebExchange exchange) {
        return librariesService.getLibrary(libraryId)
                .map(library -> ResponseEntity.ok(library.toLibrary().build()))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @Override
    public Mono<ResponseEntity<Flux<Library>>> getHubLibraries(List<UUID> communityIds, ServerWebExchange exchange) {
        return Mono.just(ResponseEntity.ok(
                librariesService.getLibraries(communityIds)
                        .map(library -> library.toLibrary().build())));
    }

    @Override
    public Mono<ResponseEntity<Library>> updateHubLibrary(UUID libraryId, Mono<Library> library,
            ServerWebExchange exchange) {
        return library.flatMap(l -> librariesService.updateLibrary(libraryId, l)
                .map(entity -> ResponseEntity.ok(entity.toLibrary().build()))
                .defaultIfEmpty(ResponseEntity.notFound().build()));
    }

    @Override
    public Mono<ResponseEntity<Void>> deleteHubLibrary(UUID libraryId, ServerWebExchange exchange) {
        return librariesService.deleteLibrary(libraryId)
                .then(Mono.just(ResponseEntity.noContent().<Void>build()))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @Override
    public Mono<ResponseEntity<PaginatedLibraryMembersResponse>> getLibraryMembers(UUID libraryId, Integer page,
                                                                                   Integer pageSize, ServerWebExchange exchange) {
        return librariesService.getLibraryMembers(libraryId, page != null ? page : 1, pageSize != null ? pageSize : 10)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
}