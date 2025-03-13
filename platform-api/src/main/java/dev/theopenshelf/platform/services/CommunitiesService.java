package dev.theopenshelf.platform.services;

import static dev.theopenshelf.platform.specifications.CommunitySpecifications.withApprovalRequired;
import static dev.theopenshelf.platform.specifications.CommunitySpecifications.withMembership;
import static dev.theopenshelf.platform.specifications.CommunitySpecifications.withSearchText;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import dev.theopenshelf.platform.entities.CommunityEntity;
import dev.theopenshelf.platform.model.Community;
import dev.theopenshelf.platform.model.GetCommunities200Response;
import dev.theopenshelf.platform.model.Location;
import dev.theopenshelf.platform.repositories.CommunityRepository;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class CommunitiesService {
    private final CommunityRepository communityRepository;

    public Mono<Community> createCommunity(Community community) {
        return Mono.just(community)
                .map(CommunityEntity::new)
                .map(communityRepository::save)
                .map(entity -> entity.toCommunity().build());
    }

    public Mono<GetCommunities200Response> getCommunities(
            String searchText,
            Location location,
            BigDecimal distance,
            Boolean requiresApproval,
            Boolean isMember,
            UUID currentUserId,
            Integer page,
            Integer pageSize) {

        return Mono.fromCallable(() -> {
            Specification<CommunityEntity> spec = Specification
                    .where(withSearchText(searchText))
                    .and(withApprovalRequired(requiresApproval))
                    .and(withMembership(isMember, currentUserId));

            Page<CommunityEntity> communitiesPage = communityRepository.findAll(spec,
                    PageRequest.of(page - 1, pageSize));

            List<CommunityEntity> filteredCommunities = communitiesPage.getContent();

            // Apply distance filter if location is provided
            if (location != null && location.getCoordinates() != null && distance != null) {
                double lat = location.getCoordinates().getLat().doubleValue();
                double lng = location.getCoordinates().getLng().doubleValue();
                double maxDistance = distance.doubleValue();

                filteredCommunities = filteredCommunities.stream()
                        .filter(community -> calculateDistance(
                                lat, lng,
                                community.getLocation().getCoordinates().getLat(),
                                community.getLocation().getCoordinates().getLng()) <= maxDistance)
                        .collect(Collectors.toList());
            }

            GetCommunities200Response response = new GetCommunities200Response();
            response.setCommunities(filteredCommunities.stream()
                    .map(entity -> entity.toCommunity().build())
                    .toList());
            response.setCurrentPage(page);
            response.setItemsPerPage(pageSize);
            response.setTotalItems(filteredCommunities.size());
            response.setTotalPages((int) Math.ceil(filteredCommunities.size() / (double) pageSize));

            return response;
        });
    }

    public Mono<Community> getCommunity(UUID communityId) {
        return Mono.justOrEmpty(communityRepository.findById(communityId))
                .map(entity -> entity.toCommunity().build());
    }

    public Mono<Void> deleteCommunity(UUID communityId) {
        return Mono.fromRunnable(() -> communityRepository.deleteById(communityId));
    }

    public Mono<Community> updateCommunity(UUID communityId, Community community) {
        return Mono.just(community)
                .map(c -> {
                    c.setId(communityId);
                    return new CommunityEntity(c);
                })
                .map(communityRepository::save)
                .map(entity -> entity.toCommunity().build());
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth's radius in kilometers

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                        * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }
}