import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UIBorrowRecord } from '../../models/UIBorrowRecord';
import { UIBorrowRecordsPagination, UIBorrowRecordStandalone } from '../../models/UIBorrowRecordsPagination';
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
    }

    if (status) {
      filteredItems = filteredItems.filter((item) =>
        this.matchesStatus(status, item, borrowedBy),
      );
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

  getBorrowRecords(params: GetItemsParams): Observable<UIBorrowRecordsPagination> {
    const {
      status,
      borrowedByCurrentUser,
      sortBy,
      sortOrder,
      categories,
      borrowedBy,
      startDate,
      endDate,
      page = 0,
      pageSize = 10,
    } = params;
    let filteredRecords: UIBorrowRecordStandalone[] = [];

    // Filter records based on the borrowedBy parameter
    this.items.forEach(item => {
      item.borrowRecords.forEach(record => {
        if (borrowedByCurrentUser) {
          if (record.borrowedBy === 'me@example.com') {
            filteredRecords.push({ ...record, item });
          }
        } else if (borrowedBy && record.borrowedBy === borrowedBy) {
          filteredRecords.push({ ...record, item });
        } else {
          filteredRecords.push({ ...record, item });
        }
      });
    });

    filteredRecords = filteredRecords.sort((a, b) => {
      return b.startDate.getTime() - a.startDate.getTime();
    });

    // Filter records based on the date range
    if (startDate && endDate) {
      filteredRecords = filteredRecords.filter(record =>
        record.startDate <= endDate && record.endDate >= startDate
      );
    }

    if (status) {
      filteredRecords = filteredRecords.filter(record =>
        this.matchesStatusBorrowRecord(status, record)
      );
    }

    if (categories && categories.length > 0) {
      filteredRecords = filteredRecords.filter((record) =>
        categories.includes(record.item.category.name),
      );
    }

    if (sortBy) {
      switch (sortBy) {
        case 'reservationDate':
          filteredRecords = filteredRecords.sort((a, b) => {
            const aValue = a.reservationDate ?? '';
            const bValue = b.reservationDate ?? '';
            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
          });
          break;
        case 'startDate':
          filteredRecords = filteredRecords.sort((a, b) => {
            const aValue = a.startDate ?? '';
            const bValue = b.startDate ?? '';
            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
          });
          break;
        case 'endDate':
          filteredRecords = filteredRecords.sort((a, b) => {
            const aValue = a.endDate ?? '';
            const bValue = b.endDate ?? '';
            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
          });
          break;
        case 'returnDate':
          filteredRecords = filteredRecords.sort((a, b) => {
            const aValue = a.effectiveReturnDate ?? '';
            const bValue = b.effectiveReturnDate ?? '';
            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
          });
          break;
      }
    }

    // Pagination logic
    const totalItems = filteredRecords.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = page * pageSize;
    const paginatedRecords = filteredRecords.slice(
      startIndex,
      startIndex + pageSize
    );

    return of({
      totalPages,
      totalItems,
      currentPage: page,
      itemsPerPage: pageSize,
      items: paginatedRecords,
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
      pickupDate: undefined,
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

  returnItem(
    item: UIItem,
    borrowRecord: UIBorrowRecord,
  ): Observable<UIItem> {
    borrowRecord.effectiveReturnDate = new Date();
    return of(item);
  }

  pickupItem(
    item: UIItem,
    borrowRecord: UIBorrowRecord,
  ): Observable<UIItem> {
    borrowRecord.pickupDate = new Date();
    return of(item);
  }
  markAsFavorite(item: UIItem): Observable<void> {
    item.favorite = !item.favorite;
    return of(undefined);
  }

  matchesStatus(status: UIBorrowStatus, item: UIItem, borrowedBy: string | undefined): boolean {
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

  matchesStatusBorrowRecord(status: UIBorrowStatus, borrowRecord: UIBorrowRecordStandalone): boolean {
    const now = new Date();
    switch (status) {
      case UIBorrowStatus.Returned:
        return (
          borrowRecord.effectiveReturnDate !== undefined && borrowRecord.effectiveReturnDate !== null
        );
      case UIBorrowStatus.CurrentlyBorrowed:
        return (
          borrowRecord.startDate <= now && (borrowRecord.effectiveReturnDate === undefined || borrowRecord.effectiveReturnDate === null)
        );
      case UIBorrowStatus.Reserved:
        return (
          borrowRecord.startDate > now
        );
    }
  }

}
