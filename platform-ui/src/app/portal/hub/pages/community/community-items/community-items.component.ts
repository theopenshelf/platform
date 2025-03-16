import { Component } from '@angular/core';
import { FilteredAndPaginatedItemsComponent } from '../../../../../components/filtered-and-paginated-items/filtered-and-paginated-items.component';
import { GetItemsParams } from '../../../../../models/GetItemsParams';
import { UICommunity } from '../../../../../models/UICommunity';
import { CommunityStateService } from '../community.service';

@Component({
  selector: 'app-community-items',
  imports: [
    FilteredAndPaginatedItemsComponent
  ],
  templateUrl: './community-items.component.html',
  styleUrl: './community-items.component.scss'
})
export class CommunityItemsComponent {
  community: UICommunity | null = null;
  public getItemsParams: GetItemsParams | undefined;

  constructor(
    private communityState: CommunityStateService
  ) {
    this.communityState.community$.subscribe(community => this.community = community);
  }

  ngOnInit() {
    this.getItemsParams = {
      communityIds: [this.community!.id],
      page: 1,
      pageSize: 10
    };
  }
}
