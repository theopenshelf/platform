import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { loadItems } from '../../../community/services/mock/items-loader';
import { ItemsService, UIItemWithStats, UIItemWithStatsPagination } from '../items.service';

@Injectable({
  providedIn: 'root',
})
export class MockItemsService implements ItemsService {
  private index = 1;

  public items: UIItemWithStats[] = loadItems().map(item => ({
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

    // Filtering logic
    if (currentUser) {
      filteredItems = filteredItems.filter(
        (item) => item.owner === 'me@example.com',
      );
    }
    if (borrowedByCurrentUser) {
      filteredItems = filteredItems.filter((item) =>
        item.borrowRecords.some(
          (record) => record.borrowedBy === 'me@example.com',
        ),
      );
    }
    if (libraryIds && libraryIds.length > 0) {
      filteredItems = filteredItems.filter((item) =>
        libraryIds.includes(item.libraryId),
      );
    }
    if (categories && categories.length > 0) {
      filteredItems = filteredItems.filter((item) =>
        categories.includes(item.category.name),
      );
    }
    if (searchText) {
      const lowerCaseSearchText = searchText.toLowerCase();
      filteredItems = filteredItems.filter((item) =>
        item.name.toLowerCase().includes(lowerCaseSearchText),
      );
    }

    if (currentlyAvailable) {
      filteredItems = filteredItems.filter(
        (item) =>
          !item.borrowRecords.some(
            (record) =>
              record.startDate <= new Date() && new Date() <= record.endDate,
          ),
      );
    }

    // Sorting logic
    if (sortBy) {
      filteredItems = filteredItems.sort((a, b) => {
        let aValue, bValue;

        if (sortBy === 'category') {
          aValue = a.category.name;
          bValue = b.category.name;
        } else {
          aValue = a[sortBy as keyof UIItemWithStats];
          bValue = b[sortBy as keyof UIItemWithStats];
        }

        if (!aValue || !bValue) {
          return 0;
        }

        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        } else {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        }
      });
    }

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
    const item = this.items.find((i) => i.id === id);
    if (!item) {
      throw new Error('Item not found');
    }
    return of(item);
  }

  addItem(item: UIItemWithStats): Observable<UIItemWithStats> {
    item.id = this.index++ + '';
    this.items.push(item);
    return of(item);
  }
}
