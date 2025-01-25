import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UIBorrowRecord } from '../../models/UIBorrowRecord';
import { UIBorrowStatus } from '../../models/UIBorrowStatus';
import { UIItem } from '../../models/UIItem';
import { UIItemsPagination } from '../../models/UIItemsPagination';
import { GetItemsParams, ItemsService } from '../items.service';
import { loadItems } from './items-loader';

@Injectable({
  providedIn: 'root',
})
export class MockItemsService implements ItemsService {
  private index = 1;

  private items: UIItem[] = loadItems();

  getItems(params: GetItemsParams): Observable<UIItemsPagination> {
    const {
      currentUser,
      borrowedByCurrentUser,
      status,
      libraryIds,
      categories,
      searchText,
      currentlyAvailable,
      sortBy,
      sortOrder = 'asc',
      page = 0,
      pageSize = 10,
      startDate,
      endDate,
      favorite,
    } = params;

    let borrowedBy = params.borrowedBy;

    let filteredItems = this.items;
    // Filtering logic
    if (currentUser) {
      filteredItems = filteredItems.filter(
        (item) => item.owner === 'me@example.com',
      );
    }
    if (borrowedByCurrentUser) {
      borrowedBy = 'me@example.com';
    }
    if (borrowedBy) {
      filteredItems = filteredItems.filter((item) =>
        item.borrowRecords.some(
          (record) => record.borrowedBy === borrowedBy,
        ),
      );
      if (status) {
        filteredItems = filteredItems.filter((item) =>
          this.matchesStatus(status, item, borrowedBy),
        );
      }
    }

    if (favorite) {
      filteredItems = filteredItems.filter((item) => item.favorite);
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
    if (startDate && endDate) {
      filteredItems = filteredItems.filter(
        (item) =>
          item.borrowRecords.filter(
            (record) =>
              record.startDate <= endDate && record.endDate >= startDate,
          ).length === 0,
      );
    }

    // Sorting logic
    if (sortBy) {
      filteredItems = filteredItems.sort((a, b) => {
        const aValue = a[sortBy as keyof UIItem] ?? '';
        const bValue = b[sortBy as keyof UIItem] ?? '';
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Pagination logic
    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = page * pageSize;
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

  getItem(id: string): Observable<UIItem> {
    return of(this.items.find((i) => i.id === id) as UIItem);
  }

  addItem(item: UIItem): Observable<UIItem> {
    item.id = this.index++ + '';
    item.createdAt = new Date();
    this.items.push(item);
    return of(item);
  }

  borrowItem(
    item: UIItem,
    startDate: string,
    endDate: string,
  ): Observable<UIItem> {
    const borrowRecord: UIBorrowRecord = {
      id: this.index++ + '',
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reservationDate: new Date(),
      effectiveReturnDate: undefined,
      borrowedBy: 'me@example.com',
    };

    // Optionally, you can add the record to the item itself if needed
    item.borrowRecords = item.borrowRecords || [];
    item.borrowRecords.push(borrowRecord);

    return of(item);
  }

  cancelReservation(
    item: UIItem,
    borrowRecord: UIBorrowRecord,
  ): Observable<UIItem> {
    item.borrowRecords = item.borrowRecords.filter(
      (record) => record.id !== borrowRecord.id,
    );
    return of(item);
  }

  markAsFavorite(item: UIItem): Observable<void> {
    item.favorite = !item.favorite;
    return of(undefined);
  }

  matchesStatus(status: UIBorrowStatus, item: UIItem, borrowedBy: string): boolean {
    const now = new Date();
    const records = item.borrowRecords.filter((record) => borrowedBy ? record.borrowedBy === borrowedBy : true);
    switch (status) {
      case UIBorrowStatus.Returned:
        return (
          records.filter((record) => record.endDate < now).length > 0
        );
      case UIBorrowStatus.CurrentlyBorrowed:
        return (
          records.find(
            (record) => record.startDate <= now && now <= record.endDate,
          ) !== undefined
        );
      case UIBorrowStatus.Reserved:
        return (
          records.filter((record) => now < record.startDate).length >
          0
        );
    }
  }
}
