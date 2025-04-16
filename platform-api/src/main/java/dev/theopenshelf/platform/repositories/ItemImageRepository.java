package dev.theopenshelf.platform.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import dev.theopenshelf.platform.entities.ItemImageEntity;

@Repository
public interface ItemImageRepository extends CrudRepository<ItemImageEntity, UUID> {

    @Query("SELECT i FROM ItemImageEntity i WHERE i.item.id = :itemId AND i.order = 0")
    Optional<ItemImageEntity> findFirstImageByItemId(@Param("itemId") UUID itemId);
}