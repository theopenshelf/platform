import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  BorrowerMetrics,
  CategoryMetrics,
  DashboardBorrowesMetrics,
  DashboardBorrowesOverTimeData,
  DashboardsAdminApiService,
} from '../../../../api-client';
import {
  DashboardService,
  UIBorrowerMetrics,
  UICategoryMetrics,
  UIDashboardBorrowesMetrics,
  UIDashboardBorrowesOverTimeData,
  UIItemMetrics,
} from '../dashboard.service';

@Injectable({
  providedIn: 'root',
})
export class ApiDashboardService implements DashboardService {
  constructor(private dashboardsAdminApiService: DashboardsAdminApiService) {}

  getDashboardData(): Observable<UIDashboardBorrowesOverTimeData> {
    return this.dashboardsAdminApiService.getDashboardData().pipe(
      map((data: DashboardBorrowesOverTimeData) => ({
        labelsX: data.labelsX,
        axisYLabels: data.axisYLabels,
        data: data.data.map((point) => [point.x, point.y] as [number, number]),
      })),
    );
  }

  getUserCount(): Observable<number> {
    return this.dashboardsAdminApiService.getUserCount();
  }

  getItemCount(): Observable<number> {
    return this.dashboardsAdminApiService.getItemCount();
  }

  getLibraryCount(): Observable<number> {
    return this.dashboardsAdminApiService.getLibraryCount();
  }

  getDashboardMetrics(): Observable<UIDashboardBorrowesMetrics> {
    return this.dashboardsAdminApiService.getDashboardMetrics().pipe(
      map((data: DashboardBorrowesMetrics) => ({
        totalBorrows: data.metrics.totalBorrows ?? 0,
        totalReservations: data.metrics.totalReservations ?? 0,
        itemsOnLoan: data.metrics.itemsOnLoan ?? 0,
        avgLoanDuration: data.metrics.avgLoanDuration + ' days',
        returnTimeliness: data.metrics.returnTimeliness + '%',
      })),
    );
  }

  getTopBorrowers(): Observable<UIBorrowerMetrics[]> {
    return this.dashboardsAdminApiService.getTopBorrowers().pipe(
      map((data: BorrowerMetrics[]) =>
        data.map((borrower) => ({
          username: borrower.username,
          totalBorrows: borrower.totalBorrows,
        })),
      ),
    );
  }

  getTopItems(): Observable<UIItemMetrics[]> {
    return this.dashboardsAdminApiService.getTopItems();
  }

  getTopCategories(): Observable<UICategoryMetrics[]> {
    return this.dashboardsAdminApiService.getTopCategories().pipe(
      map((data: CategoryMetrics[]) =>
        data.map((category) => ({
          category: category.category,
          totalBorrows: category.totalBorrows,
          numberOfItems: category.borrowedItems ?? 0,
        })),
      ),
    );
  }
}
