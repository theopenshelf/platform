import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { BorrowItem, BorrowRecord, Item, ItemsCommunityApiService } from '../../../../api-client';
import { UIBorrowItem } from '../../models/UIBorrowItem';
import { UIBorrowRecord } from '../../models/UIBorrowRecord';
import { UIItem } from '../../models/UIItem';
import { UIItemWithRecords } from '../../models/UIItemWithRecords';
import { ItemsService } from '../items.service';


@Injectable({
    providedIn: 'root',
})
export class APIItemsService implements ItemsService {
    constructor(private itemsApiService: ItemsCommunityApiService) { }

    getMyOwnedItems(): Observable<UIItem[]> {
        return this.itemsApiService.getItems(true).pipe(
            map((items: Item[]) => items.map((item: Item) => ({
                id: item.id,
                name: item.name,
                located: item.located,
                owner: item.owner,
                imageUrl: item.imageUrl,
                description: item.description,
                shortDescription: item.shortDescription,
                category: item.category,
                libraryId: item.libraryId,
                createdAt: new Date(item.createdAt)
            } as UIItem)))
        );
    }
    getItems(
        currentUser?: boolean,
        borrowedByCurrentUser?: boolean,
        libraryIds?: string[],
        categories?: string[],
        searchText?: string,
        currentlyAvailable?: boolean,
        sortBy?: 'createdAt' | 'borrowCount' | 'favorite',
        sortOrder?: 'asc' | 'desc',
        page: number = 1,
        pageSize: number = 10
    ): Observable<UIItem[]> {
        return this.itemsApiService.getItems(
            currentUser,
            borrowedByCurrentUser,
            libraryIds,
            categories,
            searchText,
            currentlyAvailable,
            sortBy,
            sortOrder,
            page,
            pageSize
        ).pipe(
            map((items: Item[]) => items.map((item: Item) => ({
                id: item.id,
                name: item.name,
                located: item.located,
                owner: item.owner,
                imageUrl: item.imageUrl,
                description: item.description,
                shortDescription: item.shortDescription,
                category: item.category,
                libraryId: item.libraryId,
                createdAt: new Date(item.createdAt)
            } as UIItem)))
        );
    }

    getItemsByLibrary(libraryId: string): Observable<UIItemWithRecords[]> {
        return this.itemsApiService.getItems(false, false, [libraryId]).pipe(
            map((items: Item[]) => items.map((item: Item) => ({
                id: item.id,
                name: item.name,
                located: item.located,
                owner: item.owner,
                imageUrl: item.imageUrl,
                description: item.description,
                shortDescription: item.shortDescription,
                category: item.category,
                createdAt: new Date(item.createdAt)
            } as UIItem)))
        ).pipe(
            switchMap((items: UIItem[]) => {
                const test = items.map(item => {
                    let borrowRecords: UIBorrowRecord[] = [];
                    return this.getItemBorrowRecords(item.id).pipe(
                        map(records => {
                            borrowRecords = records;
                            const today = new Date().toISOString().split('T')[0];

                            const itemWithRecords: UIItemWithRecords = {
                                ...item,
                                borrowRecords,
                                isBookedToday: borrowRecords.some(record =>
                                    record.startDate <= today && today <= record.endDate
                                ),
                                myBooking: borrowRecords.find(record =>
                                    record.borrowedBy === 'me@example.com' && record.startDate > today
                                )
                            };

                            return itemWithRecords;
                        })
                    );
                });
                return forkJoin(test);
            })
        );
    }

    getItemsWithRecords(
        currentUser?: boolean,
        borrowedByCurrentUser?: boolean,
        libraryIds?: string[],
        categories?: string[],
        searchText?: string,
        currentlyAvailable?: boolean,
        sortBy?: 'createdAt' | 'borrowCount' | 'favorite',
        sortOrder?: 'asc' | 'desc',
        page: number = 1,
        pageSize: number = 10
    ): Observable<UIItemWithRecords[]> {
        return this.getItems(
            currentUser,
            borrowedByCurrentUser,
            libraryIds,
            categories,
            searchText,
            currentlyAvailable,
            sortBy,
            sortOrder,
            page,
            pageSize
        ).pipe(
            switchMap((items: UIItem[]) => {
                const test = items.map(item => {
                    let borrowRecords: UIBorrowRecord[] = [];
                    return this.getItemBorrowRecords(item.id).pipe(
                        map(records => {
                            borrowRecords = records;
                            const today = new Date().toISOString().split('T')[0];

                            const itemWithRecords: UIItemWithRecords = {
                                ...item,
                                borrowRecords,
                                isBookedToday: borrowRecords.some(record =>
                                    record.startDate <= today && today <= record.endDate
                                ),
                                myBooking: borrowRecords.find(record =>
                                    record.borrowedBy === 'me@example.com' && record.startDate > today
                                )
                            };

                            return itemWithRecords;
                        })
                    );
                });
                return forkJoin(test);
            })
        );
    }

    getItem(id: string): Observable<UIItem> {
        return this.itemsApiService.getItem(id).pipe(
            map((item: Item) => ({
                id: item.id,
                name: item.name,
                located: item.located,
                owner: item.owner,
                imageUrl: item.imageUrl,
                description: item.description,
                shortDescription: item.shortDescription,
                category: item.category,
                createdAt: new Date(item.createdAt)
            } as UIItem))
        );
    }

    getItemBorrowRecords(id: string): Observable<UIBorrowRecord[]> {
        return this.itemsApiService.getItemBorrowRecords(id).pipe(
            map((records: BorrowRecord[]) => records.map((record: BorrowRecord) => ({
                id: id,
                startDate: record.startDate,
                endDate: record.endDate,
                item: this.itemsApiService.getItem(id),
                borrowedBy: record.borrowedBy
            } as UIBorrowRecord)))
        );
    }

    addItem(item: UIItem): Observable<UIItem> {
        return this.itemsApiService.addItem({
            ...item,
            createdAt: item.createdAt.toISOString()
        } as Item).pipe(
            map((item: Item) => ({
                id: item.id,
                name: item.name,
                located: item.located,
                owner: item.owner,
                imageUrl: item.imageUrl,
                description: item.description,
                shortDescription: item.shortDescription,
                category: item.category,
                createdAt: new Date(item.createdAt)
            } as UIItem))
        );
    }
    borrowItem(item: UIItem, startDate: string, endDate: string): Observable<UIBorrowItem> {
        return this.itemsApiService.borrowItem(item.id, { startDate, endDate }).pipe(
            map((borrowItem: BorrowItem) => ({
                id: borrowItem.id,
                name: borrowItem.name,
                located: borrowItem.located,
                owner: borrowItem.owner,
                imageUrl: borrowItem.imageUrl,
                description: borrowItem.description,
                shortDescription: borrowItem.shortDescription,
                category: borrowItem.category,
                createdAt: new Date(borrowItem.createdAt),
                record: {
                    borrowedBy: borrowItem.record.borrowedBy,
                    startDate: borrowItem.record.startDate,
                    endDate: borrowItem.record.endDate
                }
            } as UIBorrowItem))
        );
    }

    getMyBorrowItems(): Observable<UIBorrowItem[]> {
        return this.itemsApiService.getItems(false, true).pipe(
            map((items: Item[]) => items.map((item: Item) => ({
                id: item.id,
                name: item.name,
                located: item.located,
                owner: item.owner,
                imageUrl: item.imageUrl,
                description: item.description,
                shortDescription: item.shortDescription,
                category: item.category,
                createdAt: new Date(item.createdAt),
                record: (item as BorrowItem).record
            } as UIBorrowItem)))
        );
    }

    cancelReservation(borrowRecord: UIBorrowItem): Observable<void> {
        return this.itemsApiService.deleteBorrowRecord(borrowRecord.id, borrowRecord.record.id).pipe(
            map(() => undefined)
        );
    }

    getMyBorrowItem(id: string): Observable<UIBorrowItem | null> {
        return this.getItem(id).pipe(
            map((item: UIItem) => {
                const borrowItem = item as unknown as BorrowItem;
                return {
                    ...item,
                    record: borrowItem.record
                } as UIBorrowItem;
            })
        );
    }
    markAsFavorite(item: UIItem): Observable<void> {
        return this.itemsApiService.markAsFavorite(item.id).pipe(
            map(() => undefined)
        );
    }
}