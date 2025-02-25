import { UIBorrowDetailedStatus } from './UIBorrowStatus';


export interface GetItemsParams {
    itemId?: string;

    borrowedByCurrentUser?: boolean;
    borrowedBy?: string;

    statuses?: UIBorrowDetailedStatus[];

    libraryIds?: string[];
    communityIds?: string[];
    categories?: string[];
    searchText?: string;

    currentlyAvailable?: boolean;
    startDate?: Date;
    endDate?: Date;

    sortBy?: 'favorite' | 'createdAt' | 'borrowCount' | 'pickupDate' | 'reservationDate' | 'startDate' | 'endDate' | 'returnDate' | undefined;
    sortOrder?: 'asc' | 'desc' | undefined;

    page?: number;
    pageSize?: number;

    favorite?: boolean;
}
