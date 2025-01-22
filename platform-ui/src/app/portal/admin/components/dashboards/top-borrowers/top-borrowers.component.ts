import { Component, Inject } from '@angular/core';
import { DASHBOARD_SERVICE_TOKEN } from '../../../admin.providers';
import { DashboardService, UIBorrowerMetrics } from '../../../services/dashboard.service';
import { CardTopComponent, TopData } from '../card-top/card-top.component';

@Component({
  selector: 'top-borrowers',
  imports: [
    CardTopComponent
  ],
  templateUrl: './top-borrowers.component.html',
  styleUrl: './top-borrowers.component.scss'
})
export class TopBorrowersComponent {
  protected topItems: TopData[] = [];

  constructor(
    @Inject(DASHBOARD_SERVICE_TOKEN) private dashboardService: DashboardService,
  ) { }

  ngOnInit(): void {
    this.dashboardService.getTopBorrowers().subscribe((items: UIBorrowerMetrics[]) => {
      this.topItems = items.map(item => ({
        name: item.username,
        avatar: true,
        value: item.totalBorrows,
      }));
    });
  }
}
