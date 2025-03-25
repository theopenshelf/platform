package dev.theopenshelf.platform.specifications;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.jpa.domain.Specification;

import dev.theopenshelf.platform.entities.BorrowRecordEntity;
import dev.theopenshelf.platform.model.BorrowStatus;
import jakarta.persistence.criteria.Predicate;

public class BorrowRecordSpecifications {
    public static Specification<BorrowRecordEntity> withFilters(
            String borrowedBy,
            String itemId,
            List<String> libraryIds,
            List<String> categories,
            List<BorrowStatus> status,
            String searchText,
            Boolean favorite) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (borrowedBy != null) {
                predicates.add(cb.equal(root.get("borrowedBy"), borrowedBy));
            }

            if (itemId != null) {
                predicates.add(cb.equal(root.get("item").get("id"), UUID.fromString(itemId)));
            }

            if (libraryIds != null && !libraryIds.isEmpty()) {
                List<UUID> libraryUuids = libraryIds.stream()
                        .map(UUID::fromString)
                        .collect(Collectors.toList());
                predicates.add(root.get("item").get("libraryId").in(libraryUuids));
            }

            if (categories != null && !categories.isEmpty()) {
                predicates.add(root.get("item").get("category").get("name").in(categories));
            }

            if (status != null && !status.isEmpty()) {
                predicates.add(root.get("status").in(status));
            }

            if (searchText != null && !searchText.isBlank()) {
                String pattern = "%" + searchText.toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("item").get("name")), pattern));
            }

            if (favorite != null && favorite) {
                predicates.add(cb.equal(root.get("item").get("favorite"), true));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}