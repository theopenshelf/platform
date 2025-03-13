package dev.theopenshelf.platform.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import dev.theopenshelf.platform.entities.CustomPageEntity;

@Repository
public interface CustomPageRepository extends CrudRepository<CustomPageEntity, UUID> {
    List<CustomPageEntity> findAllByCommunityId(UUID communityId);

    Optional<CustomPageEntity> findByRef(String ref);

    Optional<CustomPageEntity> findByCommunityIdAndRef(UUID communityId, String ref);

    List<CustomPageEntity> findAllByOrderByPosition();
}