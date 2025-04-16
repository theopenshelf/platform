import { UIBorrowRecord } from './UIBorrowRecord';
import { UICategory } from './UICategory';

export interface UIItem {
  id: string;

  name: string;
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

  status: string; // draft, published, or generation-in-progress

  images: UIItemImage[];
}

export interface UIItemImage {
  imageUrl: string;
  type: 'original' | 'ai';
  order: number;
}
