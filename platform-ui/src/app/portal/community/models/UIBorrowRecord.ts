export interface UIBorrowRecord {
  id: string;
  borrowedBy: string;
  startDate: Date;
  endDate: Date;
  reservationDate: Date;
  effectiveReturnDate?: Date;
}

export enum UIBorrowRecordStatus {
  Impossible = 'impossible',
  Reserved = 'reserved',
  CurrentlyBorrowed = 'currently-borrowed',
  ReturnedEarly = 'returned-early',
  Returned = 'returned',
  DueToday = 'due-today',
  Late = 'late',
  ReturnedLate = 'returned-late',
}

export function getBorrowRecordStatus(borrowRecord: UIBorrowRecord): UIBorrowRecordStatus {
  const now = new Date();

  var status: UIBorrowRecordStatus = UIBorrowRecordStatus.Impossible;

  if (now < borrowRecord.reservationDate) {
    status = UIBorrowRecordStatus.Reserved;
  } else if (now < borrowRecord.startDate) {
    status = UIBorrowRecordStatus.Reserved;
  } else if (now < borrowRecord.endDate) {

    if (borrowRecord.effectiveReturnDate) {
      status = UIBorrowRecordStatus.ReturnedEarly;
    } else {
      status = UIBorrowRecordStatus.CurrentlyBorrowed;
    }
  } else if (borrowRecord.endDate === now) {
    if (borrowRecord.effectiveReturnDate) {
      status = UIBorrowRecordStatus.Returned;
    } else {
      status = UIBorrowRecordStatus.DueToday;
    }
  } else if (borrowRecord.endDate < now) {
    if (borrowRecord.effectiveReturnDate) {
      if (borrowRecord.effectiveReturnDate! < borrowRecord.endDate) {
        status = UIBorrowRecordStatus.ReturnedEarly;
      } else if (borrowRecord.effectiveReturnDate! > borrowRecord.endDate) {
        status = UIBorrowRecordStatus.ReturnedLate;
      } else {
        status = UIBorrowRecordStatus.Returned;
      }
    } else {
      status = UIBorrowRecordStatus.Late;
    }
  } else {
    status = UIBorrowRecordStatus.Impossible;
  }
  return status;
}

export function getBorrowDurationInDays(borrowRecord: UIBorrowRecord): number {
  const endDate = borrowRecord.effectiveReturnDate || borrowRecord.endDate;
  const durationInMilliseconds = Math.max(0, endDate.getTime() - borrowRecord.startDate.getTime());
  return Math.floor(durationInMilliseconds / (1000 * 60 * 60 * 24));
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
