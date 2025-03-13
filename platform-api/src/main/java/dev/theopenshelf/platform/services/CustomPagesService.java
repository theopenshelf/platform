package dev.theopenshelf.platform.services;

import java.util.UUID;

import org.springframework.stereotype.Service;

import dev.theopenshelf.platform.entities.CustomPageEntity;
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

    public Mono<CustomPage> createCommunityCustomPage(UUID communityId, CustomPage page) {
        log.info("Creating custom page for community: {}", communityId);
        return Mono.fromCallable(() -> {
            CustomPageEntity entity = CustomPageEntity.fromCustomPage(page);
            entity.setCommunityId(communityId);
            CustomPageEntity savedEntity = customPageRepository.save(entity);
            log.info("Created custom page: {} for community: {}", savedEntity.getRef(), communityId);
            return savedEntity.toCustomPage();
        });
    }

    public Mono<Void> deleteCommunityCustomPage(UUID communityId, String pageRef) {
        log.info("Deleting custom page: {} from community: {}", pageRef, communityId);
        return Mono.fromCallable(() -> {
            CustomPageEntity entity = customPageRepository.findByCommunityIdAndRef(communityId, pageRef)
                    .orElse(null);
            if (entity == null) {
                log.warn("Custom page not found: {} in community: {}", pageRef, communityId);
                return false;
            }
            customPageRepository.delete(entity);
            log.info("Deleted custom page: {} from community: {}", pageRef, communityId);
            return true;
        }).then();
    }

    public Mono<CustomPage> getCommunityCustomPage(UUID communityId, String pageRef) {
        log.info("Retrieving custom page: {} from community: {}", pageRef, communityId);
        return Mono.justOrEmpty(customPageRepository.findByCommunityIdAndRef(communityId, pageRef))
                .map(entity -> {
                    log.info("Found custom page: {} in community: {}", pageRef, communityId);
                    return entity.toCustomPage();
                });
    }

    public Flux<CustomPage> getCommunityCustomPages(UUID communityId) {
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
                });
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

    public Mono<CustomPage> updateCommunityCustomPage(UUID communityId, String pageRef, CustomPage page) {
        log.info("Updating custom page: {} in community: {}", pageRef, communityId);
        return Mono.fromCallable(() -> {
            CustomPageEntity existingEntity = customPageRepository
                    .findByCommunityIdAndRef(communityId, pageRef)
                    .orElse(null);

            if (existingEntity == null) {
                log.warn("Custom page not found: {} in community: {}", pageRef, communityId);
                return null;
            }

            existingEntity.setTitle(page.getTitle());
            existingEntity.setContent(page.getContent());
            existingEntity.setPosition(
                    page.getPosition() != null ? CustomPageEntity.Position.valueOf(page.getPosition().name()) : null);

            CustomPageEntity updatedEntity = customPageRepository.save(existingEntity);
            log.info("Updated custom page: {} in community: {}", pageRef, communityId);
            return updatedEntity.toCustomPage();
        });
    }
}