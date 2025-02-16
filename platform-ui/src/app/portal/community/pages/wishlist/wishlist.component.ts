import { Component } from '@angular/core';
import { FilteredAndPaginatedItemsComponent } from '../../../../components/filtered-and-paginated-items/filtered-and-paginated-items.component';
import { FilteredAndPaginatedComponent } from '../../../../components/filtered-and-paginated/filtered-and-paginated.component';
import { BreadcrumbService } from '../../../../components/tos-breadcrumbs/tos-breadcrumbs.service';
import { GetItemsParams } from '../../../../models/GetItemsParams';

@Component({
  standalone: true,
  selector: 'app-wishlist',
  imports: [
    FilteredAndPaginatedItemsComponent,
  ],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss',
})
export class WishlistComponent {

  readonly sortingOptions = [
    FilteredAndPaginatedComponent.SORT_RECENTLY_ADDED,
    FilteredAndPaginatedComponent.SORT_MOST_BORROWED
  ];

  constructor(private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setBreadcrumbs([
      { caption: 'breadcrumb.wishlist', routerLink: '/community/wishlist' }
    ]);
  }

  public getItemsParams: GetItemsParams = {
    favorite: true,
  };
}
