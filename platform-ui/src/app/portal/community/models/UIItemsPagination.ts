import { UIItem } from './UIItem';

export interface UIItemsPagination {
  totalPages: number;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  items: UIItem[];
}

