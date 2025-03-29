package dev.theopenshelf.platform.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.stereotype.Service;

import dev.theopenshelf.platform.entities.CommunityMemberEntity;
import dev.theopenshelf.platform.entities.LibraryEntity;
import dev.theopenshelf.platform.entities.LibraryMemberEntity;
import dev.theopenshelf.platform.entities.LocationEntity;
import dev.theopenshelf.platform.entities.MemberRole;
import dev.theopenshelf.platform.exceptions.ResourceNotFoundException;
import dev.theopenshelf.platform.model.Library;
import dev.theopenshelf.platform.model.PaginatedLibraryMembersResponse;
import dev.theopenshelf.platform.repositories.LibraryRepository;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class LibrariesService {
    private final LibraryRepository libraryRepository;
    private final CommunitiesService communitiesService;

    public Mono<LibraryEntity> createLibrary(Library library, UUID ownerId) {

        Optional<CommunityMemberEntity> member = communitiesService.isMember(library.getCommunityId(), ownerId);
        if (member.isEmpty() || !member.get().getRole().equals(MemberRole.REQUESTING_JOIN)) {
            throw new AuthorizationDeniedException("Only the community member can create libraries");
        }
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

    public Mono<LibraryEntity> getLibrary(UUID libraryId, UUID currentUser) {
        LibraryEntity library = libraryRepository.findById(libraryId)
                .orElseThrow(() -> new ResourceNotFoundException("Library not found"));

        Optional<CommunityMemberEntity> member = communitiesService.isMember(library.getCommunityId(), currentUser);
        if (member.isEmpty() || member.get().getRole().equals(MemberRole.REQUESTING_JOIN)) {
            throw new AuthorizationDeniedException("Only the community member can create libraries");
        }
        return Mono.just(library);
    }

    public Flux<LibraryEntity> getLibraries(List<UUID> communityIds) {
        if (communityIds != null && !communityIds.isEmpty()) {
            return Flux.fromIterable(libraryRepository.findByCommunityIdIn(communityIds));
        }
        return Flux.fromIterable(libraryRepository.findAll());
    }

    public Mono<LibraryEntity> updateLibrary(UUID libraryId, Library library, UUID currentUser) {
        LibraryEntity libraryEntity = libraryRepository.findByIdWithMembers(libraryId)
                .orElseThrow(() -> new ResourceNotFoundException("Library not found"));

        Optional<LibraryMemberEntity> libraryMember = libraryEntity.getMembers().stream()
                .filter(m -> m.getUser().getId().equals(currentUser))
                .filter(m -> m.getRole().equals(MemberRole.ADMIN))
                .findFirst();

        if (libraryMember.isEmpty() || !libraryMember.get().getRole().equals(MemberRole.ADMIN) ) {
            throw new AuthorizationDeniedException("Only the library admin can update libraries");
        }

        libraryEntity.setName(library.getName());
        libraryEntity.setRequiresApproval(library.getRequiresApproval());
        libraryEntity.setFreeAccess(library.getFreeAccess());
        libraryEntity.setInstructions(library.getInstructions());
        if (library.getLocation() != null) {
            libraryEntity.setLocation(LocationEntity.builder()
                    .locationName(library.getLocation().getName())
                    .address(library.getLocation().getAddress())
                    .build());
        }
        return Mono.just(libraryRepository.save(libraryEntity));
    }

    public Mono<Void> deleteLibrary(UUID libraryId, UUID currentUser) {
        LibraryEntity library = libraryRepository.findById(libraryId)
                .orElseThrow(() -> new ResourceNotFoundException("Library not found"));

        Optional<LibraryMemberEntity> libraryMember = library.getMembers().stream()
                .filter(m -> m.getUser().getId().equals(currentUser))
                .filter(m -> m.getRole().equals(MemberRole.ADMIN))
                .findFirst();

        Optional<CommunityMemberEntity> communityMember = communitiesService.isMember(library.getCommunityId(), currentUser);
        if (communityMember.isEmpty() || !communityMember.get().getRole().equals(MemberRole.ADMIN)
                || libraryMember.isEmpty() || !libraryMember.get().getRole().equals(MemberRole.ADMIN) ) {
            throw new AuthorizationDeniedException("Only the community admin or library admin can delete libraries");
        }
        libraryRepository.delete(library);
        return Mono.empty();
    }

    public Mono<PaginatedLibraryMembersResponse> getLibraryMembers(UUID libraryId, UUID currentUser, Integer page, Integer pageSize) {
        LibraryEntity library = libraryRepository.findByIdWithMembers(libraryId)
                .orElseThrow(() -> new ResourceNotFoundException("Library not found"));

        Optional<LibraryMemberEntity> libraryMember = library.getMembers().stream()
                .filter(m -> m.getUser().getId().equals(currentUser))
                .filter(m -> m.getRole().equals(MemberRole.ADMIN))
                .findFirst();

        Optional<CommunityMemberEntity> communityMember = communitiesService.isMember(library.getCommunityId(), currentUser);
        if (communityMember.isEmpty() || !communityMember.get().getRole().equals(MemberRole.ADMIN)
                || libraryMember.isEmpty() || !libraryMember.get().getRole().equals(MemberRole.ADMIN) ) {
            throw new AuthorizationDeniedException("Only the community admin or library admin can access library members");
        }

        List<LibraryMemberEntity> members = library.getMembers();
        int start = (page - 1) * pageSize;
        int end = Math.min(start + pageSize, members.size());
        List<LibraryMemberEntity> paginatedMembers = members.subList(start, end);

        PaginatedLibraryMembersResponse response = new PaginatedLibraryMembersResponse();
        response.setItems(paginatedMembers.stream()
                .map(member -> member.toLibraryMember().build())
                .toList());
        response.setTotalItems(members.size());
        response.setCurrentPage(page);
        response.setItemsPerPage(pageSize);
        response.setTotalPages((int) Math.ceil(members.size() / (double) pageSize));
        return Mono.just(response);
    }
}