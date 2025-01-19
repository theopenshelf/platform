import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { loadItems } from '../../../community/services/mock/items-loader';
import { ItemsService, UIItemWithStats, UIItemWithStatsPagination } from '../items.service';

@Injectable({
  providedIn: 'root',
})
export class MockItemsService implements ItemsService {
  private index = 1;

  private items: UIItemWithStats[] = loadItems().map(item => ({
    ...item,
    createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
    lateReturnPercentage: Math.floor(Math.random() * 21),
    averageDuration: Math.floor(Math.random() * 7) + 1,
  }));


  getItems(
    currentUser?: boolean,
    borrowedByCurrentUser?: boolean,
    libraryIds?: string[],
    categories?: string[],
    searchText?: string,
    currentlyAvailable?: boolean,
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'asc',
    page: number = 1,
    pageSize: number = 10,
  ): Observable<UIItemWithStatsPagination> {
    let filteredItems = this.items;
    // ... filtering logic ...

    // Pagination logic
    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (page - 1) * pageSize;
    const paginatedItems = filteredItems.slice(
      startIndex,
      startIndex + pageSize,
    );

    return of({
      totalPages,
      totalItems,
      currentPage: page,
      itemsPerPage: pageSize,
      items: paginatedItems,
    });
  }

  getItem(id: string): Observable<UIItemWithStats> {
    return of(this.items.find((i) => i.id === id) as UIItemWithStats);
  }

  addItem(item: UIItemWithStats): Observable<UIItemWithStats> {
    item.id = this.index++ + '';
    this.items.push(item);
    return of(item);
  }
}
