import { Observable } from 'rxjs';
import { GetFilteredAndPaginatedParams } from '../../../models/GetFilteredAndPaginatedParams';
import { UICommunity, UIMember, UIMembersPagination } from '../../../models/UICommunity';

export interface CommunitiesService {
  getCommunities(): Observable<UICommunity[]>;
  getCommunity(id: string): Observable<UICommunity>;

  addCommunity(community: UICommunity): Observable<UICommunity>;

  // Update an existing community
  updateCommunity(id: string, community: UICommunity): Observable<UICommunity>;

  // Delete a community
  deleteCommunity(id: string): Observable<void>;

  getMembers(communityId: string, getFilteredAndPaginatedParams: GetFilteredAndPaginatedParams): Observable<UIMembersPagination>;

  addMember(communityId: string, member: UIMember): Observable<UIMember>;

  deleteMember(communityId: string, memberId: string): Observable<void>;

  updateMember(communityId: string, memberId: string, member: UIMember): Observable<UIMember>;
}
