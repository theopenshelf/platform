package dev.theopenshelf.platform.services;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import dev.theopenshelf.platform.entities.CommunityMemberEntity;
import dev.theopenshelf.platform.entities.CustomPageEntity;
import dev.theopenshelf.platform.entities.MemberRoleEntity;
import dev.theopenshelf.platform.exceptions.CodedException;
import dev.theopenshelf.platform.exceptions.CodedError;
import dev.theopenshelf.platform.model.CustomPage;
import dev.theopenshelf.platform.model.GetCustomPageRefs200ResponseInner;
import dev.theopenshelf.platform.repositories.CustomPageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomPagesService {
    private final CustomPageRepository customPageRepository;
    private final CommunitiesService communitiesService;

    public Mono<CustomPage> createCommunityCustomPage(UUID communityId, CustomPage page, UUID currentUser) {
        Optional<CommunityMemberEntity> communityMember = communitiesService.isMember(communityId, currentUser);
        if (communityMember.isEmpty() || !communityMember.get().getRole().equals(MemberRoleEntity.ADMIN)) {
            throw new CodedException(CodedError.INSUFFICIENT_PERMISSIONS.getCode(),
                    "Only community admins can create custom pages",
                    Map.of("userId", currentUser, "communityId", communityId),
                    CodedError.INSUFFICIENT_PERMISSIONS.getDocumentationUrl());
        }

        log.info("Creating custom page for community: {}", communityId);
        CustomPageEntity entity = CustomPageEntity.fromCustomPage(page);
        entity.setCommunityId(communityId);
        CustomPageEntity savedEntity = customPageRepository.save(entity);
        log.info("Created custom page: {} for community: {}", savedEntity.getRef(), communityId);
        return Mono.just(savedEntity.toCustomPage());
    }

    public Mono<Void> deleteCommunityCustomPage(UUID communityId, String pageRef, UUID currentUser) {
        Optional<CommunityMemberEntity> communityMember = communitiesService.isMember(communityId, currentUser);
        if (communityMember.isEmpty() || !communityMember.get().getRole().equals(MemberRoleEntity.ADMIN)) {
            throw new CodedException(CodedError.INSUFFICIENT_PERMISSIONS.getCode(),
                    "Only community admins can delete custom pages",
                    Map.of("userId", currentUser, "communityId", communityId),
                    CodedError.INSUFFICIENT_PERMISSIONS.getDocumentationUrl());
        }

        log.info("Deleting custom page: {} from community: {}", pageRef, communityId);
        CustomPageEntity entity = customPageRepository.findByCommunityIdAndRef(communityId, pageRef)
                .orElseThrow(() -> new CodedException(CodedError.CUSTOM_PAGE_NOT_FOUND.getCode(),
                        CodedError.CUSTOM_PAGE_NOT_FOUND.getDefaultMessage(),
                        Map.of("pageRef", pageRef, "communityId", communityId),
                        CodedError.CUSTOM_PAGE_NOT_FOUND.getDocumentationUrl()));

        customPageRepository.delete(entity);
        log.info("Deleted custom page: {} from community: {}", pageRef, communityId);
        return Mono.empty();
    }

    public Mono<CustomPage> getCommunityCustomPage(UUID communityId, String pageRef, UUID currentUser) {
        Optional<CommunityMemberEntity> communityMember = communitiesService.isMember(communityId, currentUser);
        if (communityMember.isEmpty() || communityMember.get().getRole().equals(MemberRoleEntity.REQUESTING_JOIN)) {
            throw new CodedException(CodedError.INSUFFICIENT_PERMISSIONS.getCode(),
                    "Only community members can access custom pages",
                    Map.of("userId", currentUser, "communityId", communityId),
                    CodedError.INSUFFICIENT_PERMISSIONS.getDocumentationUrl());
        }

        log.info("Retrieving custom page: {} from community: {}", pageRef, communityId);
        return Mono.justOrEmpty(customPageRepository.findByCommunityIdAndRef(communityId, pageRef))
                .map(entity -> {
                    log.info("Found custom page: {} in community: {}", pageRef, communityId);
                    return entity.toCustomPage();
                })
                .switchIfEmpty(Mono.error(new CodedException(CodedError.CUSTOM_PAGE_NOT_FOUND.getCode(),
                        CodedError.CUSTOM_PAGE_NOT_FOUND.getDefaultMessage(),
                        Map.of("pageRef", pageRef, "communityId", communityId),
                        CodedError.CUSTOM_PAGE_NOT_FOUND.getDocumentationUrl())));
    }

    public Flux<CustomPage> getCommunityCustomPages(UUID communityId, UUID currentUser) {
        Optional<CommunityMemberEntity> communityMember = communitiesService.isMember(communityId, currentUser);
        if (communityMember.isEmpty() || communityMember.get().getRole().equals(MemberRoleEntity.REQUESTING_JOIN)) {
            throw new CodedException(CodedError.INSUFFICIENT_PERMISSIONS.getCode(),
                    "Only community members can access custom pages",
                    Map.of("userId", currentUser, "communityId", communityId),
                    CodedError.INSUFFICIENT_PERMISSIONS.getDocumentationUrl());
        }

        log.info("Retrieving all custom pages for community: {}", communityId);
        return Flux.fromIterable(customPageRepository.findAllByCommunityId(communityId))
                .map(CustomPageEntity::toCustomPage)
                .doOnComplete(() -> log.info("Retrieved custom pages for community: {}", communityId));
    }

    public Mono<CustomPage> getCustomPage(String pageRef) {
        log.info("Retrieving custom page: {}", pageRef);
        return Mono.justOrEmpty(customPageRepository.findByRef(pageRef))
                .map(entity -> {
                    log.info("Found custom page: {}", pageRef);
                    return entity.toCustomPage();
                })
                .switchIfEmpty(Mono.error(new CodedException(CodedError.CUSTOM_PAGE_NOT_FOUND.getCode(),
                        CodedError.CUSTOM_PAGE_NOT_FOUND.getDefaultMessage(),
                        Map.of("pageRef", pageRef),
                        CodedError.CUSTOM_PAGE_NOT_FOUND.getDocumentationUrl())));
    }

    public Flux<GetCustomPageRefs200ResponseInner> getCustomPageRefs() {
        log.info("Retrieving all custom page references");
        return Flux.fromIterable(customPageRepository.findAllByOrderByPosition())
                .<GetCustomPageRefs200ResponseInner>map(entity -> new GetCustomPageRefs200ResponseInner()
                        .ref(entity.getRef())
                        .title(entity.getTitle())
                        .position(entity.getPosition() != null
                                ? GetCustomPageRefs200ResponseInner.PositionEnum.valueOf(entity.getPosition().name())
                                : null))
                .doOnComplete(() -> log.info("Retrieved all custom page references"));
    }

    public Mono<CustomPage> updateCommunityCustomPage(UUID communityId, String pageRef, CustomPage page, UUID currentUser) {
        Optional<CommunityMemberEntity> communityMember = communitiesService.isMember(communityId, currentUser);
        if (communityMember.isEmpty() || !communityMember.get().getRole().equals(MemberRoleEntity.ADMIN)) {
            throw new CodedException(CodedError.INSUFFICIENT_PERMISSIONS.getCode(),
                    "Only community admins can update custom pages",
                    Map.of("userId", currentUser, "communityId", communityId),
                    CodedError.INSUFFICIENT_PERMISSIONS.getDocumentationUrl());
        }

        log.info("Updating custom page: {} in community: {}", pageRef, communityId);
        CustomPageEntity existingEntity = customPageRepository
                .findByCommunityIdAndRef(communityId, pageRef)
                .orElseThrow(() -> new CodedException(CodedError.CUSTOM_PAGE_NOT_FOUND.getCode(),
                        CodedError.CUSTOM_PAGE_NOT_FOUND.getDefaultMessage(),
                        Map.of("pageRef", pageRef, "communityId", communityId),
                        CodedError.CUSTOM_PAGE_NOT_FOUND.getDocumentationUrl()));

        existingEntity.setTitle(page.getTitle());
        existingEntity.setContent(page.getContent());
        existingEntity.setPosition(
                page.getPosition() != null ? CustomPageEntity.Position.valueOf(page.getPosition().name()) : null);

        CustomPageEntity updatedEntity = customPageRepository.save(existingEntity);
        log.info("Updated custom page: {} in community: {}", pageRef, communityId);
        return Mono.just(updatedEntity.toCustomPage());
    }
}