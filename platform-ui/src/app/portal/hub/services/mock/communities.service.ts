import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { loadCommunitiesData } from '../../../../mock/communities-loader';
import communitiesData from '../../../../mock/communities.json';
import { GetFilteredAndPaginatedParams } from '../../../../models/GetFilteredAndPaginatedParams';
import { UICommunity, UIMember, UIMembersPagination } from '../../../../models/UICommunity';
import { CommunitiesService } from '../communities.service';
import { MockUsersService } from './users.service';

@Injectable({
  providedIn: 'root',
})
export class MockCommunitiesService implements CommunitiesService {
  public communities: UICommunity[] = [];
  private membersMap: Map<string, UIMember[]> = new Map();

  constructor(private usersService: MockUsersService) {
    this.communities = loadCommunitiesData();
    communitiesData.forEach((community) => {
      const members = community.members.map((member) => {
        const user = this.usersService.getMockUser(member.userId);
        return {
          ...user,
          isAdmin: member.isAdmin,
        };
      });
      this.membersMap.set(community.id, members);
    });
  }

  getCommunities(): Observable<UICommunity[]> {
    return of(this.communities);
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
}