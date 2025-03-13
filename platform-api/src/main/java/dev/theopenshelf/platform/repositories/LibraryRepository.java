package dev.theopenshelf.platform.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import dev.theopenshelf.platform.entities.LibraryEntity;

@Repository
public interface LibraryRepository extends CrudRepository<LibraryEntity, UUID> {
    List<LibraryEntity> findByCommunityIdIn(List<UUID> communityIds);

    List<LibraryEntity> findByCommunityId(UUID communityId);
}