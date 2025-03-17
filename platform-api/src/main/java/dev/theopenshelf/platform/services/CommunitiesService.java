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
import org.springframework.transaction.annotation.Transactional;

import dev.theopenshelf.platform.entities.CommunityEntity;
import dev.theopenshelf.platform.entities.CommunityMemberEntity;
import dev.theopenshelf.platform.entities.MemberRole;
import dev.theopenshelf.platform.entities.UserEntity;
import dev.theopenshelf.platform.exceptions.ResourceNotFoundException;
import dev.theopenshelf.platform.model.Community;
import dev.theopenshelf.platform.model.CommunityMember;
import dev.theopenshelf.platform.model.GetCommunities200Response;
import dev.theopenshelf.platform.model.Location;
import dev.theopenshelf.platform.model.PaginatedCommunityMembersResponse;
import dev.theopenshelf.platform.repositories.CommunityRepository;
import dev.theopenshelf.platform.repositories.UsersRepository;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class CommunitiesService {
        private final CommunityRepository communityRepository;
        private final UsersRepository userRepository;

        public Mono<Community> createCommunity(Community community, UUID adminUser) {
                //TODO add adminUser as a community member with admin right
                return Mono.just(community)
                                .map(CommunityEntity::new)
                                .map(communityRepository::save)
                                .map(entity -> entity.toCommunity().build());
        }

        public GetCommunities200Response getCommunities(
                        String searchText,
                        Location location,
                        BigDecimal distance,
                        Boolean requiresApproval,
                        Boolean isMember,
                        UUID currentUserId,
                        Integer page,
                        Integer pageSize) {

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
                                                        community.getLocation().getCoordinates()
                                                                        .getLng()) <= maxDistance)
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
        }

        public Mono<Community> getCommunity(UUID communityId) {
                return Mono.justOrEmpty(communityRepository.findById(communityId))
                                .map(entity -> entity.toCommunity().build());
        }

        public Mono<Void> deleteCommunity(UUID communityId, UUID currentUserId) {
                //TODO only admin member can delete a community
                return Mono.fromRunnable(() -> communityRepository.deleteById(communityId));
        }

        public Mono<Community> updateCommunity(UUID communityId, Community community, UUID currentUserId) {
                //TODO only admin member can update a community
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

        @Transactional
        public Mono<CommunityMember> addCommunityMember(UUID communityId, CommunityMember member) {
                //TODO if current user is not an admin and community.requiresApproval, member.role = REQUESTING_JOIN
                CommunityEntity community = communityRepository.findById(communityId)
                                .orElseThrow(() -> new ResourceNotFoundException("Community not found"));

                UserEntity user = userRepository.findById(member.getId())
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                CommunityMemberEntity memberEntity = CommunityMemberEntity.builder()
                                .community(community)
                                .user(user)
                                .role(MemberRole.valueOf(member.getRole().name()))
                                .build();

                community.getMembers().add(memberEntity);
                communityRepository.save(community);

                return Mono.just(memberEntity.toCommunityMember().build());
        }

        @Transactional
        public Mono<Void> deleteCommunityMember(UUID communityId, UUID userId) {
                // Only an admin or the current user == member can delete a member
                CommunityEntity community = communityRepository.findById(communityId)
                                .orElseThrow(() -> new ResourceNotFoundException("Community not found"));

                community.getMembers().removeIf(member -> member.getUser().getId().equals(userId));
                communityRepository.save(community);

                return Mono.empty();
        }

        @Transactional(readOnly = true)
        public PaginatedCommunityMembersResponse getCommunityMembers(UUID communityId, Integer page, Integer pageSize) {
                //Only an admin of the community can list the members
                CommunityEntity community = communityRepository.findByIdWithMembers(communityId)
                                .orElseThrow(() -> new ResourceNotFoundException("Community not found"));

                int validPage = Math.max(1, page != null ? page : 1);
                int validPageSize = Math.max(1, pageSize != null ? pageSize : 10);
                int start = (validPage - 1) * validPageSize;
                int end = Math.min(start + validPageSize, community.getMembers().size());

                List<CommunityMember> members = community.getMembers().subList(start, end).stream()
                                .map(member -> member.toCommunityMember().build())
                                .collect(Collectors.toList());

                return PaginatedCommunityMembersResponse.builder()
                                .items(members)
                                .currentPage(validPage)
                                .itemsPerPage(validPageSize)
                                .totalItems(community.getMembers().size())
                                .totalPages((int) Math.ceil((double) community.getMembers().size() / validPageSize))
                                .build();
        }

        @Transactional
        public Mono<CommunityMember> updateCommunityMember(UUID communityId, UUID userId,
                        CommunityMember updatedMember) {
                //Only the admin of the community can update a member
                CommunityEntity community = communityRepository.findById(communityId)
                                .orElseThrow(() -> new ResourceNotFoundException("Community not found"));

                CommunityMemberEntity memberEntity = community.getMembers().stream()
                                .filter(member -> member.getUser().getId().equals(userId))
                                .findFirst()
                                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));

                memberEntity.setRole(MemberRole.valueOf(updatedMember.getRole().name()));
                communityRepository.save(community);

                return Mono.just(memberEntity.toCommunityMember().build());
        }
}