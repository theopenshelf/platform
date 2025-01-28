import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  BorrowRecord,
  BorrowRecordsCommunityApiService,
  BorrowRecordStandalone,
  Item,
  ItemsCommunityApiService,
} from '../../../../api-client';
import { UIBorrowRecord } from '../../models/UIBorrowRecord';
import { UIBorrowRecordsPagination, UIBorrowRecordStandalone } from '../../models/UIBorrowRecordsPagination';
import { UIBorrowStatus } from '../../models/UIBorrowStatus';
import { UIItem } from '../../models/UIItem';
import { UIItemsPagination } from '../../models/UIItemsPagination';
import { GetItemsParams, ItemsService } from '../items.service';

@Injectable({
  providedIn: 'root',
})
export class APIItemsService implements ItemsService {
  constructor(private itemsApiService: ItemsCommunityApiService, private borrowRecordsApiService: BorrowRecordsCommunityApiService) { }

  getItems(params: GetItemsParams): Observable<UIItemsPagination> {
    const {
      currentUser,
      borrowedByCurrentUser,
      borrowedBy,
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

    let sortByValue: 'createdAt' | 'borrowCount' | 'favorite' | undefined;
    switch (sortBy) {
      case 'createdAt':
        sortByValue = 'createdAt';
        break;
      case 'borrowCount':
        sortByValue = 'borrowCount';
        break;
      case 'favorite':
        sortByValue = 'favorite';
        break;
      default:
        sortByValue = undefined;
        break;
    }


    return this.itemsApiService
      .getItems(
        currentUser,
        borrowedByCurrentUser,
        borrowedBy,
        libraryIds,
        categories,
        searchText,
        currentlyAvailable,
        sortByValue,
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

  getBorrowRecords(params: GetItemsParams): Observable<UIBorrowRecordsPagination> {
    const {
      currentUser,
      borrowedByCurrentUser,
      borrowedBy,
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

    let sortByValue: 'reservationDate' | 'startDate' | 'endDate' | 'returnDate' | undefined;
    switch (sortBy) {
      case 'reservationDate':
        sortByValue = 'reservationDate';
        break;
      case 'startDate':
        sortByValue = 'startDate';
        break;
      case 'endDate':
        sortByValue = 'endDate';
        break;
      case 'returnDate':
        sortByValue = 'returnDate';
        break;
      default:
        sortByValue = undefined;
        break;
    }

    const statusValue: 'returned' | 'borrowed' | 'reserved' | undefined = status
      ? statusMapping[status]
      : undefined;
    return this.borrowRecordsApiService
      .getBorrowRecords(
        currentUser,
        borrowedByCurrentUser,
        borrowedBy,
        sortByValue,
        sortOrder,
        libraryIds,
        categories,
        searchText,
        page,
        pageSize,
        statusValue,
        favorite,
      )
      .pipe(
        map((response) => ({
          totalPages: response.totalPages,
          totalItems: response.totalItems,
          currentPage: response.currentPage,
          itemsPerPage: response.recordsPerPage,
          items: response.records.map(
            (record: BorrowRecordStandalone) =>
              ({
                ...record,
                startDate: record.startDate
                  ? new Date(record.startDate)
                  : undefined,
                endDate: record.endDate ? new Date(record.endDate) : undefined,
                reservationDate: record.reservationDate
                  ? new Date(record.reservationDate)
                  : undefined,
                effectiveReturnDate: record.effectiveReturnDate
                  ? new Date(record.effectiveReturnDate)
                  : undefined,
                item: ({
                  id: record.item.id,
                  name: record.item.name,
                  located: record.item.located,
                  owner: record.item.owner,
                  imageUrl: record.item.imageUrl,
                  description: record.item.description,
                  shortDescription: record.item.shortDescription,
                  category: record.item.category,
                  libraryId: record.item.libraryId,
                  createdAt: record.item.createdAt
                    ? new Date(record.item.createdAt)
                    : undefined,
                }) as UIItem,
              }) as UIBorrowRecordStandalone,
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
            reservationDate: record.reservationDate
              ? record.reservationDate.toISOString()
              : undefined,
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
              reservationDate: record.reservationDate
                ? new Date(record.reservationDate)
                : undefined,
              borrowedBy: record.borrowedBy,
            }) as UIBorrowRecord,
        ),
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
                reservationDate: new Date()
              }) as UIBorrowRecord,
          ),
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
