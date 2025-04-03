import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { DASHBOARD_SERVICE_TOKEN } from '../../../admin.providers';
import { DashboardService } from '../../../services/dashboard.service';
import { CardCounterComponent } from '../card-counter/card-counter.component';

@Component({
  selector: 'users-count',
  standalone: true,
  imports: [
    CommonModule,
    CardCounterComponent,
    TranslateModule
  ],
  templateUrl: './users-count.component.html',
  styleUrl: './users-count.component.scss'
})
export class UsersCountComponent {
  protected readonly count$: Observable<number>;

  constructor(@Inject(DASHBOARD_SERVICE_TOKEN) private dashboardService: DashboardService) {
    this.count$ = this.dashboardService.getUserCount();
  }
}
