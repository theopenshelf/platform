package dev.theopenshelf.platform.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import dev.theopenshelf.platform.entities.BorrowRecordEntity;
import dev.theopenshelf.platform.model.BorrowRecord;
import dev.theopenshelf.platform.model.BorrowStatus;
import reactor.core.publisher.Mono;

@Repository
public interface BorrowRecordRepository
                extends CrudRepository<BorrowRecordEntity, UUID>, JpaSpecificationExecutor<BorrowRecordEntity> {
        List<BorrowRecordEntity> findByItemId(UUID itemId);

        Optional<BorrowRecordEntity> findByItemIdAndBorrowedByAndStatus(UUID itemId, String borrowedBy, BorrowStatus status);
}