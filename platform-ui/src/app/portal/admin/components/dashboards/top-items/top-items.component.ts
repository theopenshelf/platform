import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, map } from 'rxjs';
import { DASHBOARD_SERVICE_TOKEN } from '../../../admin.providers';
import { DashboardService, UIItemMetrics } from '../../../services/dashboard.service';
import { CardTopComponent, TopData } from '../card-top/card-top.component';

@Component({
  selector: 'top-items',
  standalone: true,
  imports: [
    CommonModule,
    CardTopComponent,
    TranslateModule
  ],
  templateUrl: './top-items.component.html',
  styleUrl: './top-items.component.scss'
})
export class TopItemsComponent {
  protected readonly topItems$: Observable<TopData[]>;

  constructor(@Inject(DASHBOARD_SERVICE_TOKEN) private dashboardService: DashboardService) {
    this.topItems$ = this.dashboardService.getTopItems().pipe(
      map((items: UIItemMetrics[]) => items.map(item => ({
        name: item.item,
        value: item.totalBorrows
      })))
    );
  }
}
