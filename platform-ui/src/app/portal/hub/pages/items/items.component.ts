import { Component } from '@angular/core';
import { FilteredAndPaginatedItemsComponent } from '../../../../components/filtered-and-paginated-items/filtered-and-paginated-items.component';
import { BreadcrumbService } from '../../../../components/tos-breadcrumbs/tos-breadcrumbs.service';

@Component({
  standalone: true,
  selector: 'app-items',
  imports: [
    FilteredAndPaginatedItemsComponent
  ],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
})
export class ItemsComponent {

  constructor(private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setBreadcrumbs([
      { caption: 'breadcrumb.items', routerLink: '/hub/items' }
    ]);
  }
}