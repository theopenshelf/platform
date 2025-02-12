export interface UIPagination<T> {
    totalPages: number;
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
    items: T[];
}

