import { Component, Inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TuiAxes, TuiBarChart, TuiLineChartHint } from '@taiga-ui/addon-charts';
import { TuiHint } from '@taiga-ui/core';
import { DASHBOARD_SERVICE_TOKEN } from '../../../admin.providers';
import { DashboardService, UIDashboardBorrowesMetrics, UIDashboardBorrowesOverTimeData } from '../../../services/dashboard.service';

@Component({
  selector: 'borrows-stat',
  imports: [
    TuiAxes,
    TuiBarChart,
    TuiHint,
    TuiLineChartHint,
    TranslateModule
  ],
  templateUrl: './borrows-stat.component.html',
  styleUrl: './borrows-stat.component.scss'
})
export class BorrowsStatComponent {

  protected labelsX: string[] = [];
  protected axisYLabels: string[] = [];
  protected value: ReadonlyArray<readonly number[]> = [];
  protected totalBorrows: number = 0;
  protected totalReservations: number = 0;
  protected itemsOnLoan: number = 0;
  protected avgLoanDuration: string = '';
  protected returnTimeliness: string = '';
  protected readonly appearances = ['dark', 'error'];

  constructor(
    @Inject(DASHBOARD_SERVICE_TOKEN) private dashboardService: DashboardService,
  ) { }

  ngOnInit(): void {
    this.dashboardService
      .getDashboardData()
      .subscribe((data: UIDashboardBorrowesOverTimeData) => {
        this.labelsX = data.labelsX;
        this.axisYLabels = data.axisYLabels;
        this.value = data.data;
      });

    this.dashboardService
      .getDashboardMetrics()
      .subscribe((metrics: UIDashboardBorrowesMetrics) => {
        this.totalBorrows = metrics.totalBorrows;
        this.totalReservations = metrics.totalReservations;
        this.itemsOnLoan = metrics.itemsOnLoan;
        this.avgLoanDuration = metrics.avgLoanDuration;
        this.returnTimeliness = metrics.returnTimeliness;
      });
  }


  stringify(value: number): string {
    return value.toString();
  }
}
