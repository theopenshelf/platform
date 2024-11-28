import { Injectable } from '@angular/core';

export interface Item {
    id: string;
    name: string;
    located: string;
    owner: string;
    imageUrl: string;
    description: string;
    shortDescription: string;
    category: string;
    favorite: boolean;
    borrowCount: number;
    lateReturnPercentage: number;
    averageDuration: number;
    state: { label: string, statusColor: string };  
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

export interface BorrowItem extends Item {
    record: BorrowRecord;
}

@Injectable({
    providedIn: 'root',
})
export class ItemsService {
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
            category: 'books',
            favorite: true,
            borrowCount: 8,
            lateReturnPercentage: 5,
            averageDuration: 14,
            state: { label: 'Available', statusColor: 'positive' },
        },
        {
            id: this.index++ + "",
            name: 'Laptop XYZ',
            located: 'ShareSpace',
            owner: 'TheOpenShelf',
            imageUrl: '/items/terraforming-mars.png',
            description: 'High-performance laptop for work and play, featuring a sleek design and powerful specs.',
            shortDescription: 'High-performance laptop.',
            category: 'electronics',
            favorite: false,
            borrowCount: 2,
            lateReturnPercentage: 0,
            averageDuration: 0,
            state: { label: 'Available', statusColor: 'positive' }
        },
        {
            id: this.index++ + "",
            name: 'Cotton T-Shirt',
            located: 'ShareSpace',
            owner: 'TheOpenShelf',
            imageUrl: '/items/harry-potter.png',
            description: 'Comfortable cotton T-shirt, perfect for casual outings or lounging at home.',
            shortDescription: 'Comfortable cotton T-shirt.',
            category: 'clothing',
            favorite: false,
            borrowCount: 0,
            lateReturnPercentage: 0,
            averageDuration: 0,
            state: { label: 'Available', statusColor: 'positive' }
        },
        {
            id: this.index++ + "",
            name: 'Wireless Mouse',
            located: 'ShareSpace',
            owner: 'TheOpenShelf',
            imageUrl: '/items/terraforming-mars.png',
            description: 'Ergonomic wireless mouse designed for productivity and comfort during extended use.',
            shortDescription: 'Ergonomic wireless mouse.',
            category: 'electronics',
            favorite: true,
            borrowCount: 9,
            lateReturnPercentage: 0,
            averageDuration: 0,
            state: { label: 'Available', statusColor: 'positive' }
        },
        {
            id: this.index++ + "",
            name: 'Blue Jeans',
            located: 'ShareSpace',
            owner: 'TheOpenShelf',
            imageUrl: '/items/terraforming-mars.png',
            description: 'Stylish denim jeans that provide comfort and versatility for any occasion.',
            shortDescription: 'Stylish denim jeans.',
            category: 'clothing',
            favorite: false,
            borrowCount: 4,
            lateReturnPercentage: 0,
            averageDuration: 0,
            state: { label: 'Available', statusColor: 'positive' }
        },
        {
            id: this.index++ + "",
            name: 'Smartphone Pro',
            located: 'ShareSpace',
            owner: 'TheOpenShelf',
            imageUrl: '/items/harry-potter.png',
            description: 'Latest smartphone model with cutting-edge features and a sleek design.',
            shortDescription: 'Latest smartphone model.',
            category: 'electronics',
            favorite: false,
            borrowCount: 1,
            lateReturnPercentage: 0,
            averageDuration: 0,
            state: { label: 'Available', statusColor: 'positive' }
        },
        {
            id: this.index++ + "",
            name: 'Winter Jacket',
            located: 'ShareSpace',
            owner: 'TheOpenShelf',
            imageUrl: '/items/terraforming-mars.png',
            description: 'Warm and durable jacket for cold weather, designed for style and comfort.',
            shortDescription: 'Warm winter jacket.',
            category: 'clothing',
            favorite: false,
            borrowCount: 0,
            lateReturnPercentage: 0,
            averageDuration: 0,
            state: { label: 'Available', statusColor: 'positive' }
        },
        {
            id: this.index++ + "",
            name: 'Cookbook Essentials',
            located: 'ShareSpace',
            owner: 'TheOpenShelf',
            imageUrl: '/items/terraforming-mars.png',
            description: 'A comprehensive cookbook filled with recipes for home chefs of all levels.',
            shortDescription: 'Comprehensive cookbook.',
            category: 'books',
            favorite: false,
            borrowCount: 1,
            lateReturnPercentage: 0,
            averageDuration: 0,
            state: { label: 'Available', statusColor: 'positive' }
        },
    ];

    getItems(): Item[] {
        return this.items;
    }

    getItem(id: string): Item {
        return this.items.find((i) => i.id === id) as Item;
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