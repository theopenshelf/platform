import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { loadCommunitiesData } from '../../../../mock/communities-loader';
import communitiesData from '../../../../mock/communities.json';
import { loadCustomPagesData } from '../../../../mock/custom-page-loader';
import { GetCommunitiesParams } from '../../../../models/GetCommunitiesParams';
import { GetFilteredAndPaginatedParams } from '../../../../models/GetFilteredAndPaginatedParams';
import { UICommunitiesPagination } from '../../../../models/UICommunitiesPagination';
import { UICommunity, UIMember, UIMembersPagination } from '../../../../models/UICommunity';
import { UICustomPage } from '../../../../models/UICustomPage';
import { CommunitiesService } from '../communities.service';
import { MockUsersService } from './users.service';

@Injectable({
  providedIn: 'root',
})
export class MockCommunitiesService implements CommunitiesService {
  public communities: UICommunity[] = [];
  private membersMap: Map<string, UIMember[]> = new Map();
  customPages: UICustomPage[];

  constructor(private usersService: MockUsersService) {
    this.communities = loadCommunitiesData();
    this.customPages = loadCustomPagesData();
    communitiesData.forEach((community) => {
      const members = community.members.map((member) => {
        const user = this.usersService.getMockUser(member.userId);
        return {
          ...user,
          role: member.role as 'admin' | 'member' | 'requestingJoin',
        };
      });
      this.membersMap.set(community.id, members);
    });
  }

  getCommunities(getCommunitiesParams: GetCommunitiesParams): Observable<UICommunitiesPagination> {
    let filteredCommunities = this.communities;
    if (getCommunitiesParams.searchText) {
      filteredCommunities = filteredCommunities.filter((community) => community.name.toLowerCase().includes(getCommunitiesParams.searchText!.toLowerCase()));
    }
    if (getCommunitiesParams.requiresApproval) {
      filteredCommunities = this.communities.filter((community) => community.requiresApproval === getCommunitiesParams.requiresApproval);
    }

    return of({
      totalPages: 1,
      totalItems: filteredCommunities.length,
      currentPage: getCommunitiesParams.page ?? 0,
      itemsPerPage: getCommunitiesParams.pageSize ?? 10,
      items: filteredCommunities
    });
  }

  getCommunity(id: string): Observable<UICommunity> {
    const community = this.communities.find((community) => community.id === id);
    if (!community) {
      throw new Error(`Community with id ${id} not found`);
    }
    return of(community);
  }

  addCommunity(community: UICommunity): Observable<UICommunity> {
    community.id = (this.communities.length + 1).toString();
    this.communities.push(community);
    this.membersMap.set(community.id, []);
    return of(community);
  }

  // Update an existing community
  updateCommunity(id: string, updatedCommunity: UICommunity): Observable<UICommunity> {
    const index = this.communities.findIndex((community) => community.id === id);
    if (index === -1) {
      throw new Error(`Community with id ${id} not found`);
    }
    updatedCommunity.id = id;
    this.communities[index] = updatedCommunity;
    return of(updatedCommunity);
  }

  // Delete a community
  deleteCommunity(id: string): Observable<void> {
    this.communities = this.communities.filter((community) => community.id !== id);
    this.membersMap.delete(id);
    return of(undefined);
  }

  getMembers(communityId: string, getFilteredAndPaginatedParams: GetFilteredAndPaginatedParams): Observable<UIMembersPagination> {
    const {
      searchText,
      page = 0,
      pageSize = 10,
    } = getFilteredAndPaginatedParams;

    let members = this.membersMap.get(communityId);
    if (!members) {
      throw new Error(`Community with id ${communityId} not found`);
    }

    if (searchText) {
      members = members.filter((member) => member.username.toLowerCase().includes(searchText.toLowerCase()));
    }

    // Pagination logic
    const totalItems = members.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = page * pageSize;
    members = members.slice(
      startIndex,
      startIndex + pageSize
    );
    return of({
      items: members,
      totalItems: totalItems,
      totalPages: totalPages,
      currentPage: page,
      itemsPerPage: pageSize,
    });
  }

  addMember(communityId: string, member: UIMember): Observable<UIMember> {
    const members = this.membersMap.get(communityId);
    if (!members) {
      throw new Error(`Community with id ${communityId} not found`);
    }
    members.push(member);
    return of(member);
  }

  deleteMember(communityId: string, memberId: string): Observable<void> {
    const members = this.membersMap.get(communityId);
    if (!members) {
      throw new Error(`Community with id ${communityId} not found`);
    }
    this.membersMap.set(communityId, members.filter((member) => member.id !== memberId));
    return of(undefined);
  }

  updateMember(communityId: string, memberId: string, member: UIMember): Observable<UIMember> {
    const members = this.membersMap.get(communityId);
    if (!members) {
      throw new Error(`Community with id ${communityId} not found`);
    }
    const index = members.findIndex((m) => m.id === memberId);
    if (index === -1) {
      throw new Error(`Member with id ${memberId} not found in community ${communityId}`);
    }
    members[index] = member;
    return of(member);
  }

  getCustomPages(communityId: string): Observable<UICustomPage[]> {
    return of(this.customPages.filter((page) => page.communityId === communityId));
  }

  addCustomPage(communityId: string, customPage: UICustomPage): Observable<UICustomPage> {
    this.customPages.push(customPage);
    return of(customPage);
  }

  updateCustomPage(communityId: string, customPageId: string, customPage: UICustomPage): Observable<UICustomPage> {
    const index = this.customPages.findIndex((page) => page.id === customPageId);
    if (index === -1) {
      throw new Error(`Custom page with id ${customPageId} not found`);
    }
    this.customPages[index] = customPage;
    return of(customPage);
  }

  deleteCustomPage(communityId: string, customPageId: string): Observable<void> {
    this.customPages = this.customPages.filter((page) => page.id !== customPageId);
    return of(undefined);
  }
}