package dev.theopenshelf.platform.services;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import dev.theopenshelf.platform.entities.LibraryEntity;
import dev.theopenshelf.platform.entities.LibraryMemberEntity;
import dev.theopenshelf.platform.entities.LocationEntity;
import dev.theopenshelf.platform.model.Library;
import dev.theopenshelf.platform.model.PaginatedMembersResponse;
import dev.theopenshelf.platform.repositories.LibraryRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class LibrariesService {
    private final LibraryRepository libraryRepository;

    public LibrariesService(LibraryRepository libraryRepository) {
        this.libraryRepository = libraryRepository;
    }

    public Mono<LibraryEntity> createLibrary(Library library, UUID ownerId) {
        LibraryEntity entity = LibraryEntity.builder()
                .id(UUID.randomUUID())
                .name(library.getName())
                .requiresApproval(library.getRequiresApproval())
                .freeAccess(library.getFreeAccess())
                .instructions(library.getInstructions())
                .location(library.getLocation() != null ? LocationEntity.builder()
                        .locationName(library.getLocation().getName())
                        .address(library.getLocation().getAddress())
                        .build() : null)
                .communityId(library.getCommunityId())
                .isAdmin(true)
                .build();

        return Mono.just(libraryRepository.save(entity));
    }

    public Mono<LibraryEntity> getLibrary(UUID libraryId) {
        return Mono.justOrEmpty(libraryRepository.findById(libraryId));
    }

    public Flux<LibraryEntity> getLibraries(List<UUID> communityIds) {
        if (communityIds != null && !communityIds.isEmpty()) {
            return Flux.fromIterable(libraryRepository.findByCommunityIdIn(communityIds));
        }
        return Flux.fromIterable(libraryRepository.findAll());
    }

    public Mono<LibraryEntity> updateLibrary(UUID libraryId, Library library) {
        return Mono.justOrEmpty(libraryRepository.findById(libraryId))
                .map(entity -> {
                    entity.setName(library.getName());
                    entity.setRequiresApproval(library.getRequiresApproval());
                    entity.setFreeAccess(library.getFreeAccess());
                    entity.setInstructions(library.getInstructions());
                    if (library.getLocation() != null) {
                        entity.setLocation(LocationEntity.builder()
                                .locationName(library.getLocation().getName())
                                .address(library.getLocation().getAddress())
                                .build());
                    }
                    return libraryRepository.save(entity);
                });
    }

    public Mono<Void> deleteLibrary(UUID libraryId) {
        return Mono.justOrEmpty(libraryRepository.findById(libraryId))
                .doOnNext(libraryRepository::delete)
                .then();
    }

    public Mono<PaginatedMembersResponse> getLibraryMembers(UUID libraryId, Integer page, Integer pageSize) {
        return Mono.justOrEmpty(libraryRepository.findById(libraryId))
                .map(library -> {
                    List<LibraryMemberEntity> members = library.getMembers();
                    int start = (page - 1) * pageSize;
                    int end = Math.min(start + pageSize, members.size());
                    List<LibraryMemberEntity> paginatedMembers = members.subList(start, end);

                    PaginatedMembersResponse response = new PaginatedMembersResponse();
                    response.setItems(paginatedMembers.stream()
                            .map(member -> member.toLibraryMember().build())
                            .toList());
                    response.setTotalItems(members.size());
                    response.setCurrentPage(page);
                    response.setItemsPerPage(pageSize);
                    response.setTotalPages((int) Math.ceil(members.size() / (double) pageSize));
                    return response;
                });
    }
}