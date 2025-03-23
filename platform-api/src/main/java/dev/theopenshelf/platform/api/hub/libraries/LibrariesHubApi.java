package dev.theopenshelf.platform.api.hub.libraries;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ServerWebExchange;

import dev.theopenshelf.platform.api.LibrariesHubApiApiDelegate;
import dev.theopenshelf.platform.entities.LibraryEntity;
import dev.theopenshelf.platform.exceptions.ResourceNotFoundException;
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
                // TODO only add library if current user is an admin of the library->community
                return exchange.getPrincipal()
                        .map(principal -> UUID.fromString(principal.getName()))
                        .flatMap(userId -> library.flatMap(l -> librariesService.createLibrary(l, userId)))
                        .map(l -> ResponseEntity.status(201).body(l.toLibrary().build()));
        }

        @Override
        public Mono<ResponseEntity<Library>> getHubLibrary(UUID libraryId, ServerWebExchange exchange) {
                return exchange.getPrincipal()
                        .map(principal -> UUID.fromString(principal.getName()))
                        .flatMap(userId -> librariesService.getLibrary(libraryId, userId))
                        .map(l -> l.toLibrary().build())
                        .map(ResponseEntity::ok);
        }

        @Override
        public Mono<ResponseEntity<Flux<Library>>> getHubLibraries(List<UUID> communityIds,
                        ServerWebExchange exchange) {
                // TODO only get libraries if current user is an member of the
                // library->community
                return exchange.getPrincipal()
                        .map(principal -> UUID.fromString(principal.getName()))
                        .map(userId -> librariesService.getLibraries(communityIds)
                                .map(library -> library.toLibrary().build())
                        ).map(ResponseEntity::ok);
        }

        @Override
        public Mono<ResponseEntity<Library>> updateHubLibrary(UUID libraryId, Mono<Library> library,
                        ServerWebExchange exchange) {

                return exchange.getPrincipal()
                        .map(principal -> UUID.fromString(principal.getName()))
                        .flatMap(currentUserId -> library.flatMap(l -> librariesService.updateLibrary(libraryId, l, currentUserId)))
                        .map(l -> l.toLibrary().build())
                        .map(ResponseEntity::ok);
        }

        @Override
        public Mono<ResponseEntity<Void>> deleteHubLibrary(UUID libraryId, ServerWebExchange exchange) {
                return exchange.getPrincipal()
                        .map(principal -> UUID.fromString(principal.getName()))
                        .flatMap(currentUserId -> {
                                librariesService.deleteLibrary(libraryId, currentUserId);
                                return Mono.just(ResponseEntity.noContent().build());
                        });
        }

        @Override
        public Mono<ResponseEntity<PaginatedLibraryMembersResponse>> getLibraryMembers(UUID libraryId, Integer page,
                        Integer pageSize, ServerWebExchange exchange) {
                return exchange.getPrincipal()
                        .map(principal -> UUID.fromString(principal.getName()))
                        .flatMap(currentUserId -> librariesService.getLibraryMembers(libraryId, currentUserId,
                                page != null ? page : 1, pageSize != null ? pageSize : 10)
                        )
                        .map(ResponseEntity::ok);
        }
}