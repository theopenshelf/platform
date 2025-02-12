import { UIBorrowDetailedStatus } from "./UIBorrowStatus";

export interface UIBorrowRecord {
  id: string;
  borrowedBy: string;
  startDate: Date;
  endDate: Date;
  reservationDate: Date;
  pickupDate?: Date;
  effectiveReturnDate?: Date;
  status: UIBorrowDetailedStatus;
}



export function getBorrowDurationInDays(borrowRecord: UIBorrowRecord): number {
  const endDate = borrowRecord.effectiveReturnDate || borrowRecord.endDate;
  const durationInMilliseconds = Math.max(0, endDate.getTime() - borrowRecord.startDate.getTime());
  const durationInDays = Math.floor(durationInMilliseconds / (1000 * 60 * 60 * 24));
  return Math.max(1, durationInDays);
}

export function getLateDurationInDays(borrowRecord: UIBorrowRecord): number {
  const now = new Date();

  if (!borrowRecord.effectiveReturnDate) {
    if (borrowRecord.endDate < now) {
      const lateDurationInMilliseconds = now.getTime() - borrowRecord.endDate.getTime();
      return Math.floor(lateDurationInMilliseconds / (1000 * 60 * 60 * 24));
    }
    return 0;
  }

  if (borrowRecord.effectiveReturnDate <= borrowRecord.endDate) {
    return 0;
  }

  const lateDurationInMilliseconds = borrowRecord.effectiveReturnDate.getTime() - borrowRecord.endDate.getTime();
  return Math.floor(lateDurationInMilliseconds / (1000 * 60 * 60 * 24));
}
