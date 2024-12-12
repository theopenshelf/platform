import { Injectable } from '@angular/core';
import { UIBorrowItem, UIBorrowRecord, UIItem, ItemsService, ItemWithRecords } from '../items.service';
import { MockCategoriesService } from '../../../admin/services/mock/categories.service';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { BorrowItem, BorrowRecord, Item, ItemsApiService } from '../../../../api-client';


@Injectable({
    providedIn: 'root',
})
export class APIItemsService implements ItemsService {
    constructor(private itemsApiService: ItemsApiService) {}

    getMyOwnedItems():  Observable<UIItem[]> {
        return this.itemsApiService.getItems(true).pipe(
            map((items: Item[]) => items.map((item: Item) => ({
                id: item.id,
                name: item.name,
                located: item.located,
                owner: item.owner,
                imageUrl: item.imageUrl,
                description: item.description,
                shortDescription: item.shortDescription,
                category: item.category
            } as UIItem)))
        );
    }

    getItems(): Observable<UIItem[]> {
        return this.itemsApiService.getItems(false).pipe(
            map((items: Item[]) => items.map((item: Item) => ({
                id: item.id,
                name: item.name,
                located: item.located,
                owner: item.owner,
                imageUrl: item.imageUrl,
                description: item.description,
                shortDescription: item.shortDescription,
                category: item.category
            } as UIItem)))
        );
    }

    getItemsWithRecords(): Observable<ItemWithRecords[]> {

        return this.getItems().pipe(
            switchMap((items: UIItem[]) => {
                const test = items.map(item => {
                    let borrowRecords: UIBorrowRecord[] = [];
                    return this.getItemBorrowRecords(item.id).pipe(
                        map(records => {
                            borrowRecords = records;
                            const today = new Date().toISOString().split('T')[0];

                            const itemWithRecords: ItemWithRecords = {
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
                category: item.category
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
        return this.itemsApiService.addItem(item).pipe(
            map((item: Item) => ({
                id: item.id,
                name: item.name,
                located: item.located,
                owner: item.owner,
                imageUrl: item.imageUrl,
                description: item.description,
                shortDescription: item.shortDescription,
                category: item.category
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
            map((item: UIItem) => ({
                ...item,
                record: (item as BorrowItem).record
            } as UIBorrowItem))
        );
    }
    markAsFavorite(item: UIItem): Observable<void> {
        return this.itemsApiService.markAsFavorite(item.id).pipe(
            map(() => undefined)
        );
    }
}