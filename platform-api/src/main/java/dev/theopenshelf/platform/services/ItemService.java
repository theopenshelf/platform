package dev.theopenshelf.platform.services;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import dev.theopenshelf.platform.entities.BorrowRecordEntity;
import dev.theopenshelf.platform.entities.CategoryEntity;
import dev.theopenshelf.platform.entities.ItemEntity;
import dev.theopenshelf.platform.entities.ItemImageEntity;
import dev.theopenshelf.platform.entities.LibraryEntity;
import dev.theopenshelf.platform.entities.LibraryMemberEntity;
import dev.theopenshelf.platform.entities.MemberRoleEntity;
import dev.theopenshelf.platform.entities.NotificationEntity;
import dev.theopenshelf.platform.entities.NotificationType;
import dev.theopenshelf.platform.entities.UserEntity;
import dev.theopenshelf.platform.exceptions.CodedError;
import dev.theopenshelf.platform.exceptions.CodedException;
import dev.theopenshelf.platform.model.ApprovalReservationRequest;
import dev.theopenshelf.platform.model.BorrowItemRequest;
import dev.theopenshelf.platform.model.BorrowRecord;
import dev.theopenshelf.platform.model.BorrowStatus;
import dev.theopenshelf.platform.model.Item;
import dev.theopenshelf.platform.model.ItemStat;
import dev.theopenshelf.platform.model.PaginatedItemsResponse;
import dev.theopenshelf.platform.model.ReturnItemRequest;
import dev.theopenshelf.platform.repositories.BorrowRecordRepository;
import dev.theopenshelf.platform.repositories.CategoryRepository;
import dev.theopenshelf.platform.repositories.ItemsRepository;
import dev.theopenshelf.platform.repositories.LibraryRepository;
import dev.theopenshelf.platform.repositories.UsersRepository;
import dev.theopenshelf.platform.specifications.ItemSpecifications;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@Slf4j
@RequiredArgsConstructor
public class ItemService {
    private final ItemsRepository itemRepository;
    private final BorrowRecordRepository borrowRecordRepository;
    private final LibraryRepository libraryRepository;
    private final NotificationsService notificationsService;
    private final UsersRepository usersRepository;
    private final CategoryRepository categoryRepository;

    public Mono<ItemEntity> createItem(Item item, UUID ownerId) {
        LibraryEntity library = libraryRepository.findById(item.getLibraryId())
                .orElseThrow(() -> new CodedException(CodedError.LIBRARY_NOT_FOUND.getCode(),
                        CodedError.LIBRARY_NOT_FOUND.getDefaultMessage(),
                        Map.of("libraryId", item.getLibraryId()),
                        CodedError.LIBRARY_NOT_FOUND.getDocumentationUrl()));

        CategoryEntity category = categoryRepository.findById(item.getCategory().getId())
                .orElseThrow(() -> new CodedException(CodedError.LIBRARY_NOT_FOUND.getCode(),
                        CodedError.CATEGORY_NOT_FOUND.getDefaultMessage(),
                        Map.of("category", item.getCategory().getId()),
                        CodedError.CATEGORY_NOT_FOUND.getDocumentationUrl()));

        ItemEntity entity = ItemEntity.builder()
                .id(UUID.randomUUID())
                .communityId(library.getCommunityId())
                .category(category)
                .name(item.getName())
                .description(item.getDescription())
                .shortDescription(item.getShortDescription())
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
            int validPage = Math.max(0, page != null ? page - 1 : 0);
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
                    .map(item -> item.toItem().build())
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

    public Mono<BorrowRecordEntity> reserveOrBorrowNow(UUID itemId, UUID currentUserId, BorrowItemRequest request) {
        ItemEntity item = itemRepository.findById(itemId).orElse(null);
        if (item == null) {
            return Mono.empty();
        }

        UUID borrower = currentUserId;
        if (request.getBorrowBy() != null) {
            borrower = request.getBorrowBy();
        }
        LocalDate now = LocalDate.now();
        BorrowStatus status;
        if (request.getStartDate().isAfter(now)) {
            status = isApprovalRequired(currentUserId, item) ? BorrowStatus.RESERVED_UNCONFIRMED
                    : BorrowStatus.RESERVED_CONFIRMED;
        } else {
            status = isApprovalRequired(currentUserId, item) ? BorrowStatus.RESERVED_PICKUP_UNCONFIRMED
                    : BorrowStatus.RESERVED_READY_TO_PICKUP;
        }
        // TODO verify the item is not currently borrowed or reserved
        // TODO verify the reservation date are not conflicting with other borrow

        BorrowRecordEntity borrowRecord = BorrowRecordEntity.builder()
                .id(UUID.randomUUID())
                .item(item)
                .borrowedBy(borrower.toString())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .reservationDate(LocalDate.now())
                .status(status)
                .build();

        item.setBorrowCount(item.getBorrowCount() + 1);
        itemRepository.save(item);

        if (borrowRecord.getStatus() == BorrowStatus.RESERVED_UNCONFIRMED
                || borrowRecord.getStatus() == BorrowStatus.RESERVED_PICKUP_UNCONFIRMED) {
            LibraryEntity library = libraryRepository.findByIdWithMembers(item.getLibraryId())
                    .orElseThrow(() -> new CodedException(CodedError.LIBRARY_NOT_FOUND.getCode(),
                            CodedError.LIBRARY_NOT_FOUND.getDefaultMessage(),
                            Map.of("libraryId", item.getLibraryId()),
                            CodedError.LIBRARY_NOT_FOUND.getDocumentationUrl()));
            for (LibraryMemberEntity member : library.getMembers().stream()
                    .filter(m -> m.getRole() == MemberRoleEntity.ADMIN).collect(Collectors.toSet())) {
                notificationsService.sendNotifications(member.getUser(), NotificationEntity.builder()
                        .type(borrowRecord.getStatus() == BorrowStatus.RESERVED_UNCONFIRMED
                                ? NotificationType.ITEM_NEW_RETURN_TO_CONFIRM
                                : NotificationType.ITEM_NEW_PICKUP_TO_CONFIRM)
                        .alreadyRead(false)
                        .author(NotificationsService.PLATFORM_AUTHOR)
                        .userId(member.getId())
                        .payload(Map.of("item", item))
                        .build());
            }
        }
        return Mono.just(borrowRecordRepository.save(borrowRecord));
    }

    public Mono<ItemEntity> approvalReservation(UUID userId, UUID itemId, UUID recordId,
            ApprovalReservationRequest.DecisionEnum decision) {
        ItemEntity item = itemRepository.findById(itemId)
                .orElseThrow(() -> new CodedException(CodedError.ITEM_NOT_FOUND.getCode(),
                        CodedError.ITEM_NOT_FOUND.getDefaultMessage(),
                        Map.of("itemId", itemId),
                        CodedError.ITEM_NOT_FOUND.getDocumentationUrl()));

        BorrowRecordEntity record = borrowRecordRepository.findById(recordId)
                .orElseThrow(() -> new CodedException(CodedError.BORROW_RECORD_NOT_FOUND.getCode(),
                        CodedError.BORROW_RECORD_NOT_FOUND.getDefaultMessage(),
                        Map.of("recordId", recordId),
                        CodedError.BORROW_RECORD_NOT_FOUND.getDocumentationUrl()));

        checkIfApprovalIsRequiredAndPermission(userId, item);
        if (record.getStatus() != BorrowStatus.RESERVED_UNCONFIRMED) {
            throw new CodedException(CodedError.INVALID_STATUS_TRANSITION.getCode(),
                    "Cannot confirm reservation of a borrow record not in reservation unconfirmed state",
                    Map.of("currentStatus", record.getStatus(),
                            "expectedStatus", BorrowStatus.RESERVED_UNCONFIRMED),
                    CodedError.INVALID_STATUS_TRANSITION.getDocumentationUrl());
        }

        record.setStatus(BorrowStatus.RESERVED_CONFIRMED);
        borrowRecordRepository.save(record);

        UserEntity user = usersRepository.findById(userId)
                .orElseThrow(() -> new CodedException(CodedError.USER_NOT_FOUND.getCode(),
                        CodedError.USER_NOT_FOUND.getDefaultMessage(),
                        Map.of("userId", userId),
                        CodedError.USER_NOT_FOUND.getDocumentationUrl()));

        notificationsService.sendNotifications(user, NotificationEntity.builder()
                .type(NotificationType.ITEM_RESERVATION_APPROVED)
                .alreadyRead(false)
                .author(NotificationsService.PLATFORM_AUTHOR)
                .userId(userId)
                .payload(Map.of("item", item))
                .build());

        return Mono.just(itemRepository.save(item));
    }

    public Mono<ItemEntity> pickupItem(UUID itemId, UUID userId, ReturnItemRequest request) {
        return Mono.justOrEmpty(itemRepository.findById(itemId))
                .map(item -> borrowRecordRepository
                        .findByItemIdAndBorrowedByAndStatus(itemId, userId.toString(),
                                BorrowStatus.RESERVED_READY_TO_PICKUP)
                        .map(record -> {
                            if (record.getStatus() != BorrowStatus.RESERVED_READY_TO_PICKUP) {
                                throw new CodedException(CodedError.INVALID_STATUS_TRANSITION.getCode(),
                                        "Cannot pickup an item not in ready to pickup state",
                                        Map.of("currentStatus", record.getStatus(),
                                                "expectedStatus", BorrowStatus.RESERVED_READY_TO_PICKUP),
                                        CodedError.INVALID_STATUS_TRANSITION.getDocumentationUrl());
                            }

                            BorrowStatus status = isApprovalRequired(userId, item)
                                    ? BorrowStatus.RESERVED_PICKUP_UNCONFIRMED
                                    : BorrowStatus.BORROWED_ACTIVE;

                            record.setStatus(status);
                            record.setPickupDate(LocalDate.now());
                            borrowRecordRepository.save(record);

                            if (status == BorrowStatus.RESERVED_PICKUP_UNCONFIRMED) {
                                LibraryEntity library = libraryRepository.findByIdWithMembers(item.getLibraryId())
                                        .orElseThrow(() -> new CodedException(CodedError.LIBRARY_NOT_FOUND.getCode(),
                                                CodedError.LIBRARY_NOT_FOUND.getDefaultMessage(),
                                                Map.of("libraryId", item.getLibraryId()),
                                                CodedError.LIBRARY_NOT_FOUND.getDocumentationUrl()));
                                for (LibraryMemberEntity member : library.getMembers().stream()
                                        .filter(m -> m.getRole() == MemberRoleEntity.ADMIN)
                                        .collect(Collectors.toSet())) {
                                    notificationsService.sendNotifications(member.getUser(),
                                            NotificationEntity.builder()
                                                    .type(NotificationType.ITEM_NEW_PICKUP_TO_CONFIRM)
                                                    .alreadyRead(false)
                                                    .author(NotificationsService.PLATFORM_AUTHOR)
                                                    .userId(member.getId())
                                                    .payload(Map.of("item", item))
                                                    .build());
                                }
                            }
                            return item;
                        })
                        .flatMap(i -> itemRepository.findById(itemId))
                        .orElseThrow());
    }

    public Mono<ItemEntity> approvalPickup(UUID userId, UUID itemId, UUID recordId,
            ApprovalReservationRequest.DecisionEnum decision) {
        ItemEntity item = itemRepository.findById(itemId)
                .orElseThrow(() -> new CodedException(CodedError.ITEM_NOT_FOUND.getCode(),
                        CodedError.ITEM_NOT_FOUND.getDefaultMessage(),
                        Map.of("itemId", itemId),
                        CodedError.ITEM_NOT_FOUND.getDocumentationUrl()));

        BorrowRecordEntity record = borrowRecordRepository.findById(recordId)
                .orElseThrow(() -> new CodedException(CodedError.BORROW_RECORD_NOT_FOUND.getCode(),
                        CodedError.BORROW_RECORD_NOT_FOUND.getDefaultMessage(),
                        Map.of("recordId", recordId),
                        CodedError.BORROW_RECORD_NOT_FOUND.getDocumentationUrl()));

        checkIfApprovalIsRequiredAndPermission(userId, item);
        if (record.getStatus() != BorrowStatus.RESERVED_PICKUP_UNCONFIRMED) {
            throw new CodedException(CodedError.INVALID_STATUS_TRANSITION.getCode(),
                    "Cannot confirm pickup of a borrow record not in pickup unconfirmed state",
                    Map.of("currentStatus", record.getStatus(),
                            "expectedStatus", BorrowStatus.RESERVED_PICKUP_UNCONFIRMED),
                    CodedError.INVALID_STATUS_TRANSITION.getDocumentationUrl());
        }

        record.setStatus(BorrowStatus.BORROWED_ACTIVE);
        borrowRecordRepository.save(record);

        UserEntity user = usersRepository.findById(userId)
                .orElseThrow(() -> new CodedException(CodedError.USER_NOT_FOUND.getCode(),
                        CodedError.USER_NOT_FOUND.getDefaultMessage(),
                        Map.of("userId", userId),
                        CodedError.USER_NOT_FOUND.getDocumentationUrl()));

        notificationsService.sendNotifications(user, NotificationEntity.builder()
                .type(NotificationType.ITEM_PICK_UP_APPROVED)
                .alreadyRead(false)
                .author(NotificationsService.PLATFORM_AUTHOR)
                .userId(userId)
                .payload(Map.of("item", item))
                .build());

        return Mono.just(itemRepository.save(item));
    }

    public Mono<ItemEntity> returnItem(UUID userId, UUID itemId, UUID recordId) {
        ItemEntity item = itemRepository.findById(itemId).orElse(null);
        BorrowRecordEntity record = borrowRecordRepository.findById(recordId).orElse(null);

        if (item == null || record == null) {
            return Mono.empty();
        }

        switch (record.getStatus()) {
            case BORROWED_LATE:
            case BORROWED_ACTIVE:
            case BORROWED_DUE_TODAY:
                log.info("The borrow record is in a valid state to be returned '" + record.getStatus() + "'");
                break;
            default:
                throw new CodedException(CodedError.INVALID_STATUS_TRANSITION.getCode(),
                        "Cannot returned an item that is currently not borrowed",
                        Map.of("currentStatus", record.getStatus()),
                        CodedError.INVALID_STATUS_TRANSITION.getDocumentationUrl());
        }

        LocalDate today = LocalDate.now();
        if (isApprovalRequired(userId, item)) {
            record.setStatus(BorrowStatus.BORROWED_RETURN_UNCONFIRMED);
        } else if (today.isBefore(record.getEndDate())) {
            record.setStatus(BorrowStatus.RETURNED_EARLY);
        } else if (today.isEqual(record.getEndDate())) {
            record.setStatus(BorrowStatus.RETURNED_ON_TIME);
        } else {
            record.setStatus(BorrowStatus.RETURNED_LATE);
        }
        record.setEffectiveReturnDate(today);
        borrowRecordRepository.save(record);
        if (record.getStatus() == BorrowStatus.BORROWED_RETURN_UNCONFIRMED) {
            LibraryEntity library = libraryRepository.findByIdWithMembers(item.getLibraryId())
                    .orElseThrow(() -> new CodedException(CodedError.LIBRARY_NOT_FOUND.getCode(),
                            CodedError.LIBRARY_NOT_FOUND.getDefaultMessage(),
                            Map.of("libraryId", item.getLibraryId()),
                            CodedError.LIBRARY_NOT_FOUND.getDocumentationUrl()));
            for (LibraryMemberEntity member : library.getMembers().stream()
                    .filter(m -> m.getRole() == MemberRoleEntity.ADMIN).collect(Collectors.toSet())) {
                notificationsService.sendNotifications(member.getUser(), NotificationEntity.builder()
                        .type(NotificationType.ITEM_NEW_RESERVATION_TO_CONFIRM)
                        .alreadyRead(false)
                        .author(NotificationsService.PLATFORM_AUTHOR)
                        .userId(member.getId())
                        .payload(Map.of("item", item))
                        .build());
            }
        }

        return Mono.just(itemRepository.save(item));
    }

    public Mono<ItemEntity> approvalReturn(UUID userId, UUID itemId, UUID recordId,
            ApprovalReservationRequest.DecisionEnum decision) {
        ItemEntity item = itemRepository.findById(itemId)
                .orElseThrow(() -> new CodedException(CodedError.ITEM_NOT_FOUND.getCode(),
                        CodedError.ITEM_NOT_FOUND.getDefaultMessage(),
                        Map.of("itemId", itemId),
                        CodedError.ITEM_NOT_FOUND.getDocumentationUrl()));

        BorrowRecordEntity record = borrowRecordRepository.findById(recordId)
                .orElseThrow(() -> new CodedException(CodedError.BORROW_RECORD_NOT_FOUND.getCode(),
                        CodedError.BORROW_RECORD_NOT_FOUND.getDefaultMessage(),
                        Map.of("recordId", recordId),
                        CodedError.BORROW_RECORD_NOT_FOUND.getDocumentationUrl()));

        checkIfApprovalIsRequiredAndPermission(userId, item);
        if (record.getStatus() != BorrowStatus.BORROWED_RETURN_UNCONFIRMED) {
            throw new CodedException(CodedError.INVALID_STATUS_TRANSITION.getCode(),
                    "Cannot confirm return of a borrow record not in return unconfirmed state",
                    Map.of("currentStatus", record.getStatus(),
                            "expectedStatus", BorrowStatus.BORROWED_RETURN_UNCONFIRMED),
                    CodedError.INVALID_STATUS_TRANSITION.getDocumentationUrl());
        }

        LocalDate today = LocalDate.now();
        if (today.isBefore(record.getEndDate())) {
            record.setStatus(BorrowStatus.RETURNED_EARLY);
        } else if (today.isEqual(record.getEndDate())) {
            record.setStatus(BorrowStatus.RETURNED_ON_TIME);
        } else {
            record.setStatus(BorrowStatus.RETURNED_LATE);
        }
        borrowRecordRepository.save(record);

        UserEntity user = usersRepository.findById(userId)
                .orElseThrow(() -> new CodedException(CodedError.USER_NOT_FOUND.getCode(),
                        CodedError.USER_NOT_FOUND.getDefaultMessage(),
                        Map.of("userId", userId),
                        CodedError.USER_NOT_FOUND.getDocumentationUrl()));

        notificationsService.sendNotifications(user, NotificationEntity.builder()
                .type(NotificationType.ITEM_RETURN_APPROVED)
                .alreadyRead(false)
                .author(NotificationsService.PLATFORM_AUTHOR)
                .userId(userId)
                .payload(Map.of("item", item))
                .build());

        return Mono.just(itemRepository.save(item));
    }

    public boolean isApprovalRequired(UUID userId, ItemEntity item) {
        LibraryEntity library = libraryRepository.findByIdWithMembers(item.getLibraryId())
                .orElseThrow(() -> new CodedException(CodedError.LIBRARY_NOT_FOUND.getCode(),
                        CodedError.LIBRARY_NOT_FOUND.getDefaultMessage(),
                        Map.of("libraryId", item.getLibraryId()),
                        CodedError.LIBRARY_NOT_FOUND.getDocumentationUrl()));
        MemberRoleEntity role = library.getMembers().stream()
                .filter(m -> m.getUser().getId().equals(userId))
                .findFirst()
                .map(m -> m.getRole())
                .orElse(MemberRoleEntity.MEMBER);

        return !role.equals(MemberRoleEntity.ADMIN) && library.isRequiresApproval();
    }

    public void checkIfApprovalIsRequiredAndPermission(UUID userId, ItemEntity item) {
        LibraryEntity library = libraryRepository.findByIdWithMembers(item.getLibraryId())
                .orElseThrow(() -> new CodedException(CodedError.LIBRARY_NOT_FOUND.getCode(),
                        CodedError.LIBRARY_NOT_FOUND.getDefaultMessage(),
                        Map.of("libraryId", item.getLibraryId()),
                        CodedError.LIBRARY_NOT_FOUND.getDocumentationUrl()));

        MemberRoleEntity role = library.getMembers().stream()
                .filter(m -> m.getUser().getId().equals(userId))
                .findFirst()
                .map(m -> m.getRole())
                .orElse(MemberRoleEntity.MEMBER);

        if (!role.equals(MemberRoleEntity.ADMIN)) {
            throw new CodedException(CodedError.INSUFFICIENT_PERMISSIONS.getCode(),
                    "Only library admins can approve actions",
                    Map.of("userId", userId, "libraryId", library.getId()),
                    CodedError.INSUFFICIENT_PERMISSIONS.getDocumentationUrl());
        }

        if (!library.isRequiresApproval()) {
            throw new CodedException(CodedError.APPROVAL_NOT_REQUIRED.getCode(),
                    CodedError.APPROVAL_NOT_REQUIRED.getDefaultMessage(),
                    Map.of("libraryId", library.getId()),
                    CodedError.APPROVAL_NOT_REQUIRED.getDocumentationUrl());
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
        return Mono.justOrEmpty(itemRepository.findByIdWithImages(itemId));
    }
}
