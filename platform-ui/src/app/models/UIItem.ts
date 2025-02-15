import { UIBorrowRecord } from './UIBorrowRecord';
import { UICategory } from './UICategory';

export interface UIItem {
  id: string;

  name: string;
  imageUrl: string;
  description: string;
  shortDescription: string;
  category: UICategory;
  favorite: boolean;
  owner: string;
  libraryId: string;

  borrowRecords: UIBorrowRecord[];

  createdAt: Date | undefined;

  //statistics
  borrowCount: number;
}
