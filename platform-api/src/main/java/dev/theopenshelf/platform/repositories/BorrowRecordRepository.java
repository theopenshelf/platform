package dev.theopenshelf.platform.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import dev.theopenshelf.platform.entities.BorrowRecordEntity;
import dev.theopenshelf.platform.model.BorrowStatus;

@Repository
public interface BorrowRecordRepository
                extends CrudRepository<BorrowRecordEntity, UUID>, JpaSpecificationExecutor<BorrowRecordEntity> {
        List<BorrowRecordEntity> findByItemId(UUID itemId);

        Optional<BorrowRecordEntity> findByItemIdAndBorrowedByAndStatus(UUID itemId, String borrowedBy,
                        BorrowStatus status);

        @Query("SELECT COUNT(br) FROM BorrowRecordEntity br WHERE br.status = 'BORROWED_ACTIVE'")
        long countActiveBorrows();

        @Query("SELECT COUNT(br) FROM BorrowRecordEntity br WHERE br.status = 'RESERVED_UNCONFIRMED' OR br.status = 'RESERVED_CONFIRMED' OR br.status = 'RESERVED_READY_TO_PICKUP'")
        long countActiveReservations();

        @Query("SELECT COUNT(br) FROM BorrowRecordEntity br")
        long countTotalBorrows();

        @Query(value = "SELECT u.username, COUNT(br.*) FROM borrow_records br JOIN users u ON br.borrowed_by = u.id::text GROUP BY u.username ORDER BY COUNT(br.*) DESC", nativeQuery = true)
        Page<Object[]> findTopBorrowers(Pageable pageable);
}