import { Component } from '@angular/core';
import { FilteredAndPaginatedMembersComponent } from '../../../../../components/filtered-and-paginated-members/filtered-and-paginated-members.component';
import { UICommunity } from '../../../../../models/UICommunity';
import { CommunityStateService } from '../community.service';

@Component({
  selector: 'app-community-members',
  imports: [
    FilteredAndPaginatedMembersComponent
  ],
  templateUrl: './community-members.component.html',
  styleUrl: './community-members.component.scss'
})
export class CommunityMembersComponent {

  community: UICommunity | null = null;

  constructor(
    private communityState: CommunityStateService
  ) {
    this.communityState.community$.subscribe(community => this.community = community);
  }

}
