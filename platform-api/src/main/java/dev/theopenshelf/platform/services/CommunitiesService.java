package dev.theopenshelf.platform.services;

import static dev.theopenshelf.platform.specifications.CommunitySpecifications.withApprovalRequired;
import static dev.theopenshelf.platform.specifications.CommunitySpecifications.withMembership;
import static dev.theopenshelf.platform.specifications.CommunitySpecifications.withSearchText;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.theopenshelf.platform.entities.CommunityEntity;
import dev.theopenshelf.platform.entities.CommunityMemberEntity;
import dev.theopenshelf.platform.entities.MemberRoleEntity;
import dev.theopenshelf.platform.entities.UserEntity;
import dev.theopenshelf.platform.exceptions.CodedError;
import dev.theopenshelf.platform.exceptions.CodedException;
import dev.theopenshelf.platform.model.Community;
import dev.theopenshelf.platform.model.CommunityMember;
import dev.theopenshelf.platform.model.GetCommunities200Response;
import dev.theopenshelf.platform.model.Location;
import dev.theopenshelf.platform.model.MemberRole;
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
                CommunityEntity entity = new CommunityEntity(community);
                communityRepository.save(entity);
                addCommunityMember(entity.getId(), CommunityMember.builder()
                                .id(adminUser)
                                .role(MemberRole.ADMIN)
                                .build(), adminUser);
                return Mono.just(entity.toCommunity().build());
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

                Specification<CommunityEntity> spec = Specification
                                .where(withSearchText(searchText))
                                .and(withApprovalRequired(requiresApproval))
                                .and(withMembership(isMember, currentUserId));

                Page<CommunityEntity> communitiesPage = communityRepository.findAll(spec,
                                PageRequest.of(page - 1, pageSize));

                List<CommunityEntity> filteredCommunities = communitiesPage.getContent();

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
                                .map(entity -> entity.toCommunityWithMembership(currentUserId))
                                .toList());
                response.setCurrentPage(page);
                response.setItemsPerPage(pageSize);
                response.setTotalItems(filteredCommunities.size());
                response.setTotalPages((int) Math.ceil(filteredCommunities.size() / (double) pageSize));
                return Mono.just(response);
        }

        public Mono<Community> getCommunity(UUID communityId) {
                return Mono.just(communityRepository.findById(communityId)
                                .map(entity -> entity.toCommunity().build())
                                .orElseThrow(() -> new CodedException(CodedError.COMMUNITY_NOT_FOUND.getCode(),
                                                CodedError.COMMUNITY_NOT_FOUND.getDefaultMessage(),
                                                Map.of("communityId", communityId),
                                                CodedError.COMMUNITY_NOT_FOUND.getDocumentationUrl())));
        }

        public Mono<Void> deleteCommunity(UUID communityId, UUID currentUserId) {
                if (isNotCommunityAdmin(communityId, currentUserId)) {
                        throw new CodedException(CodedError.INSUFFICIENT_PERMISSIONS.getCode(),
                                        "Only community admins can delete the community",
                                        Map.of("userId", currentUserId, "communityId", communityId),
                                        CodedError.INSUFFICIENT_PERMISSIONS.getDocumentationUrl());
                }
                communityRepository.deleteById(communityId);
                return Mono.empty();
        }

        public Mono<Community> updateCommunity(UUID communityId, Community community, UUID currentUserId) {
                if (isNotCommunityAdmin(communityId, currentUserId)) {
                        throw new CodedException(CodedError.INSUFFICIENT_PERMISSIONS.getCode(),
                                        "Only community admins can update the community",
                                        Map.of("userId", currentUserId, "communityId", communityId),
                                        CodedError.INSUFFICIENT_PERMISSIONS.getDocumentationUrl());
                }
                community.setId(communityId);
                CommunityEntity entity = new CommunityEntity(community);
                communityRepository.save(entity);
                return Mono.just(entity.toCommunity().build());
        }

        public Mono<CommunityMember> addCommunityMember(UUID communityId, CommunityMember member, UUID currentUserId) {
                CommunityEntity community = communityRepository.findByIdWithMembers(communityId)
                                .orElseThrow(() -> new CodedException(CodedError.COMMUNITY_NOT_FOUND.getCode(),
                                                CodedError.COMMUNITY_NOT_FOUND.getDefaultMessage(),
                                                Map.of("communityId", communityId),
                                                CodedError.COMMUNITY_NOT_FOUND.getDocumentationUrl()));

                boolean isUserJoiningItselfTheCommunity = member.getId().equals(currentUserId);
                if (!isUserJoiningItselfTheCommunity && isNotCommunityAdmin(community, currentUserId)) {
                        throw new CodedException(CodedError.INSUFFICIENT_PERMISSIONS.getCode(),
                                        "Only community admins can add members",
                                        Map.of("userId", currentUserId, "communityId", communityId),
                                        CodedError.INSUFFICIENT_PERMISSIONS.getDocumentationUrl());
                }

                MemberRoleEntity role = MemberRoleEntity.MEMBER;
                if (isUserJoiningItselfTheCommunity && community.isRequiresApproval()) {
                        role = MemberRoleEntity.REQUESTING_JOIN;
                }

                UserEntity user = userRepository.findById(member.getId())
                                .orElseThrow(() -> new CodedException(CodedError.USER_NOT_FOUND.getCode(),
                                                CodedError.USER_NOT_FOUND.getDefaultMessage(),
                                                Map.of("userId", member.getId()),
                                                CodedError.USER_NOT_FOUND.getDocumentationUrl()));

                CommunityMemberEntity memberEntity = CommunityMemberEntity.builder()
                                .community(community)
                                .user(user)
                                .role(role)
                                .build();

                community.getMembers().add(memberEntity);
                communityRepository.save(community);

                return Mono.just(memberEntity.toCommunityMember().build());
        }

        @Transactional
        public Mono<Void> deleteCommunityMember(UUID communityId, UUID userId, UUID currentUserId) {
                CommunityEntity community = communityRepository.findByIdWithMembers(communityId)
                                .orElseThrow(() -> new CodedException(CodedError.COMMUNITY_NOT_FOUND.getCode(),
                                                CodedError.COMMUNITY_NOT_FOUND.getDefaultMessage(),
                                                Map.of("communityId", communityId),
                                                CodedError.COMMUNITY_NOT_FOUND.getDocumentationUrl()));

                if (isNotCommunityAdmin(community, currentUserId)) {
                        throw new CodedException(CodedError.INSUFFICIENT_PERMISSIONS.getCode(),
                                        "Only community admins can delete members",
                                        Map.of("userId", currentUserId, "communityId", communityId),
                                        CodedError.INSUFFICIENT_PERMISSIONS.getDocumentationUrl());
                }

                communityRepository.deleteCommunityMember(communityId, userId);
                return Mono.empty();
        }

        public Mono<PaginatedCommunityMembersResponse> getCommunityMembers(UUID communityId, Integer page,
                        Integer pageSize, UUID currentUserId) {
                CommunityEntity community = communityRepository.findByIdWithMembers(communityId)
                                .orElseThrow(() -> new CodedException(CodedError.COMMUNITY_NOT_FOUND.getCode(),
                                                CodedError.COMMUNITY_NOT_FOUND.getDefaultMessage(),
                                                Map.of("communityId", communityId),
                                                CodedError.COMMUNITY_NOT_FOUND.getDocumentationUrl()));

                if (isNotCommunityAdmin(community, currentUserId)) {
                        throw new CodedException(CodedError.INSUFFICIENT_PERMISSIONS.getCode(),
                                        "Only community admins can view members",
                                        Map.of("userId", currentUserId, "communityId", communityId),
                                        CodedError.INSUFFICIENT_PERMISSIONS.getDocumentationUrl());
                }

                int validPage = Math.max(1, page != null ? page : 1);
                int validPageSize = Math.max(1, pageSize != null ? pageSize : 10);
                int start = (validPage - 1) * validPageSize;
                int end = Math.min(start + validPageSize, community.getMembers().size());

                List<CommunityMember> members = community.getMembers().subList(start, end).stream()
                                .map(member -> member.toCommunityMember().build())
                                .collect(Collectors.toList());

                return Mono.just(PaginatedCommunityMembersResponse.builder()
                                .items(members)
                                .currentPage(validPage)
                                .itemsPerPage(validPageSize)
                                .totalItems(community.getMembers().size())
                                .totalPages((int) Math.ceil((double) community.getMembers().size() / validPageSize))
                                .build());
        }

        public Mono<CommunityMember> updateCommunityMember(UUID communityId, UUID userId, CommunityMember updatedMember,
                        UUID currentUserId) {
                CommunityEntity community = communityRepository.findByIdWithMembers(communityId)
                                .orElseThrow(() -> new CodedException(CodedError.COMMUNITY_NOT_FOUND.getCode(),
                                                CodedError.COMMUNITY_NOT_FOUND.getDefaultMessage(),
                                                Map.of("communityId", communityId),
                                                CodedError.COMMUNITY_NOT_FOUND.getDocumentationUrl()));

                if (isNotCommunityAdmin(community, currentUserId)) {
                        throw new CodedException(CodedError.INSUFFICIENT_PERMISSIONS.getCode(),
                                        "Only community admins can update members",
                                        Map.of("userId", currentUserId, "communityId", communityId),
                                        CodedError.INSUFFICIENT_PERMISSIONS.getDocumentationUrl());
                }

                CommunityMemberEntity memberEntity = community.getMembers().stream()
                                .filter(member -> member.getUser().getId().equals(userId))
                                .findFirst()
                                .orElseThrow(() -> new CodedException(CodedError.MEMBER_NOT_FOUND.getCode(),
                                                CodedError.MEMBER_NOT_FOUND.getDefaultMessage(),
                                                Map.of("userId", userId, "communityId", communityId),
                                                CodedError.MEMBER_NOT_FOUND.getDocumentationUrl()));

                memberEntity.setRole(MemberRoleEntity.valueOf(updatedMember.getRole().name()));
                communityRepository.save(community);

                return Mono.just(memberEntity.toCommunityMember().build());
        }

        public Optional<CommunityMemberEntity> isMember(UUID communityId, UUID currentUserId) {
                CommunityEntity community = communityRepository.findByIdWithMembers(communityId)
                                .orElseThrow(() -> new CodedException(CodedError.COMMUNITY_NOT_FOUND.getCode(),
                                                CodedError.COMMUNITY_NOT_FOUND.getDefaultMessage(),
                                                Map.of("communityId", communityId),
                                                CodedError.COMMUNITY_NOT_FOUND.getDocumentationUrl()));
                return community.getMembers().stream()
                                .filter(m -> m.getUser().getId().equals(currentUserId))
                                .findFirst();
        }

        private boolean isNotCommunityAdmin(UUID communityId, UUID currentUserId) {
                CommunityEntity community = communityRepository.findByIdWithMembers(communityId)
                                .orElseThrow(() -> new CodedException(CodedError.COMMUNITY_NOT_FOUND.getCode(),
                                                CodedError.COMMUNITY_NOT_FOUND.getDefaultMessage(),
                                                Map.of("communityId", communityId),
                                                CodedError.COMMUNITY_NOT_FOUND.getDocumentationUrl()));
                return isNotCommunityAdmin(community, currentUserId);
        }

        private boolean isNotCommunityAdmin(CommunityEntity community, UUID currentUserId) {
                return community.getMembers().stream()
                                .filter(m -> m.getUser().getId().equals(currentUserId))
                                .noneMatch(m -> m.getRole().equals(MemberRoleEntity.ADMIN));
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