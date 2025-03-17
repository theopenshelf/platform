package dev.theopenshelf.platform.api.hub.items;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ServerWebExchange;

import dev.theopenshelf.platform.api.ItemsHubApiApiDelegate;
import dev.theopenshelf.platform.model.ApprovalReservationRequest;
import dev.theopenshelf.platform.model.BorrowItemRequest;
import dev.theopenshelf.platform.model.BorrowRecord;
import dev.theopenshelf.platform.model.Item;
import dev.theopenshelf.platform.model.PaginatedItemsResponse;
import dev.theopenshelf.platform.model.ReturnItemRequest;
import dev.theopenshelf.platform.services.ItemService;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class ItemsHubApi implements ItemsHubApiApiDelegate {

    private final ItemService itemService;

    @Override
    public Mono<ResponseEntity<Item>> addItem(Mono<Item> itemMono, ServerWebExchange exchange) {
        //TODO only allow to add item to a library, if current user is admin of the community and the library part of the community
        return exchange.getPrincipal()
                .map(principal -> UUID.fromString(principal.getName()))
                .flatMap(userId ->
                        itemMono.flatMap(item -> itemService.createItem(item, userId)
                                .map(entity -> ResponseEntity.ok(entity.toItem().build()))
                        )
                );
    }

    @Override
    public Mono<ResponseEntity<Item>> getItem(UUID itemId, ServerWebExchange exchange) {
        //TODO only get item if user is member of the community on which the item->library is part
        return itemService.getItem(itemId)
                .map(item -> ResponseEntity.ok(item.toItem().build()))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @Override
    public Mono<ResponseEntity<PaginatedItemsResponse>> getItems(Boolean borrowedByCurrentUser, String borrowedBy,
            List<String> libraryIds, List<String> communityIds, List<String> categories, String searchText,
            Boolean currentlyAvailable, String sortBy, String sortOrder, Integer page, Integer pageSize,
            LocalDate startDate, LocalDate endDate, Boolean favorite, ServerWebExchange exchange) {
        //TODO only returns items if user is member of the community on which the item->library is part
        return exchange.getPrincipal()
                .map(principal -> UUID.fromString(principal.getName()))
                .flatMap(currentUserId ->
                                itemService.getFilteredItems(
                                        borrowedByCurrentUser != null && borrowedByCurrentUser ? currentUserId.toString() : borrowedBy , libraryIds, communityIds, categories,
                                        searchText, currentlyAvailable, sortBy, sortOrder, page, pageSize, favorite))
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.ok(new PaginatedItemsResponse()));
    }

    @Override
    public Mono<ResponseEntity<Item>> borrowItem(UUID itemId, Mono<BorrowItemRequest> borrowItemRequestMono,
            ServerWebExchange exchange) {
        //TODO only borrow item if user is member of the community on which the item->library is part
        return exchange.getPrincipal()
                .map(principal -> UUID.fromString(principal.getName()))
                .flatMap(userId -> borrowItemRequestMono
                        .flatMap(request -> itemService.createBorrowRecord(itemId, userId, request)
                                .map(record -> ResponseEntity.ok(record.getItem().toItem(false).build()))
                                .defaultIfEmpty(ResponseEntity.notFound().build())));
    }

    @Override
    public Mono<ResponseEntity<Item>> returnItem(UUID itemId, Mono<ReturnItemRequest> returnItemRequestMono,
            ServerWebExchange exchange) {
        //TODO only return item if user is member of the community on which the item->library is part
        return returnItemRequestMono
                .flatMap(request -> itemService.updateBorrowStatus(itemId, request.getBorrowRecordId(), "return")
                        .map(item -> ResponseEntity.ok(item.toItem().build()))
                        .defaultIfEmpty(ResponseEntity.notFound().build()));
    }

    @Override
    public Mono<ResponseEntity<Item>> approvalReservation(UUID itemId,
            Mono<ApprovalReservationRequest> approvalRequestMono, ServerWebExchange exchange) {
        //TODO only approval item if user is admin of the community on which the item->library is part
        return approvalRequestMono.flatMap(request -> itemService
                .updateBorrowStatus(itemId, request.getBorrowRecordId(), request.getDecision().name())
                .map(item -> ResponseEntity.ok(item.toItem().build()))
                .defaultIfEmpty(ResponseEntity.notFound().build()));
    }

    @Override
    public Mono<ResponseEntity<Item>> approvalPickup(UUID itemId,
            Mono<ApprovalReservationRequest> approvalRequestMono, ServerWebExchange exchange) {
        //TODO only approval item if user is admin of the community on which the item->library is part
        return approvalRequestMono.flatMap(request -> itemService
                .updateBorrowStatus(itemId, request.getBorrowRecordId(), request.getDecision().name())
                .map(item -> ResponseEntity.ok(item.toItem().build()))
                .defaultIfEmpty(ResponseEntity.notFound().build()));
    }

    @Override
    public Mono<ResponseEntity<Item>> approvalReturn(UUID itemId,
            Mono<ApprovalReservationRequest> approvalRequestMono, ServerWebExchange exchange) {
        //TODO only approval item if user is admin of the community on which the item->library is part
        return approvalRequestMono.flatMap(request -> itemService
                .updateBorrowStatus(itemId, request.getBorrowRecordId(), request.getDecision().name())
                .map(item -> ResponseEntity.ok(item.toItem().build()))
                .defaultIfEmpty(ResponseEntity.notFound().build()));
    }

    @Override
    public Mono<ResponseEntity<Void>> deleteBorrowRecord(UUID itemId, String recordId, String owner, String borrower,
            ServerWebExchange exchange) {
        return itemService.deleteBorrowRecord(itemId, UUID.fromString(recordId))
                .then(Mono.just(ResponseEntity.noContent().<Void>build()))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @Override
    public Mono<ResponseEntity<Flux<BorrowRecord>>> getItemBorrowRecords(UUID itemId, String owner, String borrower,
            ServerWebExchange exchange) {
        //TODO only get item borrow records if user is member of the community on which the item->library is part
        return Mono.just(ResponseEntity.ok(itemService.getItemBorrowRecords(itemId)));
    }

    @Override
    public Mono<ResponseEntity<Item>> markAsFavorite(UUID itemId, ServerWebExchange exchange) {
        //TODO only favorite item if user is member of the community on which the item->library is part
        return itemService.toggleFavorite(itemId)
                .map(item -> ResponseEntity.ok(item.toItem().build()))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
}