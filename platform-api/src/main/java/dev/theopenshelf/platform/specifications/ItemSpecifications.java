package dev.theopenshelf.platform.specifications;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.jpa.domain.Specification;

import dev.theopenshelf.platform.entities.ItemEntity;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;

public class ItemSpecifications {

    public static Specification<ItemEntity> withFilters(
            String borrowedBy,
            List<String> libraryIds,
            List<String> communityIds,
            List<String> categories,
            String searchText,
            Boolean favorite) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (borrowedBy != null) {
                Join<Object, Object> borrowRecords = root.join("borrowRecords");
                predicates.add(cb.equal(borrowRecords.get("borrowedBy"), borrowedBy));
            }

            if (libraryIds != null && !libraryIds.isEmpty()) {
                List<UUID> libraryUuids = libraryIds.stream()
                        .map(UUID::fromString)
                        .collect(Collectors.toList());
                predicates.add(root.get("libraryId").in(libraryUuids));
            }

            if (communityIds != null && !communityIds.isEmpty()) {
                List<UUID> communityUuids = communityIds.stream()
                        .map(UUID::fromString)
                        .collect(Collectors.toList());
                predicates.add(root.get("communityId").in(communityUuids));
            }

            if (categories != null && !categories.isEmpty()) {
                predicates.add(root.get("category").get("name").in(categories));
            }

            if (searchText != null && !searchText.isBlank()) {
                String pattern = "%" + searchText.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), pattern),
                        cb.like(cb.lower(root.get("description")), pattern),
                        cb.like(cb.lower(root.get("shortDescription")), pattern) // Add shortDescription to search
                ));
            }

            if (favorite != null) {
                predicates.add(cb.equal(root.get("favorite"), favorite));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}