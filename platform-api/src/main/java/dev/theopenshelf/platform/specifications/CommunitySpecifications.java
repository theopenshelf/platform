package dev.theopenshelf.platform.specifications;

import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import dev.theopenshelf.platform.entities.CommunityEntity;
import dev.theopenshelf.platform.entities.CommunityMemberEntity;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;

/**
 * Specifications for filtering Communities using Spring Data JPA Criteria API.
 * Specifications allow building type-safe, reusable database queries.
 * 
 * Each method returns a Specification that represents a part of the WHERE
 * clause.
 * These can be combined using .and(), .or(), .not() operations.
 */
@Component
public class CommunitySpecifications {
    /**
     * Creates a specification to search by name or description.
     * Example: WHERE LOWER(name) LIKE '%searchtext%' OR LOWER(description) LIKE
     * '%searchtext%'
     *
     * @param searchText text to search for (case-insensitive)
     * @return specification for text search, or empty condition if searchText is
     *         null
     */
    public static Specification<CommunityEntity> withSearchText(String searchText) {
        return (root, query, cb) -> {
            if (searchText == null) {
                return cb.conjunction(); // Returns TRUE if no search text (no filtering)
            }
            String pattern = "%" + searchText.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("name")), pattern),
                    cb.like(cb.lower(root.get("description")), pattern));
        };
    }

    /**
     * Creates a specification to filter by approval requirement.
     * Example: WHERE requires_approval = true
     *
     * @param requiresApproval whether to filter for communities requiring approval
     * @return specification for approval filter, or empty condition if
     *         requiresApproval is null
     */
    public static Specification<CommunityEntity> withApprovalRequired(Boolean requiresApproval) {
        return (root, query, cb) -> {
            if (requiresApproval == null) {
                return cb.conjunction(); // Returns TRUE if no filter specified
            }
            return cb.equal(root.get("requiresApproval"), requiresApproval);
        };
    }

    /**
     * Creates a specification to filter by user membership using a subquery.
     * Example: WHERE EXISTS (SELECT 1 FROM community_members WHERE community_id =
     * community.id AND user_id = :userId)
     *
     * @param isMember whether to find communities where user is/isn't a member
     * @param userId   the user's ID to check membership
     * @return specification for membership filter, or empty condition if either
     *         parameter is null
     */
    public static Specification<CommunityEntity> withMembership(Boolean isMember, UUID userId) {
        return (root, query, cb) -> {
            if (isMember == null || userId == null) {
                return cb.conjunction(); // Returns TRUE if no filter specified
            }
            // Create subquery to check membership
            Subquery<CommunityMemberEntity> memberSubquery = query.subquery(CommunityMemberEntity.class);
            Root<CommunityMemberEntity> memberRoot = memberSubquery.from(CommunityMemberEntity.class);
            memberSubquery.select(memberRoot)
                    .where(
                            cb.and(
                                    cb.equal(memberRoot.get("community"), root),
                                    cb.equal(memberRoot.get("user").get("id"), userId)));
            // If isMember is true, use EXISTS, otherwise use NOT EXISTS
            return isMember ? cb.exists(memberSubquery) : cb.not(cb.exists(memberSubquery));
        };
    }
}