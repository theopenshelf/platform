package dev.theopenshelf.platform.services;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.theopenshelf.platform.entities.BorrowRecordEntity;
import dev.theopenshelf.platform.model.BorrowRecordStandalone;
import dev.theopenshelf.platform.model.BorrowRecordsCountByStatus;
import dev.theopenshelf.platform.model.BorrowStatus;
import dev.theopenshelf.platform.model.PaginatedBorrowRecordsResponse;
import dev.theopenshelf.platform.repositories.BorrowRecordRepository;
import dev.theopenshelf.platform.specifications.BorrowRecordSpecifications;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class BorrowRecordsService {
    private final BorrowRecordRepository borrowRecordRepository;

    @Transactional(readOnly = true)
    public Mono<PaginatedBorrowRecordsResponse> getBorrowRecords(
            Boolean borrowedByCurrentUser,
            String borrowedBy,
            String itemId,
            String sortBy,
            String sortOrder,
            List<String> libraryIds,
            List<String> categories,
            String searchText,
            Integer page,
            Integer pageSize,
            List<BorrowStatus> status,
            Boolean favorite) {

        int validPage = Math.max(0, (page != null ? page : 1) - 1);
        int validPageSize = Math.max(1, pageSize != null ? pageSize : 10);

        Specification<BorrowRecordEntity> spec = BorrowRecordSpecifications.withFilters(
                borrowedBy, itemId, libraryIds, categories, status, searchText, favorite);

        Sort sort = Sort.unsorted();
        if (sortBy != null) {
            sort = Sort.by(
                    sortOrder != null && sortOrder.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC,
                    sortBy);
        }

        PageRequest pageRequest = PageRequest.of(validPage, validPageSize, sort);
        Page<BorrowRecordEntity> recordsPage = borrowRecordRepository.findAll(spec, pageRequest);

        PaginatedBorrowRecordsResponse response = new PaginatedBorrowRecordsResponse();
        response.setTotalItems((int) recordsPage.getTotalElements());
        response.setCurrentPage(validPage + 1);
        response.setRecordsPerPage(validPageSize);
        response.setTotalPages(recordsPage.getTotalPages());
        response.setRecords(recordsPage.getContent().stream()
                .map(this::convertToStandalone)
                .collect(Collectors.toList()));

        return Mono.just(response);
    }

    @Transactional(readOnly = true)
    public Mono<BorrowRecordsCountByStatus> getBorrowRecordsCountByStatus(
            Boolean borrowedByCurrentUser,
            String borrowedBy,
            String itemId,
            List<String> libraryIds,
            List<BorrowStatus> status) {

        Specification<BorrowRecordEntity> spec = BorrowRecordSpecifications.withFilters(
                borrowedBy, itemId, libraryIds, null, status, null, null);

        // Use the existing specification to get filtered records
        List<BorrowRecordEntity> records = borrowRecordRepository.findAll(spec);

        // Group and count in memory
        Map<BorrowStatus, Long> statusCounts = records.stream()
                .collect(Collectors.groupingBy(
                        BorrowRecordEntity::getStatus,
                        Collectors.counting()));

        // Convert to response
        BorrowRecordsCountByStatus countByStatus = new BorrowRecordsCountByStatus();
        statusCounts.forEach((statusValue, count) -> updateStatusCount(countByStatus, statusValue, count));

        return Mono.just(countByStatus);
    }

    private BorrowRecordStandalone convertToStandalone(BorrowRecordEntity record) {
        return BorrowRecordStandalone.builder()
                .id(record.getId())
                .borrowedBy(record.getBorrowedBy())
                .startDate(record.getStartDate())
                .pickupDate(record.getPickupDate())
                .endDate(record.getEndDate())
                .reservationDate(record.getReservationDate())
                .effectiveReturnDate(record.getEffectiveReturnDate())
                .status(record.getStatus())
                .item(record.getItem().toItem(false).build())
                .build();
    }

    private void updateStatusCount(BorrowRecordsCountByStatus countByStatus, BorrowStatus statusValue,
            Long statusCount) {
        switch (statusValue) {
            case RESERVED_UNCONFIRMED ->
                countByStatus.setReservedUnconfirmed(statusCount.intValue());
            case RESERVED_CONFIRMED ->
                countByStatus.setReservedConfirmed(statusCount.intValue());
            case RESERVED_READY_TO_PICKUP ->
                countByStatus.setReservedReadyToPickup(statusCount.intValue());
            case RESERVED_PICKUP_UNCONFIRMED ->
                countByStatus.setReservedPickupUnconfirmed(statusCount.intValue());
            case BORROWED_ACTIVE ->
                countByStatus.setBorrowedActive(statusCount.intValue());
            case BORROWED_DUE_TODAY ->
                countByStatus.setBorrowedDueToday(statusCount.intValue());
            case BORROWED_LATE ->
                countByStatus.setBorrowedLate(statusCount.intValue());
            case BORROWED_RETURN_UNCONFIRMED ->
                countByStatus.setBorrowedReturnUnconfirmed(statusCount.intValue());
            case RETURNED_EARLY ->
                countByStatus.setReturnedEarly(statusCount.intValue());
            case RETURNED_ON_TIME ->
                countByStatus.setReturnedOnTime(statusCount.intValue());
            case RETURNED_LATE ->
                countByStatus.setReturnedLate(statusCount.intValue());
        }
    }
}