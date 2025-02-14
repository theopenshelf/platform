import { UIBorrowDetailedStatus } from './UIBorrowStatus';


export interface GetBorrowRecordsCountByStatusParams {
    itemId?: string;
    currentUser?: boolean;
    borrowedByCurrentUser?: boolean;
    borrowedBy?: string;
    statuses?: UIBorrowDetailedStatus[];
    libraryIds?: string[];
}
