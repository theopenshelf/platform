import { Injectable } from '@angular/core';
import { Category } from './categories.service';

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
    borrowCount: number
}

export interface BorrowRecord {
    borrowedBy: string;
    startDate: string;
    endDate: string;
}

export interface BorrowItem extends Item {
    record: BorrowRecord;
}

export type ItemWithRecords = Item & {
    borrowRecords: BorrowRecord[];
    isBookedToday: boolean;
    myBooking: BorrowRecord | undefined;
};

export interface ItemsService {
    getMyOwnedItems(): Item[];
    getItems(): Item[];
    getItemsWithRecords(): ItemWithRecords[];
    getItem(id: string): Item;
    getItemBorrowRecords(id: string): BorrowRecord[];
    addItem(item: Item): Item;
    borrowItem(item: Item, startDate: string, endDate: string): BorrowItem;
    getMyBorrowItems(): BorrowItem[];
    cancelReservation(borrowRecord: BorrowItem): void;
    getMyBorrowItem(id: string): BorrowItem | null;
    markAsFavorite(item: Item): void;
}