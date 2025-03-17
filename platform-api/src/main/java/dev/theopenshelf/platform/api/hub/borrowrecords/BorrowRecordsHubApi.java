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
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class BorrowRecordsHubApi implements BorrowRecordsHubApiApiDelegate {

    private final BorrowRecordsService borrowRecordsService;

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

        //TODO only allow community->admin to see all the records of a community
        //TODO otherwise only returns the borrowRecords of the current user
        return exchange.getPrincipal()
                .map(principal -> UUID.fromString(principal.getName()))
                .map(currentUserId -> borrowRecordsService.getBorrowRecords(
                    borrowedByCurrentUser,
                    borrowedByCurrentUser != null && borrowedByCurrentUser ? currentUserId.toString() : borrowedBy,
                    itemId,
                    sortBy,
                    sortOrder,
                    libraryIds,
                    categories,
                    searchText,
                    page != null ? page : 1,
                    pageSize != null ? pageSize : 10,
                    status,
                    favorite
                ))
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
                .map(currentUserId -> borrowRecordsService.getBorrowRecordsCountByStatus(
                    borrowedByCurrentUser,
                    borrowedByCurrentUser != null && borrowedByCurrentUser ? currentUserId.toString() : borrowedBy,
                    itemId,
                    libraryIds,
                    status)
                ).map(ResponseEntity::ok);
    }
}