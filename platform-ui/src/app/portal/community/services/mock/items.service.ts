import { Injectable } from '@angular/core';
import { BorrowItem, BorrowRecord, Item, ItemsService, ItemWithRecords } from '../items.service';
import { MockCategoriesService } from '../../../admin/services/mock/categories.service';


@Injectable({
    providedIn: 'root',
})
export class MockItemsService implements ItemsService {

    getMyOwnedItems(): Item[] {
        return this.items;
    }
    private index = 1;

    private items: Item[] = [
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

    getItems(): Item[] {
        return this.items;
    }

    getItemsWithRecords(): ItemWithRecords[] {

        return this.items.map(item => {
            const borrowRecords = this.getItemBorrowRecords(item.id);
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
        });
    }

    getItem(id: string): Item {
        return this.items.find((i) => i.id === id) as Item;
    }

    getItemBorrowRecords(id: string): BorrowRecord[] {
        const today = new Date();

        const addDays = (date: Date, days: number): Date => {
            const newDate = new Date(date);
            newDate.setDate(newDate.getDate() + days);
            return newDate;
        };

        const formatDate = (date: Date): string =>
            date.toISOString().split('T')[0]; // YYYY-MM-DD format
        const myBorrowItem = this.getMyBorrowItem(id);
        const records = [
            {
                borrowedBy: 'someone_else@example.com',
                startDate: formatDate(addDays(today, 15)), 
                endDate: formatDate(addDays(today, 22)),
            },
        ];

        if (myBorrowItem) {
            records.push(myBorrowItem.record);
        }

        return records;
    }


    addItem(item: Item): Item {
        item.id = this.index++ + "";
        this.items.push(item);
        return item;
    }

    private borrowedItems: BorrowItem[] = [];

    borrowItem(item: Item, startDate: string, endDate: string): BorrowItem {
        const borrowedItem = {
            ...item,
            record: { borrowedBy: 'me@example.com', startDate, endDate }
        } as BorrowItem;
        
        this.borrowedItems.push(borrowedItem);
        return borrowedItem;
    }

    getMyBorrowItems(): BorrowItem[] {
        return this.borrowedItems;
    }

    cancelReservation(borrowRecord: BorrowItem) {
        const index = this.borrowedItems.findIndex(item => item.id === borrowRecord.id);
        if (index !== -1) {
            this.borrowedItems.splice(index, 1);
        }
    }
    
    getMyBorrowItem(id: string): BorrowItem | null {
        const item = this.borrowedItems.find(item => item.id === id);
        if (!item) {
           return null;
        }
        return item;
    }

    markAsFavorite(item: Item) {
        item.favorite = !item.favorite;
    }

}