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
    libraryId: string;
    createdAt: Date;
}

export interface UIItemsPagination {
    totalPages: number;
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
    items: UIItem[];
}

export interface UIBorrowRecord {
    borrowedBy: string;
    startDate: string;
    endDate: string;
}


export interface ItemsService {
    getItems(
        currentUser?: boolean,
        borrowedByCurrentUser?: boolean,
        libraryIds?: string[],
        categories?: string[],
        searchText?: string,
        currentlyAvailable?: boolean,
        sortBy?: string,
        sortOrder?: 'asc' | 'desc',
        page?: number,
        pageSize?: number
    ): Observable<UIItemsPagination>;
    getItem(id: string): Observable<UIItem>;
    addItem(item: UIItem): Observable<UIItem>;
}