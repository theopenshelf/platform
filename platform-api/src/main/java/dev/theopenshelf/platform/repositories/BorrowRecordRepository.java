package dev.theopenshelf.platform.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import dev.theopenshelf.platform.entities.BorrowRecordEntity;

@Repository
public interface BorrowRecordRepository
                extends CrudRepository<BorrowRecordEntity, UUID>, JpaSpecificationExecutor<BorrowRecordEntity> {
        List<BorrowRecordEntity> findByItemId(UUID itemId);
}