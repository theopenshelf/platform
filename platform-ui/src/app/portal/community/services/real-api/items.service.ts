import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  BorrowRecord,
  Item,
  ItemsCommunityApiService,
} from '../../../../api-client';
import { UIBorrowRecord } from '../../models/UIBorrowRecord';
import { UIBorrowStatus } from '../../models/UIBorrowStatus';
import { UIItem } from '../../models/UIItem';
import { UIItemsPagination } from '../../models/UIItemsPagination';
import { GetItemsParams, ItemsService } from '../items.service';

@Injectable({
  providedIn: 'root',
})
export class APIItemsService implements ItemsService {
  constructor(private itemsApiService: ItemsCommunityApiService) { }

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
      sortOrder,
      page = 1,
      pageSize = 10,
      startDate,
      endDate,
      favorite,
    } = params;

    const statusMapping: Record<
      UIBorrowStatus,
      'returned' | 'borrowed' | 'reserved'
    > = {
      [UIBorrowStatus.Returned]: 'returned',
      [UIBorrowStatus.CurrentlyBorrowed]: 'borrowed',
      [UIBorrowStatus.Reserved]: 'reserved',
    };

    const statusValue: 'returned' | 'borrowed' | 'reserved' | undefined = status
      ? statusMapping[status]
      : undefined;
    return this.itemsApiService
      .getItems(
        currentUser,
        borrowedByCurrentUser,
        libraryIds,
        categories,
        searchText,
        currentlyAvailable,
        sortBy,
        sortOrder,
        page,
        pageSize,
        startDate?.toISOString(),
        endDate?.toISOString(),
        statusValue,
        favorite,
      )
      .pipe(
        map((response) => ({
          totalPages: response.totalPages,
          totalItems: response.totalItems,
          currentPage: response.currentPage,
          itemsPerPage: response.itemsPerPage,
          items: response.items.map(
            (item: Item) =>
              ({
                id: item.id,
                name: item.name,
                located: item.located,
                owner: item.owner,
                imageUrl: item.imageUrl,
                description: item.description,
                shortDescription: item.shortDescription,
                category: item.category,
                libraryId: item.libraryId,
                createdAt: item.createdAt
                  ? new Date(item.createdAt)
                  : undefined,
              }) as UIItem,
          ),
        })),
      );
  }

  getItem(id: string): Observable<UIItem> {
    return this.itemsApiService.getItem(id).pipe(
      map(
        (item: Item) =>
          ({
            id: item.id,
            name: item.name,
            located: item.located,
            owner: item.owner,
            imageUrl: item.imageUrl,
            description: item.description,
            shortDescription: item.shortDescription,
            category: item.category,
            createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
          }) as UIItem,
      ),
    );
  }

  addItem(item: UIItem): Observable<UIItem> {
    const apiItem = {
      ...item,
      borrowRecords: item.borrowRecords.map(
        (record: UIBorrowRecord) =>
          ({
            id: record.id,
            startDate: record.startDate
              ? record.startDate.toISOString()
              : undefined,
            endDate: record.endDate ? record.endDate.toISOString() : undefined,
            borrowedBy: record.borrowedBy,
          }) as BorrowRecord,
      ),
      createdAt: item.createdAt?.toISOString(),
    };

    return this.itemsApiService.addItem(apiItem).pipe(
      map((item: Item) => ({
        ...item,
        createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
        borrowRecords: item.borrowRecords.map(
          (record: BorrowRecord) =>
            ({
              id: record.id,
              startDate: record.startDate
                ? new Date(record.startDate)
                : undefined,
              endDate: record.endDate ? new Date(record.endDate) : undefined,
              borrowedBy: record.borrowedBy,
            }) as UIBorrowRecord,
        ),
        isBookedToday: item.isBookedToday,
        myBooking: undefined,
      })),
    );
  }

  borrowItem(
    item: UIItem,
    startDate: string,
    endDate: string,
  ): Observable<UIItem> {
    return this.itemsApiService
      .borrowItem(item.id, { startDate, endDate })
      .pipe(
        map((item: Item) => ({
          ...item,
          createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
          borrowRecords: item.borrowRecords.map(
            (record: BorrowRecord) =>
              ({
                id: record.id,
                startDate: record.startDate
                  ? new Date(record.startDate)
                  : undefined,
                endDate: record.endDate ? new Date(record.endDate) : undefined,
                borrowedBy: record.borrowedBy,
              }) as UIBorrowRecord,
          ),
          isBookedToday: item.isBookedToday,
          myBooking: undefined,
        })),
      );
  }

  cancelReservation(
    item: UIItem,
    borrowRecord: UIBorrowRecord,
  ): Observable<UIItem> {
    return this.itemsApiService
      .deleteBorrowRecord(item.id, borrowRecord.id)
      .pipe(map(() => item));
  }

  markAsFavorite(item: UIItem): Observable<void> {
    return this.itemsApiService
      .markAsFavorite(item.id)
      .pipe(map(() => undefined));
  }
}
