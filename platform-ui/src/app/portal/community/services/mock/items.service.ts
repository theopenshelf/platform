import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, of } from 'rxjs';
import { UIBorrowItem } from '../../models/UIBorrowItem';
import { UIBorrowRecord } from '../../models/UIBorrowRecord';
import { UIItem } from '../../models/UIItem';
import { UIItemWithRecords } from '../../models/UIItemWithRecords';
import { ItemsService } from '../items.service';
import { loadItems } from './items-loader';


@Injectable({
    providedIn: 'root',
})
export class MockItemsService implements ItemsService {

    private index = 1;

    private items: UIItem[] = loadItems();

    getMyOwnedItems(): Observable<UIItem[]> {
        return of(this.items);
    }

    getItems(): Observable<UIItem[]> {
        return of(this.items);
    }

    getItemsByLibrary(libraryId: string): Observable<UIItemWithRecords[]> {
        const test = this.items.map(item => {
            let borrowRecords: UIBorrowRecord[] = [];
            return this.getItemBorrowRecords(item.id).pipe(
                map(records => {
                    borrowRecords = records
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
    }

    getItemsWithRecords(): Observable<UIItemWithRecords[]> {

        const test = this.items.map(item => {
            let borrowRecords: UIBorrowRecord[] = [];
            return this.getItemBorrowRecords(item.id).pipe(
                map(records => {
                    borrowRecords = records
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
    }

    getItem(id: string): Observable<UIItem> {
        return of(this.items.find((i) => i.id === id) as UIItem);
    }

    getItemBorrowRecords(id: string): Observable<UIBorrowRecord[]> {
        const today = new Date();

        const addDays = (date: Date, days: number): Date => {
            const newDate = new Date(date);
            newDate.setDate(newDate.getDate() + days);
            return newDate;
        };

        const formatDate = (date: Date): string =>
            date.toISOString().split('T')[0]; // YYYY-MM-DD format
        const records = [
            {
                id: '1',
                borrowedBy: 'someone_else@example.com',
                startDate: formatDate(addDays(today, 15)),
                endDate: formatDate(addDays(today, 22)),
            },
        ];

        return this.getMyBorrowItem(id).pipe(
            map(myBorrowItem => {
                if (myBorrowItem) {
                    records.push(myBorrowItem.record);
                }
                return records;
            })
        );
    }


    addItem(item: UIItem): Observable<UIItem> {
        item.id = this.index++ + "";
        item.createdAt = new Date();
        this.items.push(item);
        return of(item);
    }

    private borrowedItems: UIBorrowItem[] = [
        {
            ...this.items[0],
            record: { id: '1', borrowedBy: 'me@example.com', startDate: '2024-01-01', endDate: '2024-01-07' }
        },
        {
            ...this.items[2],
            record: { id: '2', borrowedBy: 'me@example.com', startDate: '2024-01-01', endDate: '2024-01-07' }
        }
    ];

    borrowItem(item: UIItem, startDate: string, endDate: string): Observable<UIBorrowItem> {
        const borrowedItem = {
            ...item,
            record: { borrowedBy: 'me@example.com', startDate, endDate }
        } as UIBorrowItem;

        this.borrowedItems.push(borrowedItem);
        return of(borrowedItem);
    }

    getMyBorrowItems(): Observable<UIBorrowItem[]> {
        return of(this.borrowedItems);
    }

    cancelReservation(borrowRecord: UIBorrowItem): Observable<void> {
        const index = this.borrowedItems.findIndex(item => item.id === borrowRecord.id);
        if (index !== -1) {
            this.borrowedItems.splice(index, 1);
        }
        return of(undefined);
    }

    getMyBorrowItem(id: string): Observable<UIBorrowItem | null> {
        const item = this.borrowedItems.find(item => item.id === id);
        if (!item) {
            return of(null);
        }
        return of(item);
    }

    markAsFavorite(item: UIItem): Observable<void> {
        item.favorite = !item.favorite;
        return of(undefined);
    }

}