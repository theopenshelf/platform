import { Observable } from 'rxjs';
import { UICategory } from './categories.service';

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
    borrowCount: number;
    lateReturnPercentage: number;
    averageDuration: number;
    state: { label: string, statusColor: string };
}

export interface UIBorrowRecord {
    borrowedBy: string;
    startDate: string;
    endDate: string;
}

export interface UIBorrowItem extends UIItem {
    record: UIBorrowRecord;
}

export interface ItemsService {
    getItems(): Observable<UIItem[]>;
    getItem(id: string): Observable<UIItem>;
    addItem(item: UIItem): Observable<UIItem>;
}