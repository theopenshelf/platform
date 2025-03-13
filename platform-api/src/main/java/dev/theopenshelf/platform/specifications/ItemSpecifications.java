package dev.theopenshelf.platform.specifications;

import java.util.ArrayList;
import java.util.List;

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
                predicates.add(root.get("libraryId").in(libraryIds));
            }

            if (communityIds != null && !communityIds.isEmpty()) {
                predicates.add(root.get("communityId").in(communityIds));
            }

            if (categories != null && !categories.isEmpty()) {
                predicates.add(root.get("category").get("name").in(categories));
            }

            if (searchText != null && !searchText.isBlank()) {
                String pattern = "%" + searchText.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), pattern),
                        cb.like(cb.lower(root.get("description")), pattern)));
            }

            if (favorite != null) {
                predicates.add(cb.equal(root.get("favorite"), favorite));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}