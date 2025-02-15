import { UIBorrowDetailedStatus } from './UIBorrowStatus';


export interface GetBorrowRecordsCountByStatusParams {
    itemId?: string;

    borrowedByCurrentUser?: boolean;
    borrowedBy?: string;

    statuses?: UIBorrowDetailedStatus[];

    libraryIds?: string[];
}
