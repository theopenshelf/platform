package dev.theopenshelf.platform.api.admin;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ServerWebExchange;

import dev.theopenshelf.platform.api.DashboardsAdminApiApiDelegate;
import dev.theopenshelf.platform.model.BorrowerMetrics;
import dev.theopenshelf.platform.model.CategoryMetrics;
import dev.theopenshelf.platform.model.DashboardBorrowesMetrics;
import dev.theopenshelf.platform.model.DashboardBorrowesOverTimeData;
import dev.theopenshelf.platform.model.ItemMetrics;
import dev.theopenshelf.platform.services.DashboardService;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
public class DashboardsAdminApi implements DashboardsAdminApiApiDelegate {
    private final DashboardService dashboardService;

    @Override
    public Mono<ResponseEntity<DashboardBorrowesOverTimeData>> getDashboardData(ServerWebExchange exchange) {
        return dashboardService.getDashboardData().map(ResponseEntity::ok);
    }

    @Override
    public Mono<ResponseEntity<DashboardBorrowesMetrics>> getDashboardMetrics(ServerWebExchange exchange) {
        return dashboardService.getDashboardMetrics().map(ResponseEntity::ok);
    }

    @Override
    public Mono<ResponseEntity<Flux<BorrowerMetrics>>> getTopBorrowers(ServerWebExchange exchange) {
        return dashboardService.getTopBorrowers()
                .map(list -> ResponseEntity.ok(Flux.fromIterable(list)));
    }

    @Override
    public Mono<ResponseEntity<Flux<CategoryMetrics>>> getTopCategories(ServerWebExchange exchange) {
        return dashboardService.getTopCategories()
                .map(list -> ResponseEntity.ok(Flux.fromIterable(list)));
    }

    @Override
    public Mono<ResponseEntity<Flux<ItemMetrics>>> getTopItems(ServerWebExchange exchange) {
        return dashboardService.getTopItems()
                .map(list -> ResponseEntity.ok(Flux.fromIterable(list)));
    }

    @Override
    public Mono<ResponseEntity<Integer>> getUserCount(ServerWebExchange exchange) {
        return dashboardService.getUserCount().map(ResponseEntity::ok);
    }

    @Override
    public Mono<ResponseEntity<Integer>> getItemCount(ServerWebExchange exchange) {
        return dashboardService.getItemCount().map(ResponseEntity::ok);
    }

    @Override
    public Mono<ResponseEntity<Integer>> getLibraryCount(ServerWebExchange exchange) {
        return dashboardService.getLibraryCount().map(ResponseEntity::ok);
    }
}