import { CommonModule } from '@angular/common';
import { Component, Inject, input } from '@angular/core';
import { Observable } from 'rxjs';
import { GetItemsParams } from '../../models/GetItemsParams';
import { UICommunity } from '../../models/UICommunity';
import { UIMember } from '../../models/UILibrary';
import { UIPagination } from '../../models/UIPagination';
import { COMMUNITIES_SERVICE_TOKEN } from '../../portal/hub/hub.provider';
import { CommunitiesService } from '../../portal/hub/services/communities.service';
import { FilteredAndPaginatedComponent } from '../filtered-and-paginated/filtered-and-paginated.component';
import { MemberCardComponent } from '../member-card/member-card.component';

@Component({
  standalone: true,
  selector: 'filtered-and-paginated-members',
  imports: [
    CommonModule,
    MemberCardComponent,
    FilteredAndPaginatedComponent,
  ],
  templateUrl: './filtered-and-paginated-members.component.html',
  styleUrl: './filtered-and-paginated-members.component.scss'
})
export class FilteredAndPaginatedMembersComponent {
  public community = input.required<UICommunity>();

  public getItemsParams = input<GetItemsParams>({});

  constructor(
    @Inject(COMMUNITIES_SERVICE_TOKEN) protected communitiesService: CommunitiesService,
  ) { }

  public fetchItems = (getItemsParams: GetItemsParams): Observable<UIPagination<UIMember>> => {
    return this.communitiesService.getMembers(this.community().id, getItemsParams);
  }
}
