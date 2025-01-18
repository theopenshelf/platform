import { Component } from '@angular/core';
import { FilteredAndPaginatedItemsComponent } from '../../components/filtered-and-paginated-items/filtered-and-paginated-items.component';
import { GetItemsParams } from '../../services/items.service';

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
    FilteredAndPaginatedItemsComponent.SORT_RECENTLY_ADDED,
    FilteredAndPaginatedItemsComponent.SORT_MOST_BORROWED
  ];

  public getItemsParams: GetItemsParams = {
    favorite: true,
  };
}
