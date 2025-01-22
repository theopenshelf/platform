import { Observable } from 'rxjs';

// Define types for return values
export interface UIDashboardBorrowesOverTimeData {
  labelsX: string[];
  axisYLabels: string[];
  data: ReadonlyArray<readonly number[]>;
}

export interface UIDashboardBorrowesMetrics {
  totalBorrows: number;
  totalReservations: number;
  itemsOnLoan: number;
  avgLoanDuration: string;
  returnTimeliness: string;
}

export interface UIBorrowerMetrics {
  username: string;
  totalBorrows: number;
}

export interface UIItemMetrics {
  item: string;
  totalBorrows: number;
}

export interface UICategoryMetrics {
  category: string;
  icon: string;
  totalBorrows: number;
  numberOfItems: number;
}

export interface DashboardService {
  getDashboardData(): Observable<UIDashboardBorrowesOverTimeData>;

  getUserCount(): Observable<number>;

  getItemCount(): Observable<number>;

  getLibraryCount(): Observable<number>;

  getDashboardMetrics(): Observable<UIDashboardBorrowesMetrics>;

  getTopBorrowers(): Observable<UIBorrowerMetrics[]>;

  getTopItems(): Observable<UIItemMetrics[]>;

  getTopCategories(): Observable<UICategoryMetrics[]>;
}
