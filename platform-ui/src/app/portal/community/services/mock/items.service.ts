import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, of } from 'rxjs';
import { MockCategoriesService } from '../../../admin/services/mock/categories.service';
import { ItemsService, ItemWithRecords, UIBorrowItem, UIBorrowRecord, UIItem } from '../items.service';


@Injectable({
    providedIn: 'root',
})
export class MockItemsService implements ItemsService {

    getMyOwnedItems(): Observable<UIItem[]> {
        return of(this.items);
    }
    private index = 1;

    private items: UIItem[] = [
        {
            id: this.index++ + "",
            name: 'Harry Potter Book',
            located: 'ShareSpace',
            owner: 'TheOpenShelf',
            imageUrl: '/items/harry-potter.png',
            description: 'A magical adventure story that follows the journey of a young wizard and his friends.',
            shortDescription: 'A magical adventure story.',
            category: MockCategoriesService.BOOKS,
            favorite: true,
            borrowCount: 8
        },
        {
            id: this.index++ + "",
            name: 'Laptop XYZ',
            located: 'ShareSpace',
            owner: 'TheOpenShelf',
            imageUrl: '/items/terraforming-mars.png',
            description: 'High-performance laptop for work and play, featuring a sleek design and powerful specs.',
            shortDescription: 'High-performance laptop.',
            category: MockCategoriesService.ELECTRONICS,
            favorite: false,
            borrowCount: 2
        },
        {
            id: this.index++ + "",
            name: 'Cotton T-Shirt',
            located: 'ShareSpace',
            owner: 'TheOpenShelf',
            imageUrl: '/items/harry-potter.png',
            description: 'Comfortable cotton T-shirt, perfect for casual outings or lounging at home.',
            shortDescription: 'Comfortable cotton T-shirt.',
            category: MockCategoriesService.CLOTHING,
            favorite: false,
            borrowCount: 0
        },
        {
            id: this.index++ + "",
            name: 'Wireless Mouse',
            located: 'ShareSpace',
            owner: 'TheOpenShelf',
            imageUrl: '/items/terraforming-mars.png',
            description: 'Ergonomic wireless mouse designed for productivity and comfort during extended use.',
            shortDescription: 'Ergonomic wireless mouse.',
            category: MockCategoriesService.ELECTRONICS,
            favorite: true,
            borrowCount: 9
        },
        {
            id: this.index++ + "",
            name: 'Blue Jeans',
            located: 'ShareSpace',
            owner: 'TheOpenShelf',
            imageUrl: '/items/terraforming-mars.png',
            description: 'Stylish denim jeans that provide comfort and versatility for any occasion.',
            shortDescription: 'Stylish denim jeans.',
            category: MockCategoriesService.CLOTHING,
            favorite: false,
            borrowCount: 4
        },
        {
            id: this.index++ + "",
            name: 'Smartphone Pro',
            located: 'ShareSpace',
            owner: 'TheOpenShelf',
            imageUrl: '/items/harry-potter.png',
            description: 'Latest smartphone model with cutting-edge features and a sleek design.',
            shortDescription: 'Latest smartphone model.',
            category: MockCategoriesService.ELECTRONICS,
            favorite: false,
            borrowCount: 1
        },
        {
            id: this.index++ + "",
            name: 'The Great Gatsby',
            located: 'ShareSpace',
            owner: 'TheOpenShelf',
            imageUrl: '/items/terraforming-mars.png',
            description: 'A classic novel set in the Jazz Age, exploring themes of love, wealth, and the American dream.',
            shortDescription: 'Classic Jazz Age novel.',
            category: MockCategoriesService.BOOKS,
            favorite: false,
            borrowCount: 1
        },
        {
            id: this.index++ + "",
            name: 'Gaming Chair',
            located: 'ShareSpace',
            owner: 'TheOpenShelf',
            imageUrl: '/items/terraforming-mars.png',
            description: 'Comfortable chair designed for long gaming sessions with ergonomic support.',
            shortDescription: 'Ergonomic gaming chair.',
            category: MockCategoriesService.ELECTRONICS,
            favorite: false,
            borrowCount: 2
        },
        {
            id: this.index++ + "",
            name: 'Leather Wallet',
            located: 'ShareSpace',
            owner: 'TheOpenShelf',
            imageUrl: '/items/terraforming-mars.png',
            description: 'Sleek leather wallet with compartments for cards, cash, and coins.',
            shortDescription: 'Sleek leather wallet.',
            category: MockCategoriesService.CLOTHING,
            favorite: false,
            borrowCount: 3
        },
        {
            id: this.index++ + "",
            name: 'LED Desk Lamp',
            located: 'ShareSpace',
            owner: 'TheOpenShelf',
            imageUrl: '/items/terraforming-mars.png',
            description: 'Adjustable LED desk lamp with multiple brightness settings.',
            shortDescription: 'Adjustable LED lamp.',
            category: MockCategoriesService.ELECTRONICS,
            favorite: false,
            borrowCount: 18
        },
        {
            id: this.index++ + "",
            name: 'Winter Jacket',
            located: 'ShareSpace',
            owner: 'TheOpenShelf',
            imageUrl: '/items/terraforming-mars.png',
            description: 'Warm and durable jacket for cold weather, designed for style and comfort.',
            shortDescription: 'Warm winter jacket.',
            category: MockCategoriesService.CLOTHING,
            favorite: false,
            borrowCount: 0
        },
        {
            id: this.index++ + "",
            name: 'Cookbook Essentials',
            located: 'ShareSpace',
            owner: 'TheOpenShelf',
            imageUrl: '/items/terraforming-mars.png',
            description: 'A comprehensive cookbook filled with recipes for home chefs of all levels.',
            shortDescription: 'Comprehensive cookbook.',
            category: MockCategoriesService.BOOKS,
            favorite: false,
            borrowCount: 1
        },
    ];

    getItems(): Observable<UIItem[]> {
        return of(this.items);
    }

    getItemsWithRecords(): Observable<ItemWithRecords[]> {

        const test = this.items.map(item => {
            let borrowRecords: UIBorrowRecord[] = [];
            return this.getItemBorrowRecords(item.id).pipe(
                map(records => {
                    borrowRecords = records
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
        this.items.push(item);
        return of(item);
    }

    private borrowedItems: UIBorrowItem[] = [];

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