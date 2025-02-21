import { Observable } from 'rxjs';
import { GetCommunitiesParams } from '../../../models/GetCommunitiesParams';
import { GetFilteredAndPaginatedParams } from '../../../models/GetFilteredAndPaginatedParams';
import { UICommunitiesPagination } from '../../../models/UICommunitiesPagination';
import { UICommunity, UIMember, UIMembersPagination } from '../../../models/UICommunity';
import { UICustomPage } from '../../../models/UICustomPage';
export interface CommunitiesService {
  getCommunities(getCommunitiesParams: GetCommunitiesParams): Observable<UICommunitiesPagination>;
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

  getCustomPages(communityId: string): Observable<UICustomPage[]>;

  addCustomPage(communityId: string, customPage: UICustomPage): Observable<UICustomPage>;

  updateCustomPage(communityId: string, customPageId: string, customPage: UICustomPage): Observable<UICustomPage>;

  deleteCustomPage(communityId: string, customPageId: string): Observable<void>;
}

