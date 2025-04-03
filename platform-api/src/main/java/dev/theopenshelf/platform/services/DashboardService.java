package dev.theopenshelf.platform.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import dev.theopenshelf.platform.model.BorrowerMetrics;
import dev.theopenshelf.platform.model.CategoryMetrics;
import dev.theopenshelf.platform.model.DashboardBorrowesMetrics;
import dev.theopenshelf.platform.model.DashboardBorrowesMetricsMetrics;
import dev.theopenshelf.platform.model.DashboardBorrowesOverTimeData;
import dev.theopenshelf.platform.model.ItemMetrics;
import dev.theopenshelf.platform.repositories.BorrowRecordRepository;
import dev.theopenshelf.platform.repositories.CategoryRepository;
import dev.theopenshelf.platform.repositories.CommunityRepository;
import dev.theopenshelf.platform.repositories.ItemsRepository;
import dev.theopenshelf.platform.repositories.UsersRepository;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final BorrowRecordRepository borrowRecordRepository;
    private final CategoryRepository categoryRepository;
    private final CommunityRepository communityRepository;
    private final ItemsRepository itemRepository;
    private final UsersRepository userRepository;

    public Mono<DashboardBorrowesOverTimeData> getDashboardData() {
        // TODO: Implement this method to return borrow data over time
        return Mono.just(DashboardBorrowesOverTimeData.builder().build());
    }

    public Mono<DashboardBorrowesMetrics> getDashboardMetrics() {
        return Mono.fromCallable(() -> {
            long activeBorrows = borrowRecordRepository.countActiveBorrows();
            long activeReservations = borrowRecordRepository.countActiveReservations();
            long totalBorrows = borrowRecordRepository.countTotalBorrows();

            return DashboardBorrowesMetrics.builder()
                    .metrics(DashboardBorrowesMetricsMetrics.builder()
                            .itemsOnLoan((int) activeBorrows)
                            .totalReservations((int) activeReservations)
                            .totalBorrows((int) totalBorrows)
                            .build())
                    .build();
        });
    }

    public Mono<List<BorrowerMetrics>> getTopBorrowers() {
        return Mono
                .fromCallable(() -> borrowRecordRepository.findTopBorrowers(PageRequest.of(0, 5)).getContent().stream()
                        .map(row -> BorrowerMetrics.builder()
                                .username((String) row[0])
                                .totalBorrows(((Number) row[1]).intValue())
                                .build())
                        .collect(Collectors.toList()));
    }

    public Mono<List<CategoryMetrics>> getTopCategories() {
        return Mono.fromCallable(() -> categoryRepository.findTopCategories(PageRequest.of(0, 5)).getContent().stream()
                .map(row -> CategoryMetrics.builder()
                        .category((String) row[0])
                        .icon((String) row[1])
                        .totalBorrows(((Number) row[2]).intValue())
                        .borrowedItems(((Number) row[3]).intValue())
                        .build())
                .collect(Collectors.toList()));
    }

    public Mono<List<ItemMetrics>> getTopItems() {
        return Mono.fromCallable(() -> itemRepository.findTopItems(PageRequest.of(0, 5)).getContent().stream()
                .map(row -> ItemMetrics.builder()
                        .item((String) row[0])
                        .totalBorrows(((Number) row[1]).intValue())
                        .build())
                .collect(Collectors.toList()));
    }

    public Mono<Integer> getUserCount() {
        return Mono.fromCallable(() -> (int) userRepository.count());
    }

    public Mono<Integer> getItemCount() {
        return Mono.fromCallable(() -> (int) itemRepository.count());
    }

    public Mono<Integer> getLibraryCount() {
        return Mono.fromCallable(() -> (int) communityRepository.count());
    }
}