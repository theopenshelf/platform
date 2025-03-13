package dev.theopenshelf.platform.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import dev.theopenshelf.platform.entities.ItemEntity;

@Repository
public interface ItemsRepository extends JpaRepository<ItemEntity, UUID>, JpaSpecificationExecutor<ItemEntity> {
    @Query("SELECT i FROM ItemEntity i WHERE "
    + "(:borrowedBy IS NULL OR EXISTS (SELECT 1 FROM i.borrowRecords br WHERE br.borrowedBy = :borrowedBy)) "
    + "AND (:libraryIds IS NULL OR i.libraryId IN :libraryIds) "
    + "AND (:communityIds IS NULL OR i.communityId IN :communityIds) "
    + "AND (:categories IS NULL OR i.category.name IN :categories) "
    + "AND (:searchText IS NULL OR i.name LIKE %:searchText% OR i.description LIKE %:searchText%) "
    + "AND (:favorite IS NULL OR i.favorite = :favorite)")
    List<ItemEntity> findFilteredItems(String borrowedBy, List<String> libraryIds, List<String> communityIds,
                                  List<String> categories, String searchText,
                                  Boolean favorite, Pageable pageable);

    List<ItemEntity> findByLibraryIdIn(List<String> libraryIds);
    List<ItemEntity> findByFavorite(boolean favorite);
}