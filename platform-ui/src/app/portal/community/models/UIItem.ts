import { UIBorrowRecord } from './UIBorrowRecord';
import { UICategory } from './UICategory';

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
  libraryId: string;
  borrowRecords: UIBorrowRecord[];
  isBookedToday: boolean;
  myBooking: UIBorrowRecord | undefined;
  createdAt: Date | undefined;
}
