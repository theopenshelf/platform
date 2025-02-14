import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  DashboardService,
  UIBorrowerMetrics,
  UICategoryMetrics,
  UIDashboardBorrowesMetrics,
  UIDashboardBorrowesOverTimeData,
  UIItemMetrics,
} from '../dashboard.service';
import { MockCategoriesService } from './categories.service';
import { MockItemsService } from './items.service';
import { MockLibrariesService } from './libraries.service';
import { MockUsersService } from './users.service';

@Injectable({
  providedIn: 'root',
})
export class MockDashboardService implements DashboardService {

  constructor(private usersService: MockUsersService, private categoriesService: MockCategoriesService, private itemsService: MockItemsService, private librariesService: MockLibrariesService) { }

  getDashboardData(): Observable<UIDashboardBorrowesOverTimeData> {
    return of({
      labelsX: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisYLabels: ['0', '10 000'],
      data: [
        [3660, 8281, 1069, 9034, 5797, 6918, 8495, 3234, 6204, 1392, 2088, 8637],
        [3952, 3671, 3781, 5323, 3537, 4107, 2962, 3320, 8632, 4755, 9130, 1195],
      ],
    });
  }


  getUserCount(): Observable<number> {
    return of(this.usersService.allUsers.length);
  }

  getItemCount(): Observable<number> {
    return of(this.itemsService.items.length);
  }

  getLibraryCount(): Observable<number> {
    return of(this.librariesService.libraries.length);
  }

  getDashboardMetrics(): Observable<UIDashboardBorrowesMetrics> {
    return of({
      totalBorrows: 1000,
      totalReservations: 100,
      itemsOnLoan: 100,
      avgLoanDuration: '2 days',
      returnTimeliness: '3%',
    });
  }

  getTopBorrowers(): Observable<UIBorrowerMetrics[]> {
    const users = this.usersService.allUsers;
    const items = this.itemsService.items;

    // Create a map to store borrow counts for each user
    const borrowCounts = new Map<string, number>();

    // Iterate over each item to count borrows per user
    items.forEach(item => {
      item.borrowRecords.forEach(record => {
        if (borrowCounts.has(record.borrowedBy)) {
          borrowCounts.set(record.borrowedBy, borrowCounts.get(record.borrowedBy)! + 1);
        } else {
          borrowCounts.set(record.borrowedBy, 1);
        }
      });
    });

    // Map the borrow counts to the user metrics
    const borrowerMetrics: UIBorrowerMetrics[] = users.map(user => ({
      username: user.username,
      totalBorrows: borrowCounts.get(user.email) || 0
    }));

    // Sort the borrowers by total borrows in descending order
    borrowerMetrics.sort((a, b) => b.totalBorrows - a.totalBorrows);

    // Return the top 5 borrowers
    return of(borrowerMetrics.slice(0, 5));
  }

  getTopItems(): Observable<UIItemMetrics[]> {
    const items = this.itemsService.items;

    // Map items to their borrow counts
    const itemMetrics: UIItemMetrics[] = items.map(item => ({
      item: item.name,
      totalBorrows: item.borrowCount
    }));

    // Sort items by total borrows in descending order
    itemMetrics.sort((a, b) => b.totalBorrows - a.totalBorrows);

    // Return the top 5 items
    return of(itemMetrics.slice(0, 5));
  }

  getTopCategories(): Observable<UICategoryMetrics[]> {
    const items = this.itemsService.items;

    // Create a map to store borrow counts and item counts for each category
    const categoryMetricsMap = new Map<string, { totalBorrows: number, numberOfItems: number }>();

    // Iterate over each item to accumulate data for each category
    items.forEach(item => {
      const categoryName = item.category.name;
      if (!categoryMetricsMap.has(categoryName)) {
        categoryMetricsMap.set(categoryName, { totalBorrows: 0, numberOfItems: 0 });
      }
      const categoryMetrics = categoryMetricsMap.get(categoryName)!;
      categoryMetrics.totalBorrows += item.borrowCount;
      categoryMetrics.numberOfItems += 1;
    });

    const categories = this.categoriesService.categories;

    // Create a map of category names to icons
    const categoryIconMap = new Map<string, string>();
    categories.forEach(category => {
      categoryIconMap.set(category.name, category.icon);
    });

    const categoryMetrics: UICategoryMetrics[] = Array.from(categoryMetricsMap.entries()).map(([category, metrics]) => ({
      category,
      icon: categoryIconMap.get(category) || 'defaultIcon', // Use the map to get the icon
      totalBorrows: metrics.totalBorrows,
      numberOfItems: metrics.numberOfItems
    }));

    // Sort categories by total borrows in descending order
    categoryMetrics.sort((a, b) => b.totalBorrows - a.totalBorrows);

    // Return the top 5 categories
    return of(categoryMetrics.slice(0, 5));
  }
}
