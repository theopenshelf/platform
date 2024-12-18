import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DashboardService, UIBorrowerMetrics, UICategoryMetrics, UIDashboardBorrowesMetrics, UIDashboardBorrowesOverTimeData, UIItemMetrics } from '../dashboard.service';

@Injectable({
    providedIn: 'root',
})
export class MockDashboardService implements DashboardService {

    getDashboardData(): Observable<UIDashboardBorrowesOverTimeData> {
        return of({
            labelsX: ['Jan 2019', 'Feb', 'Mar', ''],
            axisYLabels: ['', '25%', '50%', '75%', '100%'],
            data: [
                [50, 50],
                [100, 75],
                [150, 50],
                [200, 150],
                [250, 155],
                [300, 190],
                [350, 90],
            ]
        });
    }

    getUserCount(): Observable<number> {
        return of(5);
    }

    getItemCount(): Observable<number> {
        return of(21);
    }

    getLibraryCount(): Observable<number> {
        return of(3);
    }

    getDashboardMetrics(): Observable<UIDashboardBorrowesMetrics> {
        return of({
            totalBorrows: 1000,
            totalReservations: 100,
            itemsOnLoan: 100,
            avgLoanDuration: '2 days',
            returnTimeliness: '3%'
        });
    }

    getTopBorrowers(): Observable<UIBorrowerMetrics[]> {
        return of([
            { username: 'User 1', totalBorrows: 120 },
            { username: 'User 2', totalBorrows: 90 },
            { username: 'User 3', totalBorrows: 80 },
            { username: 'User 4', totalBorrows: 70 },
            { username: 'User 5', totalBorrows: 60 },
        ]);
    }

    getTopItems(): Observable<UIItemMetrics[]> {
        return of([
            { item: 'Item 1', totalBorrows: 100 },
            { item: 'Item 2', totalBorrows: 90 },
            { item: 'Item 3', totalBorrows: 80 },
            { item: 'Item 4', totalBorrows: 70 },
            { item: 'Item 5', totalBorrows: 60 },
        ]);
    }

    getTopCategories(): Observable<UICategoryMetrics[]> {
        return of([
            { category: 'Category 1', totalBorrows: 100, numberOfItems: 10 },
            { category: 'Category 2', totalBorrows: 90, numberOfItems: 10 },
            { category: 'Category 3', totalBorrows: 80, numberOfItems: 10 },
            { category: 'Category 4', totalBorrows: 70, numberOfItems: 10 },
            { category: 'Category 5', totalBorrows: 60, numberOfItems: 10 },
        ]);
    }
}