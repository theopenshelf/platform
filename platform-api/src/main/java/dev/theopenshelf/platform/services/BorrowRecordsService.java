package dev.theopenshelf.platform.services;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.theopenshelf.platform.entities.BorrowRecordEntity;
import dev.theopenshelf.platform.model.BorrowRecordStandalone;
import dev.theopenshelf.platform.model.BorrowRecordsCountByStatus;
import dev.theopenshelf.platform.model.PaginatedBorrowRecordsResponse;
import dev.theopenshelf.platform.repositories.BorrowRecordRepository;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class BorrowRecordsService {
    private final BorrowRecordRepository borrowRecordRepository;

    @Transactional(readOnly = true)
    public Mono<PaginatedBorrowRecordsResponse> getBorrowRecords(Boolean borrowedByCurrentUser,
            String borrowedBy,
            String itemId,
            String sortBy,
            String sortOrder,
            List<String> libraryIds,
            List<String> categories,
            String searchText,
            Integer page,
            Integer pageSize,
            List<String> status,
            Boolean favorite) {

        // Get initial records
        List<BorrowRecordEntity> records;
        if (libraryIds != null && !libraryIds.isEmpty()) {
            List<UUID> libraryUuids = libraryIds.stream()
                    .map(UUID::fromString)
                    .collect(Collectors.toList());
            records = borrowRecordRepository.findByLibraryIdsWithItem(libraryUuids);
        } else if (borrowedBy != null) {
            records = borrowRecordRepository.findByBorrowedByWithItem(borrowedBy);
        } else if (itemId != null) {
            records = borrowRecordRepository.findByItemIdWithItem(UUID.fromString(itemId));
        } else {
            records = borrowRecordRepository.findAllWithItem();
        }

        // Apply filters
        records = records.stream()
                .filter(record -> categories == null || categories.isEmpty() ||
                        (record.getItem().getCategory() != null &&
                                categories.contains(record.getItem().getCategory().getName())))
                .filter(record -> searchText == null || searchText.isEmpty() ||
                        record.getItem().getName().toLowerCase().contains(searchText.toLowerCase()))
                .filter(record -> status == null || status.isEmpty() ||
                        status.contains(record.getStatus().getValue()))
                .filter(record -> favorite == null ||
                        !favorite || record.getItem().isFavorite())
                .collect(Collectors.toList());

        // Validate and normalize pagination parameters
        int validPage = Math.max(1, page != null ? page : 1);
        int validPageSize = Math.max(1, pageSize != null ? pageSize : 10);

        // Apply sorting
        if (sortBy != null) {
            records = sortRecords(records, sortBy, sortOrder);
        }

        // Apply pagination
        PaginatedBorrowRecordsResponse response = new PaginatedBorrowRecordsResponse();
        response.setTotalItems(records.size());
        response.setCurrentPage(validPage);
        response.setRecordsPerPage(validPageSize);
        response.setTotalPages((int) Math.ceil((double) records.size() / validPageSize));

        int start = (validPage - 1) * validPageSize;
        int end = Math.min(start + validPageSize, records.size());

        // Ensure start index is not negative
        start = Math.max(0, start);

        response.setRecords(records.subList(start, end).stream()
                .map(this::convertToStandalone)
                .collect(Collectors.toList()));

        return Mono.just(response);
    }

    @Transactional(readOnly = true)
    public Mono<BorrowRecordsCountByStatus> getBorrowRecordsCountByStatus(Boolean borrowedByCurrentUser,
            String borrowedBy,
            String itemId,
            List<String> libraryIds,
            List<String> status) {

            List<BorrowRecordEntity> records;

            // Handle borrowedByCurrentUser flag

            if (libraryIds != null && !libraryIds.isEmpty()) {
                List<UUID> libraryUuids = libraryIds.stream()
                        .map(UUID::fromString)
                        .collect(Collectors.toList());

                if (borrowedBy != null) {
                    records = borrowRecordRepository.findByBorrowedByAndLibraryIdsWithItem(borrowedBy,
                            libraryUuids);
                } else {
                    records = borrowRecordRepository.findByLibraryIdsWithItem(libraryUuids);
                }
            } else if (borrowedBy != null) {
                records = borrowRecordRepository.findByBorrowedByWithItem(borrowedBy);
            } else if (itemId != null) {
                records = borrowRecordRepository.findByItemIdWithItem(UUID.fromString(itemId));
            } else {
                records = borrowRecordRepository.findAllWithItem();
            }

            // Apply status filter if needed
            if (status != null && !status.isEmpty()) {
                records = records.stream()
                        .filter(record -> status.contains(record.getStatus().getValue()))
                        .collect(Collectors.toList());
            }

            BorrowRecordsCountByStatus countByStatus = new BorrowRecordsCountByStatus();
            records.forEach(record -> updateStatusCount(countByStatus, record));

            return Mono.just(countByStatus);
    }

    private List<BorrowRecordEntity> sortRecords(List<BorrowRecordEntity> records, String sortBy, String sortOrder) {
        boolean isDescending = "desc".equalsIgnoreCase(sortOrder);
        records.sort((a, b) -> {
            int comparison = compareByField(a, b, sortBy);
            return isDescending ? -comparison : comparison;
        });
        return records;
    }

    private int compareByField(BorrowRecordEntity a, BorrowRecordEntity b, String field) {
        return switch (field.toLowerCase()) {
            case "borrowedby" -> a.getBorrowedBy().compareTo(b.getBorrowedBy());
            case "startdate" -> a.getStartDate().compareTo(b.getStartDate());
            case "enddate" -> a.getEndDate().compareTo(b.getEndDate());
            case "status" -> a.getStatus().compareTo(b.getStatus());
            default -> 0;
        };
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

    private void updateStatusCount(BorrowRecordsCountByStatus countByStatus, BorrowRecordEntity record) {
        switch (record.getStatus()) {
            case RESERVED_UNCONFIRMED ->
                countByStatus.setReservedUnconfirmed(getOrDefault(countByStatus.getReservedUnconfirmed()) + 1);
            case RESERVED_CONFIRMED ->
                countByStatus.setReservedConfirmed(getOrDefault(countByStatus.getReservedConfirmed()) + 1);
            case RESERVED_READY_TO_PICKUP ->
                countByStatus.setReservedReadyToPickup(getOrDefault(countByStatus.getReservedReadyToPickup()) + 1);
            case BORROWED_ACTIVE ->
                countByStatus.setBorrowedActive(getOrDefault(countByStatus.getBorrowedActive()) + 1);
            case BORROWED_LATE ->
                countByStatus.setBorrowedLate(getOrDefault(countByStatus.getBorrowedLate()) + 1);
            case RETURNED_EARLY ->
                countByStatus.setReturnedEarly(getOrDefault(countByStatus.getReturnedEarly()) + 1);
            case RETURNED_ON_TIME ->
                countByStatus.setReturnedOnTime(getOrDefault(countByStatus.getReturnedOnTime()) + 1);
            case RETURNED_LATE ->
                countByStatus.setReturnedLate(getOrDefault(countByStatus.getReturnedLate()) + 1);
        }
    }

    private Integer getOrDefault(Integer value) {
        return value == null ? 0 : value;
    }
}