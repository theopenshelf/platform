import { CommonModule } from '@angular/common';
import { Component, Inject, input } from '@angular/core';
import { Observable } from 'rxjs';
import { GetItemsParams } from '../../models/GetItemsParams';
import { UILibrary, UIMember } from '../../models/UILibrary';
import { UIPagination } from '../../models/UIPagination';
import { LIBRARIES_SERVICE_TOKEN } from '../../portal/community/community.provider';
import { LibrariesService } from '../../portal/community/services/libraries.service';
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
  public library = input.required<UILibrary>();

  public getItemsParams = input<GetItemsParams>({});

  constructor(
    @Inject(LIBRARIES_SERVICE_TOKEN) protected librariesService: LibrariesService,
  ) { }

  public fetchItems = (getItemsParams: GetItemsParams): Observable<UIPagination<UIMember>> => {
    return this.librariesService.getMembers(this.library().id, getItemsParams);
  }
}
