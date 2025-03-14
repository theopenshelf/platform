package dev.theopenshelf.platform.api.hub.borrowrecords;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ServerWebExchange;

import dev.theopenshelf.platform.api.BorrowRecordsHubApiApiDelegate;
import dev.theopenshelf.platform.model.BorrowRecordsCountByStatus;
import dev.theopenshelf.platform.model.PaginatedBorrowRecordsResponse;
import dev.theopenshelf.platform.services.BorrowRecordsService;
import reactor.core.publisher.Mono;

@Service
public class BorrowRecordsHubApi implements BorrowRecordsHubApiApiDelegate {

    private final BorrowRecordsService borrowRecordsService;

    public BorrowRecordsHubApi(BorrowRecordsService borrowRecordsService) {
        this.borrowRecordsService = borrowRecordsService;
    }

    @Override
    public Mono<ResponseEntity<PaginatedBorrowRecordsResponse>> getBorrowRecords(Boolean borrowedByCurrentUser,
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
            Boolean favorite,
            ServerWebExchange exchange) {

        return borrowRecordsService.getBorrowRecords(
                borrowedByCurrentUser,
                borrowedBy,
                itemId,
                sortBy,
                sortOrder,
                libraryIds,
                categories,
                searchText,
                page != null ? page : 1,
                pageSize != null ? pageSize : 10,
                status,
                favorite)
                .map(ResponseEntity::ok);
    }

    @Override
    public Mono<ResponseEntity<BorrowRecordsCountByStatus>> getBorrowRecordsCountByStatus(Boolean borrowedByCurrentUser,
            String borrowedBy,
            String itemId,
            List<String> libraryIds,
            List<String> status,
            ServerWebExchange exchange) {

        return exchange.getPrincipal()
                .map(principal -> UUID.fromString(principal.getName()))
                .flatMap(currentUserId -> borrowRecordsService.getBorrowRecordsCountByStatus(
                    borrowedByCurrentUser,
                    borrowedByCurrentUser != null && borrowedByCurrentUser ? currentUserId.toString() : borrowedBy,
                    itemId,
                    libraryIds,
                    status)
                    .map(ResponseEntity::ok)
                );
    }
}