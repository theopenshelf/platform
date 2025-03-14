package dev.theopenshelf.platform.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import dev.theopenshelf.platform.entities.BorrowRecordEntity;

@Repository
public interface BorrowRecordRepository extends CrudRepository<BorrowRecordEntity, UUID> {
    List<BorrowRecordEntity> findByItemId(UUID itemId);

    @Query("SELECT DISTINCT br FROM BorrowRecordEntity br " +
            "LEFT JOIN FETCH br.item i " +
            "LEFT JOIN FETCH i.category")
    List<BorrowRecordEntity> findAllWithItem();

    @Query("SELECT DISTINCT br FROM BorrowRecordEntity br " +
            "LEFT JOIN FETCH br.item i " +
            "LEFT JOIN FETCH i.category " +
            "WHERE br.borrowedBy = :borrowedBy")
    List<BorrowRecordEntity> findByBorrowedByWithItem(@Param("borrowedBy") String borrowedBy);

    @Query("SELECT DISTINCT br FROM BorrowRecordEntity br " +
            "LEFT JOIN FETCH br.item i " +
            "LEFT JOIN FETCH i.category " +
            "WHERE br.item.id = :itemId")
    List<BorrowRecordEntity> findByItemIdWithItem(@Param("itemId") UUID itemId);

    @Query("SELECT DISTINCT br FROM BorrowRecordEntity br " +
            "LEFT JOIN FETCH br.item i " +
            "LEFT JOIN FETCH i.category " +
            "WHERE i.libraryId IN :libraryIds")
    List<BorrowRecordEntity> findByLibraryIdsWithItem(@Param("libraryIds") List<UUID> libraryIds);

    @Query("SELECT DISTINCT br FROM BorrowRecordEntity br " +
            "LEFT JOIN FETCH br.item i " +
            "LEFT JOIN FETCH i.category " +
            "WHERE br.status IN :statuses")
    List<BorrowRecordEntity> findByStatusesWithItem(@Param("statuses") List<String> statuses);

    @Query("SELECT DISTINCT br FROM BorrowRecordEntity br " +
            "LEFT JOIN FETCH br.item i " +
            "LEFT JOIN FETCH i.category " +
            "WHERE br.borrowedBy = :borrowedBy " +
            "AND i.libraryId IN :libraryIds")
    List<BorrowRecordEntity> findByBorrowedByAndLibraryIdsWithItem(
            @Param("borrowedBy") String borrowedBy,
            @Param("libraryIds") List<UUID> libraryIds);
    // Additional query methods can be defined here if needed
}