import { Component } from '@angular/core';
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
    BorrowsStatComponent
  ],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {

}
