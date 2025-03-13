package dev.theopenshelf.platform.services;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.stereotype.Service;

import dev.theopenshelf.platform.entities.BorrowRecordEntity;
import dev.theopenshelf.platform.model.BorrowRecordStandalone;
import dev.theopenshelf.platform.model.BorrowRecordsCountByStatus;
import dev.theopenshelf.platform.model.PaginatedBorrowRecordsResponse;
import dev.theopenshelf.platform.repositories.BorrowRecordRepository;
import reactor.core.publisher.Mono;

@Service
public class BorrowRecordsService {
    private final BorrowRecordRepository borrowRecordRepository;

    public BorrowRecordsService(BorrowRecordRepository borrowRecordRepository) {
        this.borrowRecordRepository = borrowRecordRepository;
    }

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

        return Mono.fromCallable(() -> {
            // Validate and normalize pagination parameters
            int validPage = Math.max(1, page != null ? page : 1);
            int validPageSize = Math.max(1, pageSize != null ? pageSize : 10);

            List<BorrowRecordEntity> records = StreamSupport
                    .stream(borrowRecordRepository.findAll().spliterator(), false)
                    .collect(Collectors.toList());

            // Apply filters
            if (borrowedByCurrentUser != null && borrowedByCurrentUser) {
                records = filterByBorrowedBy(records, borrowedBy);
            }
            if (borrowedBy != null) {
                records = filterByBorrowedBy(records, borrowedBy);
            }
            if (itemId != null) {
                records = filterByItemId(records, itemId);
            }

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

            return response;
        });
    }

    public Mono<BorrowRecordsCountByStatus> getBorrowRecordsCountByStatus(Boolean borrowedByCurrentUser,
            String borrowedBy,
            String itemId,
            List<String> libraryIds,
            List<String> status) {

        return Mono.fromCallable(() -> {
            List<BorrowRecordEntity> records = StreamSupport
                    .stream(borrowRecordRepository.findAll().spliterator(), false)
                    .collect(Collectors.toList());

            BorrowRecordsCountByStatus countByStatus = new BorrowRecordsCountByStatus();
            records.forEach(record -> updateStatusCount(countByStatus, record));

            return countByStatus;
        });
    }

    private List<BorrowRecordEntity> filterByBorrowedBy(List<BorrowRecordEntity> records, String borrowedBy) {
        return records.stream()
                .filter(record -> record.getBorrowedBy().equals(borrowedBy))
                .collect(Collectors.toList());
    }

    private List<BorrowRecordEntity> filterByItemId(List<BorrowRecordEntity> records, String itemId) {
        return records.stream()
                .filter(record -> record.getItem().getId().toString().equals(itemId))
                .collect(Collectors.toList());
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
                .item(record.getItem().toItem().build())
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