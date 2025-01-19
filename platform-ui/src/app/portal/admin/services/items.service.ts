import { Observable } from 'rxjs';
import { UIItem } from '../../community/models/UIItem';

export interface UIItemWithStats extends UIItem {

  borrowCount: number;
  lateReturnPercentage: number;
  averageDuration: number;
}

export interface UIItemWithStatsPagination {
  totalPages: number;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  items: UIItemWithStats[];
}

export interface ItemsService {
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
  ): Observable<UIItemWithStatsPagination>;
  getItem(id: string): Observable<UIItemWithStats>;
  addItem(item: UIItem): Observable<UIItemWithStats>;
}
