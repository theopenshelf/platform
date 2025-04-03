import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, map } from 'rxjs';
import { DASHBOARD_SERVICE_TOKEN } from '../../../admin.providers';
import { DashboardService, UIBorrowerMetrics } from '../../../services/dashboard.service';
import { CardTopComponent, TopData } from '../card-top/card-top.component';

@Component({
  selector: 'top-borrowers',
  standalone: true,
  imports: [
    CommonModule,
    CardTopComponent,
    TranslateModule
  ],
  templateUrl: './top-borrowers.component.html',
  styleUrl: './top-borrowers.component.scss'
})
export class TopBorrowersComponent {
  protected topItems$: Observable<TopData[]>;

  constructor(
    @Inject(DASHBOARD_SERVICE_TOKEN) private dashboardService: DashboardService,
  ) {
    this.topItems$ = this.dashboardService.getTopBorrowers().pipe(
      map((items: UIBorrowerMetrics[]) => items.map(item => ({
        name: item.username,
        avatar: true,
        value: item.totalBorrows,
      })))
    );
  }
}
