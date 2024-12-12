import { Injectable } from '@angular/core';
import { UICategory } from './categories.service';
import { Observable } from 'rxjs';

export interface UIItem {
    id: string;
    name: string;
    located: string;
    owner: string;
    imageUrl: string;
    description: string;
    shortDescription: string;
    category: UICategory;
    favorite: boolean;
    borrowCount: number
}

export interface UIBorrowRecord {
    id: string;
    borrowedBy: string;
    startDate: string;
    endDate: string;
}

export interface UIBorrowItem extends UIItem {
    record: UIBorrowRecord;
}

export type ItemWithRecords = UIItem & {
    borrowRecords: UIBorrowRecord[];
    isBookedToday: boolean;
    myBooking: UIBorrowRecord | undefined;
};

export interface ItemsService {
    getMyOwnedItems():  Observable<UIItem[]>;
    getItems(): Observable<UIItem[]>;
    getItemsWithRecords(): Observable<ItemWithRecords[]>;
    getItem(id: string): Observable<UIItem>;
    getItemBorrowRecords(id: string): Observable<UIBorrowRecord[]>;
    addItem(item: UIItem): Observable<UIItem>;
    borrowItem(item: UIItem, startDate: string, endDate: string): Observable<UIBorrowItem>;
    getMyBorrowItems(): Observable<UIBorrowItem[]>;
    cancelReservation(borrowRecord: UIBorrowItem): Observable<void>;
    getMyBorrowItem(id: string): Observable<UIBorrowItem | null>;
    markAsFavorite(item: UIItem): Observable<void>;
}