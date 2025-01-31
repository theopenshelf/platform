import { Component, Inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DASHBOARD_SERVICE_TOKEN } from '../../../admin.providers';
import { DashboardService, UIItemMetrics } from '../../../services/dashboard.service';
import { CardTopComponent, TopData } from '../card-top/card-top.component';

@Component({
  selector: 'top-items',
  imports: [
    CardTopComponent,
    TranslateModule
  ],
  templateUrl: './top-items.component.html',
  styleUrl: './top-items.component.scss'
})
export class TopItemsComponent {
  protected topItems: TopData[] = [];

  constructor(
    @Inject(DASHBOARD_SERVICE_TOKEN) private dashboardService: DashboardService,
  ) { }

  ngOnInit(): void {
    this.dashboardService.getTopItems().subscribe((items: UIItemMetrics[]) => {
      this.topItems = items.map(item => ({
        name: item.item,
        value: item.totalBorrows
      }));
    });
  }
}
