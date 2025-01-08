import { Injectable } from '@angular/core';
import { forkJoin, map, mergeMap, Observable, of } from 'rxjs';
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

    getItems(
        currentUser?: boolean,
        borrowedByCurrentUser?: boolean,
        libraryIds?: string[],
        categories?: string[],
        searchText?: string,
        currentlyAvailable?: boolean,
        sortBy?: string,
        sortOrder: 'asc' | 'desc' = 'asc',
        page: number = 0,
        pageSize: number = 10
    ): Observable<UIItem[]> {
        let filteredItems = this.items;
        // Filtering logic
        if (currentUser) {
            filteredItems = filteredItems.filter(item => item.owner === 'me@example.com');
        }
        if (borrowedByCurrentUser) {
            filteredItems = filteredItems.filter(item =>
                this.borrowedItems.some(borrowedItem => borrowedItem.id === item.id)
            );
        }
        if (libraryIds && libraryIds.length > 0) {
            filteredItems = filteredItems.filter(item => libraryIds.includes(item.libraryId));
        }
        if (categories && categories.length > 0) {
            filteredItems = filteredItems.filter(item => categories.includes(item.category.name));
        }
        if (searchText) {
            const lowerCaseSearchText = searchText.toLowerCase();
            filteredItems = filteredItems.filter(item =>
                item.name.toLowerCase().includes(lowerCaseSearchText)
            );
        }
        if (currentlyAvailable) {
            filteredItems = filteredItems.filter(item =>
                !this.borrowedItems.some(borrowedItem => borrowedItem.id === item.id)
            );
        }

        // Sorting logic
        if (sortBy) {
            filteredItems = filteredItems.sort((a, b) => {
                const aValue = a[sortBy as keyof UIItem];
                const bValue = b[sortBy as keyof UIItem];
                if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
                return 0;
            });
        }

        // Pagination logic
        const startIndex = page * pageSize;
        const paginatedItems = filteredItems.slice(startIndex, startIndex + pageSize);

        return of(paginatedItems);
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
            map(items =>
                items.map(item =>
                    this.getItemBorrowRecords(item.id).pipe(
                        map(records => ({
                            ...item,
                            borrowRecords: records,
                            isBookedToday: records.some(record =>
                                record.startDate <= new Date().toISOString().split('T')[0] &&
                                new Date().toISOString().split('T')[0] <= record.endDate
                            ),
                            myBooking: records.find(record =>
                                record.borrowedBy === 'me@example.com' &&
                                record.startDate > new Date().toISOString().split('T')[0]
                            )
                        }))
                    ))
            ),
            mergeMap(observables =>
                observables.length ? forkJoin(observables) : of([])
            )
        );
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