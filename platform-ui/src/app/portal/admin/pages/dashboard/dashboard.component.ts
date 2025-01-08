import { Component, Inject, OnInit } from '@angular/core';
import { TuiAxes, TuiLineChart, TuiLineChartHint } from '@taiga-ui/addon-charts';
import { TuiHint, TuiIcon, TuiPoint } from '@taiga-ui/core';
import { DASHBOARD_SERVICE_TOKEN } from '../../admin.providers';
import { DashboardService, UIBorrowerMetrics, UICategoryMetrics, UIDashboardBorrowesMetrics, UIDashboardBorrowesOverTimeData, UIItemMetrics } from '../../services/dashboard.service';

@Component({
  imports: [TuiAxes, TuiLineChart, TuiHint, TuiLineChartHint, TuiIcon],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  protected labelsX: string[] = [];
  protected axisYLabels: string[] = [];
  protected value: readonly TuiPoint[] = [];
  protected totalBorrows: number = 0;
  protected totalReservations: number = 0;
  protected itemsOnLoan: number = 0;
  protected avgLoanDuration: string = '';
  protected returnTimeliness: string = '';
  protected topBorrowers: UIBorrowerMetrics[] = [];
  protected topItems: UIItemMetrics[] = [];
  protected topCategories: UICategoryMetrics[] = [];
  protected userCount: number = 0;
  protected itemCount: number = 0;
  protected libraryCount: number = 0;

  constructor(@Inject(DASHBOARD_SERVICE_TOKEN) private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.dashboardService.getDashboardData().subscribe((data: UIDashboardBorrowesOverTimeData) => {
      this.labelsX = data.labelsX;
      this.axisYLabels = data.axisYLabels;
      this.value = data.data;
    });

    this.dashboardService.getDashboardMetrics().subscribe((metrics: UIDashboardBorrowesMetrics) => {
      this.totalBorrows = metrics.totalBorrows;
      this.totalReservations = metrics.totalReservations;
      this.itemsOnLoan = metrics.itemsOnLoan;
      this.avgLoanDuration = metrics.avgLoanDuration;
      this.returnTimeliness = metrics.returnTimeliness;
    });

    this.dashboardService.getTopBorrowers().subscribe((borrowers: UIBorrowerMetrics[]) => {
      this.topBorrowers = borrowers;
    });

    this.dashboardService.getTopItems().subscribe((items: UIItemMetrics[]) => {
      this.topItems = items;
    });

    this.dashboardService.getTopCategories().subscribe((categories: UICategoryMetrics[]) => {
      this.topCategories = categories;
    });

    this.dashboardService.getUserCount().subscribe((count: number) => {
      this.userCount = count;
    });

    this.dashboardService.getItemCount().subscribe((count: number) => {
      this.itemCount = count;
    });

    this.dashboardService.getLibraryCount().subscribe((count: number) => {
      this.libraryCount = count;
    });
  }

  stringify(value: number): string {
    return value.toString();
  }
}
