import { Injectable } from '@angular/core';
import { CategoriesService, Category } from './categories.service';

export interface Item {
    id: string;
    name: string;
    located: string;
    owner: string;
    imageUrl: string;
    description: string;
    shortDescription: string;
    category: Category;
    favorite: boolean;
    borrowCount: number;
    lateReturnPercentage: number;
    averageDuration: number;
    state: { label: string, statusColor: string };  
}

export interface BorrowRecord {
    borrowedBy: string;
    startDate: string;
    endDate: string;
}

export interface BorrowItem extends Item {
    record: BorrowRecord;
}

export interface ItemsService {
    getMyOwnedItems(): Item[];
    getItems(): Item[];
    getItem(id: string): Item;
    getCaterogies(): { value: string, label: string }[];
    addItem(item: Item): Item;
}