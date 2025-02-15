import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { loadItems } from '../../../../mock/items-loader';
import { GetBorrowRecordsCountByStatusParams } from '../../../../models/GetBorrowRecordsCountByStatusParams';
import { GetItemsParams } from '../../../../models/GetItemsParams';
import { UIBorrowRecord } from '../../../../models/UIBorrowRecord';
import { UIBorrowRecordsPagination, UIBorrowRecordStandalone } from '../../../../models/UIBorrowRecordsPagination';
import { UIBorrowDetailedStatus, UIBorrowStatus } from '../../../../models/UIBorrowStatus';
import { UIItem } from '../../../../models/UIItem';
import { UIItemsPagination } from '../../../../models/UIItemsPagination';
import { UINotificationType } from '../../../../models/UINotification';
import { UIUser } from '../../../../models/UIUser';
import { MockNotificationsService } from '../../../../services/mock/notifications.service';
import { ItemsService } from '../items.service';
@Injectable({
  providedIn: 'root',
})
export class MockItemsService implements ItemsService {
  private index = 1;

  private items: UIItem[] = loadItems();

  constructor(private notificationService: MockNotificationsService) {
  }

  getItems(params: GetItemsParams): Observable<UIItemsPagination> {
    const {
      borrowedByCurrentUser,
      statuses,
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

    if (borrowedByCurrentUser) {
      borrowedBy = '11';
    }
    if (borrowedBy) {
      filteredItems = filteredItems.filter((item) =>
        item.borrowRecords.some(
          (record) => record.borrowedBy === borrowedBy,
        ),
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
      statuses,
      borrowedByCurrentUser,
      sortBy,
      libraryIds,
      sortOrder,
      categories,
      itemId,
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
          if (record.borrowedBy === '11') {
            filteredRecords.push({ ...record, item });
          }
        } else if (borrowedBy && record.borrowedBy === borrowedBy) {
          filteredRecords.push({ ...record, item });
        } else {
          filteredRecords.push({ ...record, item });
        }
      });
    });

    if (itemId) {
      filteredRecords = filteredRecords.filter(record => record.item.id === itemId);
    }

    filteredRecords = filteredRecords.sort((a, b) => {
      return b.startDate.getTime() - a.startDate.getTime();
    });

    // Filter records based on the date range
    if (startDate && endDate) {
      filteredRecords = filteredRecords.filter(record =>
        record.startDate <= endDate && record.endDate >= startDate
      );
    }

    if (libraryIds && libraryIds.length > 0) {
      filteredRecords = filteredRecords.filter(record =>
        libraryIds.includes(record.item.libraryId),
      );
    }

    if (statuses) {
      filteredRecords = filteredRecords.filter(record =>
        this.matchesStatuses(statuses, record)
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

  getBorrowRecordsCountByStatus(params: GetBorrowRecordsCountByStatusParams): Observable<Map<UIBorrowDetailedStatus, number>> {

    const countMap = new Map<UIBorrowDetailedStatus, number>();
    for (const status of params.statuses!) {
      this.getBorrowRecords({ ...params, statuses: [status] }).subscribe(records => {
        countMap.set(status, records.totalItems);
      });
    }
    return of(countMap);
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
    borrowBy?: UIUser,
  ): Observable<UIItem> {
    const borrowRecord: UIBorrowRecord = {
      id: this.index++ + '',
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reservationDate: new Date(),
      pickupDate: undefined,
      effectiveReturnDate: undefined,
      borrowedBy: borrowBy?.id ?? '11',

      status: new Date(startDate).toDateString() === new Date().toDateString()
        ? UIBorrowDetailedStatus.Borrowed_Active
        : UIBorrowDetailedStatus.Reserved_Confirmed,
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

    // Update the borrowRecord in the item's borrowRecords array
    const recordToUpdate = item.borrowRecords.find(record => record.id === borrowRecord.id);
    if (recordToUpdate) {
      recordToUpdate.effectiveReturnDate = borrowRecord.effectiveReturnDate;
    }
    if (borrowRecord.effectiveReturnDate < borrowRecord.endDate) {
      borrowRecord.status = UIBorrowDetailedStatus.Returned_Early;
    } else if (borrowRecord.effectiveReturnDate > borrowRecord.endDate) {
      borrowRecord.status = UIBorrowDetailedStatus.Returned_Late;
    } else {
      borrowRecord.status = UIBorrowDetailedStatus.Returned_OnTime;
    }

    item.borrowRecords = item.borrowRecords.map(record => {
      if (record.id === borrowRecord.id) {
        return borrowRecord;
      }
      return record;
    });

    return of(item);
  }


  approvalReservation(
    decision: 'approve' | 'reject',
    item: UIItem,
    borrowRecord: UIBorrowRecord,
  ): Observable<UIItem> {

    if (decision === 'approve') {
      borrowRecord.status = UIBorrowDetailedStatus.Reserved_Confirmed;
    } else {
      return this.cancelReservation(item, borrowRecord);
    }

    item.borrowRecords = item.borrowRecords.map(record => {
      if (record.id === borrowRecord.id) {
        return borrowRecord;
      }
      return record;
    });

    this.notificationService.pushNewNotification({
      type: UINotificationType.ITEM_RESERVATION_APPROVED,
      payload: { item: item },
      destinationUserId: borrowRecord.borrowedBy,
    });

    return of(item);
  }

  approvalPickup(
    decision: 'approve' | 'reject',
    item: UIItem,
    borrowRecord: UIBorrowRecord,
  ): Observable<UIItem> {

    if (decision === 'approve') {
      borrowRecord.status = UIBorrowDetailedStatus.Borrowed_Active;
    } else {
      borrowRecord.status = UIBorrowDetailedStatus.Reserved_Unconfirmed;
    }

    item.borrowRecords = item.borrowRecords.map(record => {
      if (record.id === borrowRecord.id) {
        return borrowRecord;
      }
      return record;
    });
    this.notificationService.pushNewNotification({
      type: UINotificationType.ITEM_PICKUP_APPROVED,
      payload: { item: item },
      destinationUserId: borrowRecord.borrowedBy,
    });
    return of(item);
  }

  approvalReturn(
    decision: 'approve' | 'reject',
    item: UIItem,
    borrowRecord: UIBorrowRecord,
  ): Observable<UIItem> {

    if (decision === 'approve') {
      if (borrowRecord.effectiveReturnDate && borrowRecord.effectiveReturnDate < borrowRecord.endDate) {
        borrowRecord.status = UIBorrowDetailedStatus.Returned_Early;
      } else if (borrowRecord.effectiveReturnDate && borrowRecord.effectiveReturnDate > borrowRecord.endDate) {
        borrowRecord.status = UIBorrowDetailedStatus.Returned_Late;
      } else {
        borrowRecord.status = UIBorrowDetailedStatus.Returned_OnTime;
      }
    } else {
      borrowRecord.status = UIBorrowDetailedStatus.Borrowed_Late;
    }

    item.borrowRecords = item.borrowRecords.map(record => {
      if (record.id === borrowRecord.id) {
        return borrowRecord;
      }
      return record;
    });
    this.notificationService.pushNewNotification({
      type: UINotificationType.ITEM_RETURN_APPROVED,
      payload: { item: item },
      destinationUserId: borrowRecord.borrowedBy,
    });
    return of(item);
  }

  pickupItem(
    item: UIItem,
    borrowRecord: UIBorrowRecord,
  ): Observable<UIItem> {
    borrowRecord.pickupDate = new Date();

    // Update the borrowRecord in the item's borrowRecords array
    const recordToUpdate = item.borrowRecords.find(record => record.id === borrowRecord.id);
    if (recordToUpdate) {
      recordToUpdate.pickupDate = borrowRecord.pickupDate;
    }

    if (borrowRecord.pickupDate < borrowRecord.startDate) {
      borrowRecord.status = UIBorrowDetailedStatus.Borrowed_Late;
    } else {
      borrowRecord.status = UIBorrowDetailedStatus.Borrowed_Active;
    }

    item.borrowRecords = item.borrowRecords.map(record => {
      if (record.id === borrowRecord.id) {
        return borrowRecord;
      }
      return record;
    });
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

  matchesStatuses(statuses: UIBorrowDetailedStatus[], borrowRecord: UIBorrowRecordStandalone): boolean {
    return statuses.includes(borrowRecord.status);
  }


}
