import { Injectable } from '@angular/core';
import { Item, ItemsService } from '../items.service';
import { MockCategoriesService } from './categories.service';



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
            category: MockCategoriesService.ELECTRONICS,
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
            category: MockCategoriesService.CLOTHING,
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
            category: MockCategoriesService.ELECTRONICS,
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
            category: MockCategoriesService.CLOTHING,
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
            category: MockCategoriesService.ELECTRONICS,
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
            category: MockCategoriesService.CLOTHING,
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
            category: MockCategoriesService.BOOKS,
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