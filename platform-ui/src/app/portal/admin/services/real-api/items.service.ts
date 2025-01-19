import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  BorrowRecord,
  ItemsAdminApiService,
  ItemStat,
  PaginatedItemsStatsResponse,
} from '../../../../api-client';
import { UIBorrowRecord } from '../../../community/models/UIBorrowRecord';
import { ItemsService, UIItemWithStats, UIItemWithStatsPagination } from '../items.service';

@Injectable({
  providedIn: 'root',
})
export class ApiItemsService implements ItemsService {
  constructor(private itemsAdminApiService: ItemsAdminApiService) { }

  getItems(
    currentUser?: boolean,
    borrowedByCurrentUser?: boolean,
    libraryIds?: string[],
    categories?: string[],
    searchText?: string,
    currentlyAvailable?: boolean,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    page?: number,
    pageSize?: number,
  ): Observable<UIItemWithStatsPagination> {
    return this.itemsAdminApiService.getAdminItems().pipe(
      map((response: PaginatedItemsStatsResponse) => ({
        totalPages: response.totalPages,
        totalItems: response.totalItems,
        currentPage: response.currentPage,
        itemsPerPage: response.itemsPerPage,
        items: response.items.map(
          (item: ItemStat) =>
            ({
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
            }) as UIItemWithStats,
        ),
      })),
    );
  }

  getItem(id: string): Observable<UIItemWithStats> {
    return this.itemsAdminApiService.getAdminItemById(id).pipe(
      map(
        (item: ItemStat) =>
          ({
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
          }) as UIItemWithStats,
      ),
    );
  }

  addItem(item: UIItemWithStats): Observable<UIItemWithStats> {
    const itemStat: ItemStat = {
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

    return this.itemsAdminApiService.addAdminItem(itemStat).pipe(
      map(
        (item: ItemStat) =>
          ({
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
          }) as UIItemWithStats,
      ),
    );
  }
}
