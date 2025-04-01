import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommunitiesHubApiService, Community, CommunityMember, CommunityWithMembership, CustomPage, CustomPagesHubApiService, PaginatedCommunityMembersResponse } from '../../../../api-client';
import { GetCommunitiesParams } from '../../../../models/GetCommunitiesParams';
import { GetFilteredAndPaginatedParams } from '../../../../models/GetFilteredAndPaginatedParams';
import { UICommunitiesPagination } from '../../../../models/UICommunitiesPagination';
import { UICommunity, UICommunityWithMembership, UIMember, UIMembersPagination } from '../../../../models/UICommunity';
import { UICustomPage } from '../../../../models/UICustomPage';
import { CommunitiesService } from '../communities.service';
import { APIUsersService } from './users.service';

@Injectable({
    providedIn: 'root',
})
export class ApiCommunitiesService implements CommunitiesService {

    constructor(private communitiesApiService: CommunitiesHubApiService,
        private customPagesApiService: CustomPagesHubApiService,
        private usersService: APIUsersService) { }

    getCommunities(getCommunitiesParams: GetCommunitiesParams): Observable<UICommunitiesPagination> {
        return this.communitiesApiService.getCommunities(getCommunitiesParams.searchText, getCommunitiesParams.location, getCommunitiesParams.distance,
            getCommunitiesParams.requiresApproval, getCommunitiesParams.isMember).pipe(
                map((response) => ({
                    totalPages: response.totalPages,
                    totalItems: response.totalItems,
                    currentPage: response.currentPage,
                    itemsPerPage: response.itemsPerPage,
                    items: response.communities.map((communityWithMembership) => this.mapToUICommunityWithMembership(communityWithMembership))
                }))
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
            map((members: PaginatedCommunityMembersResponse) => this.mapToUIMembersPagination(members))
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

    getCustomPages(communityId: string): Observable<UICustomPage[]> {
        return this.customPagesApiService.getCommunityCustomPages(communityId).pipe(
            map((customPages: CustomPage[]) => customPages.map((customPage) => this.mapToUICustomPage(customPage)))
        );
    }

    addCustomPage(communityId: string, customPage: UICustomPage): Observable<UICustomPage> {
        return this.customPagesApiService.createCommunityCustomPage(communityId, this.mapToApiCustomPage(customPage)).pipe(
            map((customPage: CustomPage) => this.mapToUICustomPage(customPage))
        );
    }

    updateCustomPage(communityId: string, customPageId: string, customPage: UICustomPage): Observable<UICustomPage> {
        return this.customPagesApiService.updateCommunityCustomPage(communityId, customPageId, this.mapToApiCustomPage(customPage)).pipe(
            map((customPage: CustomPage) => this.mapToUICustomPage(customPage))
        );
    }

    deleteCustomPage(communityId: string, customPageId: string): Observable<void> {
        return this.customPagesApiService.deleteCommunityCustomPage(communityId, customPageId);
    }

    mapToUICustomPage(customPage: CustomPage): UICustomPage {
        return {
            id: customPage.id,
            title: customPage.title,
            content: customPage.content,
            ref: customPage.ref,
            position: customPage.position,
            communityId: customPage.communityId ?? '',
            order: customPage.order ?? 0,
        };
    }

    mapToApiCustomPage(customPage: UICustomPage): CustomPage {
        return {
            id: customPage.id,
            title: customPage.title,
            content: customPage.content,
            ref: customPage.ref,
            position: customPage.position,
            communityId: customPage.communityId,
            order: customPage.order ?? 0,
        };
    }
    private mapToUICommunity(community: Community): UICommunity {
        return {
            id: community.id,
            name: community.name,
            location: {
                name: community.location?.name ?? '',
                address: community.location?.address ?? '',
                coordinates: {
                    lat: community.location?.coordinates?.lat ?? 0,
                    lng: community.location?.coordinates?.lng ?? 0,
                },
            },
            picture: community.picture,
            description: community.description,
            requiresApproval: community.requiresApproval ?? false,
        };
    }

    private mapRole(role: string | undefined): 'admin' | 'member' | 'requestingJoin' {
        switch (role) {
            case 'ADMIN': return 'admin';
            case 'MEMBER': return 'member';
            case 'REQUESTING_JOIN': return 'requestingJoin';
            default: return 'member';
        }
    }

    private mapToUICommunityWithMembership(communityWithMembership: CommunityWithMembership): UICommunityWithMembership {
        return {
            ...this.mapToUICommunity(communityWithMembership.community),
            membership: {
                isMember: communityWithMembership.membership?.isMember ?? false,
                role: this.mapRole(communityWithMembership.membership?.role),
            },
        };
    }

    private mapToApiCommunity(community: UICommunity): Community {
        return {
            id: community.id,
            name: community.name,
            location: {
                name: community.location?.name ?? '',
                address: community.location?.address ?? '',
                coordinates: {
                    lat: community.location?.coordinates?.lat ?? 0,
                    lng: community.location?.coordinates?.lng ?? 0,
                },
            },
            requiresApproval: community.requiresApproval ?? false,
            description: community.description,
            picture: community.picture,
        };
    }

    private mapToUIMembersPagination(members: PaginatedCommunityMembersResponse): UIMembersPagination {
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
            role: this.mapRole(member.role),
        };
    }

    private mapToApiMember(member: UIMember): CommunityMember {
        return {
            ...this.usersService.mapToApiUser(member),
            role: member.role === 'admin' ? 'ADMIN' :
                member.role === 'member' ? 'MEMBER' :
                    member.role === 'requestingJoin' ? 'REQUESTING_JOIN' : 'MEMBER'
        };
    }
}
