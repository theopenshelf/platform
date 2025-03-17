package dev.theopenshelf.platform.api.hub.community;

import java.math.BigDecimal;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ServerWebExchange;

import dev.theopenshelf.platform.api.CommunitiesHubApiApiDelegate;
import dev.theopenshelf.platform.model.Community;
import dev.theopenshelf.platform.model.CommunityMember;
import dev.theopenshelf.platform.model.GetCommunities200Response;
import dev.theopenshelf.platform.model.Location;
import dev.theopenshelf.platform.model.PaginatedCommunityMembersResponse;
import dev.theopenshelf.platform.services.CommunitiesService;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class CommunitiesHubApi implements CommunitiesHubApiApiDelegate {

        private final CommunitiesService communitiesService;

        @Override
        public Mono<ResponseEntity<Community>> createCommunity(Mono<Community> community, ServerWebExchange exchange) {
                return exchange.getPrincipal()
                        .map(principal -> UUID.fromString(principal.getName()))
                        .flatMap(currentUserId -> community
                                .flatMap(c -> communitiesService.createCommunity(c, currentUserId))
                                .map(ResponseEntity::ok)
                        );
        }

        @Override
        public Mono<ResponseEntity<GetCommunities200Response>> getCommunities(
                        String searchText,
                        Location location,
                        BigDecimal distance,
                        Boolean requiresApproval,
                        Boolean isMember,
                        Integer page,
                        Integer pageSize,
                        ServerWebExchange exchange) {

                return exchange.getPrincipal()
                                .map(principal -> UUID.fromString(principal.getName()))
                                .map(currentUserId -> communitiesService.getCommunities(
                                                searchText,
                                                location,
                                                distance,
                                                requiresApproval,
                                                isMember,
                                                currentUserId,
                                                page,
                                                pageSize))
                                .map(ResponseEntity::ok);
        }

        @Override
        public Mono<ResponseEntity<Community>> getCommunity(UUID communityId, ServerWebExchange exchange) {
                return communitiesService.getCommunity(communityId)
                                .map(ResponseEntity::ok)
                                .defaultIfEmpty(ResponseEntity.notFound().build());
        }

        @Override
        public Mono<ResponseEntity<Void>> deleteCommunity(UUID communityId, ServerWebExchange exchange) {
                return exchange.getPrincipal()
                        .map(principal -> UUID.fromString(principal.getName()))
                        .flatMap(currentUserId ->  communitiesService.deleteCommunity(communityId, currentUserId)
                                .then(Mono.just(ResponseEntity.noContent().build()))
                        );
        }

        @Override
        public Mono<ResponseEntity<Community>> updateCommunity(
                        UUID communityId,
                        Mono<Community> community,
                        ServerWebExchange exchange) {

                return exchange.getPrincipal()
                        .map(principal -> UUID.fromString(principal.getName()))
                        .flatMap(currentUserId -> community
                                .flatMap(c -> communitiesService.updateCommunity(communityId, c, currentUserId))
                                .map(ResponseEntity::ok));
        }

        @Override
        public Mono<ResponseEntity<CommunityMember>> addCommunityMember(UUID communityId,
                        Mono<CommunityMember> communityMember,
                        ServerWebExchange exchange) {
                return communityMember
                                .flatMap(member -> communitiesService.addCommunityMember(communityId, member))
                                .map(ResponseEntity::ok);
        }

        @Override
        public Mono<ResponseEntity<Void>> deleteCommunityMember(UUID communityId,
                        UUID userId,
                        ServerWebExchange exchange) {
                return communitiesService.deleteCommunityMember(communityId, userId)
                                .then(Mono.just(ResponseEntity.noContent().build()));
        }

        @Override
        public Mono<ResponseEntity<PaginatedCommunityMembersResponse>> getCommunityMembers(UUID communityId,
                        Integer page,
                        Integer pageSize,
                        ServerWebExchange exchange) {
                return Mono.just(communitiesService.getCommunityMembers(communityId, page, pageSize))
                                .map(ResponseEntity::ok);
        }

        @Override
        public Mono<ResponseEntity<CommunityMember>> updateCommunityMember(UUID communityId,
                        UUID userId,
                        Mono<CommunityMember> communityMember,
                        ServerWebExchange exchange) {
                return communityMember
                                .flatMap(member -> communitiesService.updateCommunityMember(communityId, userId,
                                                member))
                                .map(ResponseEntity::ok);
        }

        //TODO implement the /pages apis
}