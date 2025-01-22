import { Component, Inject } from '@angular/core';
import { DASHBOARD_SERVICE_TOKEN } from '../../../admin.providers';
import { DashboardService } from '../../../services/dashboard.service';
import { CardCounterComponent } from '../card-counter/card-counter.component';

@Component({
  selector: 'users-count',
  imports: [
    CardCounterComponent,
  ],
  templateUrl: './users-count.component.html',
  styleUrl: './users-count.component.scss'
})
export class UsersCountComponent {
  count: number = 0;

  constructor(@Inject(DASHBOARD_SERVICE_TOKEN) private dashboardService: DashboardService,) {
    this.dashboardService.getUserCount().subscribe((count: number) => {
      this.count = count;
    });
  }
}
