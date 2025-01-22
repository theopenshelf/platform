import { Component, Inject } from '@angular/core';
import { DASHBOARD_SERVICE_TOKEN } from '../../../admin.providers';
import { DashboardService, UICategoryMetrics } from '../../../services/dashboard.service';
import { CardTopComponent, TopData } from '../card-top/card-top.component';

@Component({
  selector: 'top-categories',
  imports: [
    CardTopComponent
  ],
  templateUrl: './top-categories.component.html',
  styleUrl: './top-categories.component.scss'
})
export class TopCategoriesComponent {
  protected topItems: TopData[] = [];

  constructor(
    @Inject(DASHBOARD_SERVICE_TOKEN) private dashboardService: DashboardService,
  ) { }

  ngOnInit(): void {
    this.dashboardService.getTopCategories().subscribe((items: UICategoryMetrics[]) => {
      this.topItems = items.map(item => ({
        name: item.category,
        icon: item.icon,
        value: item.totalBorrows,
        secondaryValue: item.numberOfItems
      }));
    });
  }

}
