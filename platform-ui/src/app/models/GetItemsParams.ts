import { UIBorrowDetailedStatus } from './UIBorrowStatus';


export interface GetItemsParams {
    itemId?: string;
    currentUser?: boolean;
    borrowedByCurrentUser?: boolean;
    borrowedBy?: string;
    statuses?: UIBorrowDetailedStatus[];
    libraryIds?: string[];
    categories?: string[];
    searchText?: string;
    currentlyAvailable?: boolean;
    sortBy?: 'favorite' | 'createdAt' | 'borrowCount' | 'pickupDate' | 'reservationDate' | 'startDate' | 'endDate' | 'returnDate' | undefined;
    sortOrder?: 'asc' | 'desc' | undefined;
    page?: number;
    pageSize?: number;
    startDate?: Date;
    endDate?: Date;
    favorite?: boolean;
}
