import { Component } from '@angular/core';
import { FilteredAndPaginatedItemsComponent } from '../../components/filtered-and-paginated-items/filtered-and-paginated-items.component';

@Component({
  standalone: true,
  selector: 'app-items',
  imports: [
    FilteredAndPaginatedItemsComponent,
  ],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
})
export class ItemsComponent { }