export interface UIBorrowRecord {
  id: string;
  borrowedBy: string;
  startDate: Date;
  endDate: Date;
  reservationDate: Date;
  effectiveReturnDate?: Date;
}
