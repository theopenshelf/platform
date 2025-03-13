package dev.theopenshelf.platform.api.admin;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ServerWebExchange;

import dev.theopenshelf.platform.api.ItemsAdminApiApiDelegate;
import dev.theopenshelf.platform.entities.CategoryEntity;
import dev.theopenshelf.platform.entities.ItemEntity;
import dev.theopenshelf.platform.model.ItemStat;
import dev.theopenshelf.platform.model.PaginatedItemsStatsResponse;
import dev.theopenshelf.platform.services.ItemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class ItemsAdminApi implements ItemsAdminApiApiDelegate {

    private final ItemService itemService;

    @Override
    public Mono<ResponseEntity<ItemStat>> addAdminItem(Mono<ItemStat> itemStat, ServerWebExchange exchange) {
        return itemStat
                .flatMap(stat -> itemService.createItem(stat, UUID.fromString(stat.getOwner()))
                        .map(entity -> ResponseEntity.ok(entity.toItemStat().build())));
    }

    @Override
    public Mono<ResponseEntity<ItemStat>> getAdminItemById(UUID itemId, ServerWebExchange exchange) {
        return itemService.getItem(itemId)
                .map(entity -> ResponseEntity.ok(entity.toItemStat().build()))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @Override
    public Mono<ResponseEntity<PaginatedItemsStatsResponse>> getAdminItems(Boolean borrowedByCurrentUser,
            List<String> libraryIds, List<String> categories, String searchText, Boolean currentlyAvailable,
            String sortBy, String sortOrder, Integer page, Integer pageSize, String status,
            ServerWebExchange exchange) {
        return itemService.getFilteredItems(null, libraryIds, null, categories, searchText,
                currentlyAvailable, sortBy, sortOrder, page, pageSize, null)
                .map(response -> {
                    PaginatedItemsStatsResponse statsResponse = new PaginatedItemsStatsResponse();
                    statsResponse.setItems(response.getItems().stream()
                            .map(item -> ItemEntity.builder()
                                    .id(item.getId())
                                    .name(item.getName())
                                    .description(item.getDescription())
                                    .shortDescription(item.getShortDescription())
                                    .imageUrl(item.getImageUrl())
                                    .owner(item.getOwner())
                                    .borrowCount(item.getBorrowCount())
                                    .favorite(item.getFavorite())
                                    .libraryId(item.getLibraryId())
                                    .category(item.getCategory() != null ? CategoryEntity.builder()
                                            .id(item.getCategory().getId())
                                            .name(item.getCategory().getName())
                                            .build() : null)
                                    .createdAt(item.getCreatedAt() != null ? item.getCreatedAt().toInstant() : null)
                                    .build()
                                    .toItemStat()
                                    .build())
                            .toList());
                    statsResponse.setTotalItems(response.getTotalItems());
                    statsResponse.setCurrentPage(response.getCurrentPage());
                    statsResponse.setItemsPerPage(response.getItemsPerPage());
                    statsResponse.setTotalPages(response.getTotalPages());
                    return ResponseEntity.ok(statsResponse);
                });
    }
}