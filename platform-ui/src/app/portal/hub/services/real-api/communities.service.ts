import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommunitiesHubApiService, Community, CommunityMember, PaginatedMembersResponse } from '../../../../api-client';
import { GetFilteredAndPaginatedParams } from '../../../../models/GetFilteredAndPaginatedParams';
import { UICommunity, UIMember, UIMembersPagination } from '../../../../models/UICommunity';
import { CommunitiesService } from '../communities.service';
import { APIUsersService } from './users.service';

@Injectable({
    providedIn: 'root',
})
export class ApiCommunitiesService implements CommunitiesService {

    constructor(private communitiesApiService: CommunitiesHubApiService, private usersService: APIUsersService) { }

    getCommunities(): Observable<UICommunity[]> {
        return this.communitiesApiService.getCommunities().pipe(
            map((communities: Community[]) =>
                communities.map((community) => this.mapToUICommunity(community))
            )
        );
    }

    getCommunity(id: string): Observable<UICommunity> {
        return this.communitiesApiService.getCommunity(id).pipe(
            map((community: Community) => this.mapToUICommunity(community))
        );
    }

    addCommunity(community: UICommunity): Observable<UICommunity> {
        const apiCommunity = this.mapToApiCommunity(community);
        return this.communitiesApiService.createCommunity(apiCommunity).pipe(
            map((community: Community) => this.mapToUICommunity(community))
        );
    }

    updateCommunity(id: string, community: UICommunity): Observable<UICommunity> {
        const apiCommunity = this.mapToApiCommunity(community);
        return this.communitiesApiService.updateCommunity(id, apiCommunity).pipe(
            map((community: Community) => this.mapToUICommunity(community))
        );
    }

    deleteCommunity(id: string): Observable<void> {
        return this.communitiesApiService.deleteCommunity(id);
    }

    getMembers(communityId: string, getFilteredAndPaginatedParams: GetFilteredAndPaginatedParams): Observable<UIMembersPagination> {
        return this.communitiesApiService.getCommunityMembers(communityId, getFilteredAndPaginatedParams.page, getFilteredAndPaginatedParams.pageSize).pipe(
            map((members: PaginatedMembersResponse) => this.mapToUIMembersPagination(members))
        );
    }

    addMember(communityId: string, member: UIMember): Observable<UIMember> {
        return this.communitiesApiService.addCommunityMember(communityId, this.mapToApiMember(member)).pipe(
            map((member: CommunityMember) => this.mapToUIMember(member))
        );
    }

    deleteMember(communityId: string, memberId: string): Observable<void> {
        return this.communitiesApiService.deleteCommunityMember(communityId, memberId);
    }

    updateMember(communityId: string, memberId: string, member: UIMember): Observable<UIMember> {
        return this.communitiesApiService.updateCommunityMember(communityId, memberId, this.mapToApiMember(member)).pipe(
            map((member: CommunityMember) => this.mapToUIMember(member))
        );
    }


    private mapToUICommunity(community: Community): UICommunity {
        return {
            id: community.id,
            name: community.name,
            location: {
                name: community.location?.name ?? '',
                address: community.location?.address ?? '',
            },
            picture: community.picture,
            description: community.description,
            requiresApproval: community.requiresApproval ?? false,
        };
    }

    private mapToApiCommunity(community: UICommunity): Community {
        return {
            id: community.id,
            name: community.name,
            location: {
                name: community.location?.name ?? '',
                address: community.location?.address ?? '',
            },
            requiresApproval: community.requiresApproval ?? false,
            description: community.description,
            picture: community.picture,
        };
    }

    private mapToUIMembersPagination(members: PaginatedMembersResponse): UIMembersPagination {
        return {
            items: members.items?.map((member) => this.mapToUIMember(member)) ?? [],
            totalItems: members.totalItems,
            totalPages: members.totalPages,
            currentPage: members.currentPage,
            itemsPerPage: members.itemsPerPage ?? 0,
        };
    }

    private mapToUIMember(member: CommunityMember): UIMember {
        return {
            ...this.usersService.mapToUIUser(member),
            isAdmin: member.isAdmin ?? false,
        };
    }

    private mapToApiMember(member: UIMember): CommunityMember {
        return {
            ...this.usersService.mapToApiUser(member),
            isAdmin: member.isAdmin ?? false,
        };
    }
}
