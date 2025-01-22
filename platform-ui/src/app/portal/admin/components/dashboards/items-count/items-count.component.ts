import { Component, Inject } from '@angular/core';
import { DASHBOARD_SERVICE_TOKEN } from '../../../admin.providers';
import { DashboardService } from '../../../services/dashboard.service';
import { CardCounterComponent } from '../card-counter/card-counter.component';

@Component({
  selector: 'items-count',
  imports: [
    CardCounterComponent
  ],
  templateUrl: './items-count.component.html',
  styleUrl: './items-count.component.scss'
})
export class ItemsCountComponent {
  count: number = 0;

  constructor(@Inject(DASHBOARD_SERVICE_TOKEN) private dashboardService: DashboardService,) {
    this.dashboardService.getItemCount().subscribe((count: number) => {
      this.count = count;
    });
  }
}
