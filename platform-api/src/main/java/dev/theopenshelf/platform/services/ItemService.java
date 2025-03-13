package dev.theopenshelf.platform.services;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import dev.theopenshelf.platform.entities.BorrowRecordEntity;
import dev.theopenshelf.platform.entities.ItemEntity;
import dev.theopenshelf.platform.model.BorrowItemRequest;
import dev.theopenshelf.platform.model.BorrowRecord;
import dev.theopenshelf.platform.model.BorrowStatus;
import dev.theopenshelf.platform.model.Item;
import dev.theopenshelf.platform.model.ItemStat;
import dev.theopenshelf.platform.model.PaginatedItemsResponse;
import dev.theopenshelf.platform.repositories.BorrowRecordRepository;
import dev.theopenshelf.platform.repositories.ItemsRepository;
import dev.theopenshelf.platform.specifications.ItemSpecifications;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@Slf4j
public class ItemService {
    private final ItemsRepository itemRepository;
    private final BorrowRecordRepository borrowRecordRepository;

    public ItemService(ItemsRepository itemRepository, BorrowRecordRepository borrowRecordRepository) {
        this.itemRepository = itemRepository;
        this.borrowRecordRepository = borrowRecordRepository;
    }

    public Mono<ItemEntity> createItem(Item item, UUID ownerId) {
        ItemEntity entity = ItemEntity.builder()
                .id(UUID.randomUUID())
                .name(item.getName())
                .description(item.getDescription())
                .shortDescription(item.getShortDescription())
                .imageUrl(item.getImageUrl())
                .libraryId(item.getLibraryId())
                .owner(ownerId.toString())
                .createdAt(Instant.now())
                .borrowCount(0)
                .favorite(false)
                .build();

        return Mono.just(itemRepository.save(entity));
    }

    public Mono<ItemEntity> createItem(ItemStat itemStat, UUID ownerId) {
        ItemEntity entity = ItemEntity.builder()
                .id(itemStat.getId() != null ? itemStat.getId() : UUID.randomUUID())
                .name(itemStat.getName())
                .description(itemStat.getDescription())
                .shortDescription(itemStat.getShortDescription())
                .imageUrl(itemStat.getImageUrl())
                .libraryId(itemStat.getLibraryId())
                .owner(ownerId.toString())
                .createdAt(itemStat.getCreatedAt() != null ? itemStat.getCreatedAt().toInstant() : Instant.now())
                .borrowCount(itemStat.getBorrowCount() != null ? itemStat.getBorrowCount() : 0)
                .favorite(itemStat.getFavorite() != null ? itemStat.getFavorite() : false)
                .build();

        return Mono.just(itemRepository.save(entity));
    }

    public Mono<PaginatedItemsResponse> getFilteredItems(String borrowedBy, List<String> libraryIds,
            List<String> communityIds, List<String> categories, String searchText,
            Boolean currentlyAvailable, String sortBy, String sortOrder, Integer page,
            Integer pageSize, Boolean favorite) {

        try {
            // Validate and normalize input parameters
            int validPage = Math.max(0, page != null ? page : 0);
            int validPageSize = Math.max(1, pageSize != null ? pageSize : 10);
            String validSortBy = sortBy != null ? sortBy : "createdAt";
            Sort.Direction direction = Sort.Direction.fromString(sortOrder != null ? sortOrder : "ASC");

            PageRequest pageRequest = PageRequest.of(validPage, validPageSize, Sort.by(direction, validSortBy));

            // Create and execute specification
            Specification<ItemEntity> spec = ItemSpecifications.withFilters(
                    borrowedBy, libraryIds, communityIds, categories, searchText, favorite);

            org.springframework.data.domain.Page<ItemEntity> itemPage = itemRepository.findAll(spec, pageRequest);

            // Create response with null checks
            PaginatedItemsResponse response = new PaginatedItemsResponse();
            response.setItems(itemPage.getContent().stream()
                    .map(item -> {
                        if (item == null)
                            return null;
                        Item.ItemBuilder builder = item.toItem();
                        if (builder == null)
                            return null;
                        Item built = builder.build();
                        return built != null ? built : Item.builder().build(); // Return empty item if build fails
                    })
                    .filter(item -> item != null) // Filter out any nulls
                    .toList());
            response.setTotalItems((int) itemPage.getTotalElements());
            response.setCurrentPage(validPage);
            response.setItemsPerPage(validPageSize);
            response.setTotalPages(itemPage.getTotalPages());

            return Mono.justOrEmpty(response);
        } catch (Exception e) {
            // Log the error and return empty response instead of null
            log.error("Error getting filtered items", e);
            PaginatedItemsResponse emptyResponse = new PaginatedItemsResponse();
            emptyResponse.setItems(List.of());
            emptyResponse.setTotalItems(0);
            emptyResponse.setCurrentPage(0);
            emptyResponse.setItemsPerPage(10);
            emptyResponse.setTotalPages(0);
            return Mono.just(emptyResponse);
        }
    }

    public Mono<BorrowRecordEntity> createBorrowRecord(UUID itemId, UUID borrowerId, BorrowItemRequest request) {
        ItemEntity item = itemRepository.findById(itemId).orElse(null);
        if (item == null) {
            return Mono.empty();
        }

        BorrowRecordEntity borrowRecord = BorrowRecordEntity.builder()
                .id(UUID.randomUUID())
                .item(item)
                .borrowedBy(borrowerId.toString())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .reservationDate(LocalDate.now())
                .status(BorrowStatus.RESERVED_UNCONFIRMED)
                .build();

        item.setBorrowCount(item.getBorrowCount() + 1);
        itemRepository.save(item);
        return Mono.just(borrowRecordRepository.save(borrowRecord));
    }

    public Mono<ItemEntity> updateBorrowStatus(UUID itemId, UUID recordId, String decision) {
        ItemEntity item = itemRepository.findById(itemId).orElse(null);
        BorrowRecordEntity record = borrowRecordRepository.findById(recordId).orElse(null);

        if (item == null || record == null) {
            return Mono.empty();
        }

        updateBorrowRecordStatus(record, decision);
        borrowRecordRepository.save(record);
        return Mono.just(itemRepository.save(item));
    }

    private void updateBorrowRecordStatus(BorrowRecordEntity record, String decision) {
        if ("approve".equalsIgnoreCase(decision)) {
            if (record.getStatus() == BorrowStatus.RESERVED_UNCONFIRMED) {
                record.setStatus(BorrowStatus.RESERVED_CONFIRMED);
            } else if (record.getStatus() == BorrowStatus.RESERVED_READY_TO_PICKUP) {
                record.setStatus(BorrowStatus.BORROWED_ACTIVE);
            } else if (record.getStatus() == BorrowStatus.BORROWED_RETURN_UNCONFIRMED) {
                setReturnStatus(record);
            }
        } else {
            handleRejection(record);
        }
    }

    private void setReturnStatus(BorrowRecordEntity record) {
        LocalDate now = LocalDate.now();
        record.setEffectiveReturnDate(now);
        if (now.isBefore(record.getEndDate())) {
            record.setStatus(BorrowStatus.RETURNED_EARLY);
        } else if (now.isAfter(record.getEndDate())) {
            record.setStatus(BorrowStatus.RETURNED_LATE);
        } else {
            record.setStatus(BorrowStatus.RETURNED_ON_TIME);
        }
    }

    private void handleRejection(BorrowRecordEntity record) {
        switch (record.getStatus()) {
            case RESERVED_UNCONFIRMED -> record.setStatus(BorrowStatus.RESERVED_PICKUP_UNCONFIRMED);
            case RESERVED_READY_TO_PICKUP -> record.setStatus(BorrowStatus.BORROWED_LATE);
            case BORROWED_RETURN_UNCONFIRMED -> record.setStatus(BorrowStatus.BORROWED_LATE);
            default -> {
            }
        }
    }

    public Flux<BorrowRecord> getItemBorrowRecords(UUID itemId) {
        return Flux.fromIterable(borrowRecordRepository.findByItemId(itemId))
                .map(record -> record.toBorrowRecord().build());
    }

    public Mono<ItemEntity> toggleFavorite(UUID itemId) {
        ItemEntity item = itemRepository.findById(itemId).orElse(null);
        if (item == null) {
            return Mono.empty();
        }
        item.setFavorite(!item.isFavorite());
        return Mono.just(itemRepository.save(item));
    }

    public Mono<Void> deleteBorrowRecord(UUID itemId, UUID recordId) {
        BorrowRecordEntity record = borrowRecordRepository.findById(recordId).orElse(null);
        if (record == null || !record.getItem().getId().equals(itemId)) {
            return Mono.empty();
        }
        borrowRecordRepository.delete(record);
        return Mono.empty();
    }

    public Mono<ItemEntity> getItem(UUID itemId) {
        return Mono.justOrEmpty(itemRepository.findById(itemId));
    }
}
