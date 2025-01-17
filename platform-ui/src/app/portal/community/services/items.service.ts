import { Observable } from 'rxjs';
import { UIBorrowRecord } from '../models/UIBorrowRecord';
import { UIBorrowStatus } from '../models/UIBorrowStatus';
import { UIItem } from '../models/UIItem';
import { UIItemsPagination } from '../models/UIItemsPagination';

export interface GetItemsParams {
  currentUser?: boolean;
  borrowedByCurrentUser?: boolean;
  status?: UIBorrowStatus;
  libraryIds?: string[];
  categories?: string[];
  searchText?: string;
  currentlyAvailable?: boolean;
  sortBy?:  'favorite' | 'createdAt' | 'borrowCount' | undefined;
  sortOrder?: 'asc' | 'desc' | undefined;
  page?: number;
  pageSize?: number;
  startDate?: Date;
  endDate?: Date;
  favorite?: boolean;
}


export interface ItemsService {
  getItems(params: GetItemsParams): Observable<UIItemsPagination>;
  getItem(id: string): Observable<UIItem>;
  addItem(item: UIItem): Observable<UIItem>;
  borrowItem(
    item: UIItem,
    startDate: string,
    endDate: string,
  ): Observable<UIItem>;

  cancelReservation(
    item: UIItem,
    borrowRecord: UIBorrowRecord,
  ): Observable<UIItem>;
  markAsFavorite(item: UIItem): Observable<void>;
}
