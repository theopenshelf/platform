package dev.theopenshelf.platform.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import dev.theopenshelf.platform.entities.CategoryEntity;

@Repository
public interface CategoryRepository
        extends CrudRepository<CategoryEntity, UUID>, JpaSpecificationExecutor<CategoryEntity> {
    Optional<CategoryEntity> findByName(String name);

    @Query("SELECT c.name, c.icon, COUNT(br), COUNT(DISTINCT i) " +
            "FROM CategoryEntity c " +
            "LEFT JOIN ItemEntity i ON i.category = c " +
            "LEFT JOIN BorrowRecordEntity br ON br.item = i " +
            "GROUP BY c.name, c.icon " +
            "ORDER BY COUNT(br) DESC")
    Page<Object[]> findTopCategories(Pageable pageable);
}