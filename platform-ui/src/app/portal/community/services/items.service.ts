import { Observable } from 'rxjs';
import { UIBorrowItem } from '../models/UIBorrowItem';
import { UIBorrowRecord } from '../models/UIBorrowRecord';
import { UIItem } from '../models/UIItem';
import { UIItemWithRecords } from '../models/UIItemWithRecords';

export interface ItemsService {
    getMyOwnedItems(): Observable<UIItem[]>;
    getItems(
        currentUser?: boolean,
        borrowedByCurrentUser?: boolean,
        libraryIds?: string[],
        categories?: string[],
        searchText?: string,
        currentlyAvailable?: boolean,
        sortBy?: string,
        sortOrder?: string,
        page?: number,
        pageSize?: number
    ): Observable<UIItem[]>;
    getItemsByLibrary(libraryId: string): Observable<UIItemWithRecords[]>;
    getItemsWithRecords(
        currentUser?: boolean,
        borrowedByCurrentUser?: boolean,
        libraryIds?: string[],
        categories?: string[],
        searchText?: string,
        currentlyAvailable?: boolean,
        sortBy?: string,
        sortOrder?: string,
        page?: number,
        pageSize?: number
    ): Observable<UIItemWithRecords[]>;
    getItem(id: string): Observable<UIItem>;
    getItemBorrowRecords(id: string): Observable<UIBorrowRecord[]>;
    addItem(item: UIItem): Observable<UIItem>;
    borrowItem(item: UIItem, startDate: string, endDate: string): Observable<UIBorrowItem>;
    getMyBorrowItems(): Observable<UIBorrowItem[]>;
    cancelReservation(borrowRecord: UIBorrowItem): Observable<void>;
    getMyBorrowItem(id: string): Observable<UIBorrowItem | null>;
    markAsFavorite(item: UIItem): Observable<void>;
}