import { Component, Inject } from '@angular/core';
import { DASHBOARD_SERVICE_TOKEN } from '../../../admin.providers';
import { DashboardService } from '../../../services/dashboard.service';
import { CardCounterComponent } from '../card-counter/card-counter.component';

@Component({
  selector: 'libraries-count',
  imports: [
    CardCounterComponent,
  ],
  templateUrl: './libraries-count.component.html',
  styleUrl: './libraries-count.component.scss'
})
export class LibrariesCountComponent {
  count: number = 0;

  constructor(@Inject(DASHBOARD_SERVICE_TOKEN) private dashboardService: DashboardService,) {
    this.dashboardService.getLibraryCount().subscribe((count) => {
      this.count = count;
    });
  }
}
