import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, map } from 'rxjs';
import { DASHBOARD_SERVICE_TOKEN } from '../../../admin.providers';
import { DashboardService, UICategoryMetrics } from '../../../services/dashboard.service';
import { CardTopComponent, TopData } from '../card-top/card-top.component';

@Component({
  selector: 'top-categories',
  standalone: true,
  imports: [
    CommonModule,
    CardTopComponent,
    TranslateModule
  ],
  templateUrl: './top-categories.component.html',
  styleUrl: './top-categories.component.scss'
})
export class TopCategoriesComponent {
  protected readonly topItems$: Observable<TopData[]>;

  constructor(@Inject(DASHBOARD_SERVICE_TOKEN) private dashboardService: DashboardService) {
    this.topItems$ = this.dashboardService.getTopCategories().pipe(
      map((items: UICategoryMetrics[]) => items.map(item => ({
        name: item.category,
        icon: item.icon,
        value: item.totalBorrows,
        subtitle: `${item.numberOfItems} items`
      })))
    );
  }
}
