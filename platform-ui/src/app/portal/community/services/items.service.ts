import { Observable } from 'rxjs';
import { UIBorrowRecord } from '../models/UIBorrowRecord';
import { UIBorrowRecordsPagination } from '../models/UIBorrowRecordsPagination';
import { UIBorrowDetailedStatus } from '../models/UIBorrowStatus';
import { UIItem } from '../models/UIItem';
import { UIItemsPagination } from '../models/UIItemsPagination';
import { UIUser } from '../models/UIUser';

export interface GetItemsParams {
  itemId?: string;
  currentUser?: boolean;
  borrowedByCurrentUser?: boolean;
  borrowedBy?: string;
  statuses?: UIBorrowDetailedStatus[];
  libraryIds?: string[];
  categories?: string[];
  searchText?: string;
  currentlyAvailable?: boolean;
  sortBy?: 'favorite' | 'createdAt' | 'borrowCount' | 'pickupDate' | 'reservationDate' | 'startDate' | 'endDate' | 'returnDate' | undefined;
  sortOrder?: 'asc' | 'desc' | undefined;
  page?: number;
  pageSize?: number;
  startDate?: Date;
  endDate?: Date;
  favorite?: boolean;
}


export interface ItemsService {
  getItems(params: GetItemsParams): Observable<UIItemsPagination>;
  getBorrowRecords(params: GetItemsParams): Observable<UIBorrowRecordsPagination>;
  getItem(id: string): Observable<UIItem>;
  addItem(item: UIItem): Observable<UIItem>;
  borrowItem(
    item: UIItem,
    startDate: string,
    endDate: string,
    borrowBy?: UIUser,
  ): Observable<UIItem>;

  pickupItem(
    item: UIItem,
    borrowRecord: UIBorrowRecord,
  ): Observable<UIItem>;

  cancelReservation(
    item: UIItem,
    borrowRecord: UIBorrowRecord,
  ): Observable<UIItem>;
  returnItem(
    item: UIItem,
    borrowRecord: UIBorrowRecord,
  ): Observable<UIItem>;
  markAsFavorite(item: UIItem): Observable<void>;

}
