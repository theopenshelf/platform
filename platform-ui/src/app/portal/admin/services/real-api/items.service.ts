import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  ItemsAdminApiService,
  ItemStat,
  PaginatedItemsStatsResponse,
} from '../../../../api-client';
import { ItemsService, UIItem, UIItemsPagination } from '../items.service';

@Injectable({
  providedIn: 'root',
})
export class ApiItemsService implements ItemsService {
  constructor(private itemsAdminApiService: ItemsAdminApiService) {}

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
  ): Observable<UIItemsPagination> {
    return this.itemsAdminApiService.getAdminItems().pipe(
      map((response: PaginatedItemsStatsResponse) => ({
        totalPages: response.totalPages,
        totalItems: response.totalItems,
        currentPage: response.currentPage,
        itemsPerPage: response.itemsPerPage,
        items: response.items.map(
          (item: ItemStat) =>
            ({
              id: item.id,
              name: item.name,
              description: item.description,
              category: item.category,
              owner: item.owner,
              imageUrl: item.imageUrl,
              shortDescription: item.shortDescription,
              favorite: item.favorite,
              borrowCount: item.borrowCount,
              lateReturnPercentage: item.lateReturnPercentage,
              averageDuration: item.averageDuration,
              state: item.state,
              libraryId: item.libraryId,
              createdAt: new Date(item.createdAt),
              located: item.located,
            }) as UIItem,
        ),
      })),
    );
  }

  getItem(id: string): Observable<UIItem> {
    return this.itemsAdminApiService.getAdminItemById(id).pipe(
      map(
        (item: ItemStat) =>
          ({
            id: item.id,
            name: item.name,
            description: item.description,
            category: item.category,
            owner: item.owner,
            imageUrl: item.imageUrl,
            shortDescription: item.shortDescription,
            favorite: item.favorite,
            borrowCount: item.borrowCount,
            lateReturnPercentage: item.lateReturnPercentage,
            averageDuration: item.averageDuration,
            state: item.state,
            libraryId: item.libraryId,
            createdAt: new Date(item.createdAt),
            located: item.located,
          }) as UIItem,
      ),
    );
  }

  addItem(item: UIItem): Observable<UIItem> {
    const itemStat: ItemStat = {
      ...item,
      createdAt: new Date().toISOString(),
      libraryId: item.libraryId || '',
    };

    return this.itemsAdminApiService.addAdminItem(itemStat).pipe(
      map(
        (item: ItemStat) =>
          ({
            ...item,
            createdAt: new Date(item.createdAt),
          }) as UIItem,
      ),
    );
  }
}
