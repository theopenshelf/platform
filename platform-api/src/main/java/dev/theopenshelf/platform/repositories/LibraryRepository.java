package dev.theopenshelf.platform.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import dev.theopenshelf.platform.entities.LibraryEntity;

@Repository
public interface LibraryRepository extends CrudRepository<LibraryEntity, UUID> {
    List<LibraryEntity> findByCommunityIdIn(List<UUID> communityIds);

    List<LibraryEntity> findByCommunityId(UUID communityId);

    @Query("SELECT l FROM LibraryEntity l LEFT JOIN FETCH l.members WHERE l.id = :libraryId")
    Optional<LibraryEntity> findByIdWithMembers(@Param("libraryId") UUID libraryId);
}