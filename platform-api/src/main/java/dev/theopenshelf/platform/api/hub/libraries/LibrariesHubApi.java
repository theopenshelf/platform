package dev.theopenshelf.platform.api.hub.libraries;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ServerWebExchange;

import dev.theopenshelf.platform.api.LibrariesHubApiApiDelegate;
import dev.theopenshelf.platform.model.Library;
import dev.theopenshelf.platform.model.PaginatedLibraryMembersResponse;
import dev.theopenshelf.platform.services.LibrariesService;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor

public class LibrariesHubApi implements LibrariesHubApiApiDelegate {

    private final LibrariesService librariesService;

    @Override
    public Mono<ResponseEntity<Library>> addHubLibrary(Mono<Library> library, ServerWebExchange exchange) {
        //TODO only add library if current user is an admin of the library->community
        return exchange.getPrincipal()
                .map(principal -> UUID.fromString(principal.getName()))
                .flatMap(userId -> library.flatMap(l -> librariesService.createLibrary(l, userId)
                        .map(entity -> ResponseEntity.status(201).body(entity.toLibrary().build()))));
    }

    @Override
    public Mono<ResponseEntity<Library>> getHubLibrary(UUID libraryId, ServerWebExchange exchange) {
        //TODO only get library if current user is an admin of the library->community
        return librariesService.getLibrary(libraryId)
                .map(library -> ResponseEntity.ok(library.toLibrary().build()))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @Override
    public Mono<ResponseEntity<Flux<Library>>> getHubLibraries(List<UUID> communityIds, ServerWebExchange exchange) {
        //TODO only get libraries if current user is an member of the library->community
        return Mono.just(ResponseEntity.ok(
                librariesService.getLibraries(communityIds)
                        .map(library -> library.toLibrary().build())));
    }

    @Override
    public Mono<ResponseEntity<Library>> updateHubLibrary(UUID libraryId, Mono<Library> library,
            ServerWebExchange exchange) {
        //TODO only update library if current user is an admin of the library->community
        return library.flatMap(l -> librariesService.updateLibrary(libraryId, l)
                .map(entity -> ResponseEntity.ok(entity.toLibrary().build()))
                .defaultIfEmpty(ResponseEntity.notFound().build()));
    }

    @Override
    public Mono<ResponseEntity<Void>> deleteHubLibrary(UUID libraryId, ServerWebExchange exchange) {
        //TODO only delete library if current user is an admin of the library->community
        return librariesService.deleteLibrary(libraryId)
                .then(Mono.just(ResponseEntity.noContent().<Void>build()))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @Override
    public Mono<ResponseEntity<PaginatedLibraryMembersResponse>> getLibraryMembers(UUID libraryId, Integer page,
            Integer pageSize, ServerWebExchange exchange) {
        //TODO only get library members if current user is an admin of the library->community
        return librariesService.getLibraryMembers(libraryId, page != null ? page : 1, pageSize != null ? pageSize : 10)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
}