import { Injectable } from '@angular/core';

export interface Item {
    id: string;
    name: string;
    imageUrl: string;
    description: string;
    shortDescription: string;
    category: string;
}

export interface Category {
    value: string;
    label: string;
}

export interface BorrowRecord {
    borrowedBy: string;
    startDate: string;
    endDate: string;
}

@Injectable({
    providedIn: 'root',
})
export class ItemsService {
    private index = 1;

    private items: Item[] = [
        {
            id: this.index++ + "",
            name: 'Harry Potter Book',
            imageUrl: '/terraforming-mars.png',
            description: 'A magical adventure story that follows the journey of a young wizard and his friends.',
            shortDescription: 'A magical adventure story.',
            category: 'books',
        },
        {
            id: this.index++ + "",
            name: 'Laptop XYZ',
            imageUrl: '/terraforming-mars.png',
            description: 'High-performance laptop for work and play, featuring a sleek design and powerful specs.',
            shortDescription: 'High-performance laptop.',
            category: 'electronics',
        },
        {
            id: this.index++ + "",
            name: 'Cotton T-Shirt',
            imageUrl: '/terraforming-mars.png',
            description: 'Comfortable cotton T-shirt, perfect for casual outings or lounging at home.',
            shortDescription: 'Comfortable cotton T-shirt.',
            category: 'clothing',
        },
        {
            id: this.index++ + "",
            name: 'Wireless Mouse',
            imageUrl: '/terraforming-mars.png',
            description: 'Ergonomic wireless mouse designed for productivity and comfort during extended use.',
            shortDescription: 'Ergonomic wireless mouse.',
            category: 'electronics',
        },
        {
            id: this.index++ + "",
            name: 'Blue Jeans',
            imageUrl: '/terraforming-mars.png',
            description: 'Stylish denim jeans that provide comfort and versatility for any occasion.',
            shortDescription: 'Stylish denim jeans.',
            category: 'clothing',
        },
        {
            id: this.index++ + "",
            name: 'Smartphone Pro',
            imageUrl: '/terraforming-mars.png',
            description: 'Latest smartphone model with cutting-edge features and a sleek design.',
            shortDescription: 'Latest smartphone model.',
            category: 'electronics',
        },
        {
            id: this.index++ + "",
            name: 'The Great Gatsby',
            imageUrl: '/terraforming-mars.png',
            description: 'A classic novel set in the Jazz Age, exploring themes of love, wealth, and the American dream.',
            shortDescription: 'Classic Jazz Age novel.',
            category: 'books',
        },
        {
            id: this.index++ + "",
            name: 'Gaming Chair',
            imageUrl: '/terraforming-mars.png',
            description: 'Comfortable chair designed for long gaming sessions with ergonomic support.',
            shortDescription: 'Ergonomic gaming chair.',
            category: 'electronics',
        },
        {
            id: this.index++ + "",
            name: 'Leather Wallet',
            imageUrl: '/terraforming-mars.png',
            description: 'Sleek leather wallet with compartments for cards, cash, and coins.',
            shortDescription: 'Sleek leather wallet.',
            category: 'clothing',
        },
        {
            id: this.index++ + "",
            name: 'LED Desk Lamp',
            imageUrl: '/terraforming-mars.png',
            description: 'Adjustable LED desk lamp with multiple brightness settings.',
            shortDescription: 'Adjustable LED lamp.',
            category: 'electronics',
        },
        {
            id: this.index++ + "",
            name: 'Winter Jacket',
            imageUrl: '/terraforming-mars.png',
            description: 'Warm and durable jacket for cold weather, designed for style and comfort.',
            shortDescription: 'Warm winter jacket.',
            category: 'clothing',
        },
        {
            id: this.index++ + "",
            name: 'Cookbook Essentials',
            imageUrl: '/terraforming-mars.png',
            description: 'A comprehensive cookbook filled with recipes for home chefs of all levels.',
            shortDescription: 'Comprehensive cookbook.',
            category: 'books',
        },
    ];

    getItems(): Item[] {
        return this.items;
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

        return [
            {
                borrowedBy: 'me@example.com',
                startDate: formatDate(addDays(today, 3)),
                endDate: formatDate(addDays(today, 6)),
            },
            {
                borrowedBy: 'someone_else@example.com',
                startDate: formatDate(addDays(today, 15)),
                endDate: formatDate(addDays(today, 22)),
            },
        ];
    }

    getCaterogies() {
        return [
            { value: 'books', label: 'Books' },
            { value: 'electronics', label: 'Electronics' },
            { value: 'clothing', label: 'Clothing' },
        ];
    }

    addItem(item: Item): Item {
        item.id = this.index++ + "";
        this.items.push(item);
        return item;
    }
}