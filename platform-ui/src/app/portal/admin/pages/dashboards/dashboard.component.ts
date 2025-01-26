import { Component } from '@angular/core';
import { communityProviders } from '../../../community/community.provider';
import { FilteredAndPaginatedItemsComponent } from '../../../community/components/filtered-and-paginated-items/filtered-and-paginated-items.component';
import { GetItemsParams } from '../../../community/services/items.service';
import { BorrowsStatComponent } from '../../components/dashboards/borrows-stat/borrows-stat.component';
import { ItemsCountComponent } from '../../components/dashboards/items-count/items-count.component';
import { LibrariesCountComponent } from '../../components/dashboards/libraries-count/libraries-count.component';
import { TopBorrowersComponent } from '../../components/dashboards/top-borrowers/top-borrowers.component';
import { TopCategoriesComponent } from '../../components/dashboards/top-categories/top-categories.component';
import { TopItemsComponent } from '../../components/dashboards/top-items/top-items.component';
import { UsersCountComponent } from '../../components/dashboards/users-count/users-count.component';

@Component({
  imports: [
    ItemsCountComponent,
    UsersCountComponent,
    LibrariesCountComponent,
    TopItemsComponent,
    TopCategoriesComponent,
    TopBorrowersComponent,
    BorrowsStatComponent,
    FilteredAndPaginatedItemsComponent
  ],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [
    ...communityProviders,
  ],
})
export class DashboardComponent {
  public getItemsParams: GetItemsParams = {};
}
