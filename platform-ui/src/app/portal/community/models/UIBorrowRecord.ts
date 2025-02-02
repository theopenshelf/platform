export interface UIBorrowRecord {
  id: string;
  borrowedBy: string;
  startDate: Date;
  endDate: Date;
  reservationDate: Date;
  pickupDate?: Date;
  effectiveReturnDate?: Date;
}

export enum UIBorrowRecordStatus {
  Impossible = 'impossible',
  Reserved = 'reserved',
  ReadyToPickup = 'ready-to-pickup',
  CurrentlyBorrowed = 'currently-borrowed',
  ReturnedEarly = 'returned-early',
  Returned = 'returned',
  DueToday = 'due-today',
  Late = 'late',
  ReturnedLate = 'returned-late',
}

export function getBorrowRecordStatus(borrowRecord: UIBorrowRecord): UIBorrowRecordStatus {
  const now = new Date();

  if (now < borrowRecord.reservationDate) {
    return UIBorrowRecordStatus.Reserved;
  } else if (now < borrowRecord.startDate && (!borrowRecord.pickupDate || now < borrowRecord.pickupDate!)) {
    return UIBorrowRecordStatus.Reserved;
  }

  if (!borrowRecord.pickupDate) {
    if (borrowRecord.startDate! <= now) {
      return UIBorrowRecordStatus.ReadyToPickup;
    } else {
      return UIBorrowRecordStatus.Reserved;
    }
  }

  if (now < borrowRecord.endDate) {

    if (borrowRecord.effectiveReturnDate) {
      return UIBorrowRecordStatus.ReturnedEarly;
    } else {
      return UIBorrowRecordStatus.CurrentlyBorrowed;
    }
  }

  if (borrowRecord.endDate === now) {
    if (borrowRecord.effectiveReturnDate) {
      return UIBorrowRecordStatus.Returned;
    } else {
      return UIBorrowRecordStatus.DueToday;
    }
  }

  if (borrowRecord.endDate < now) {
    if (borrowRecord.effectiveReturnDate) {
      if (borrowRecord.effectiveReturnDate! < borrowRecord.endDate) {
        return UIBorrowRecordStatus.ReturnedEarly;
      } else if (borrowRecord.effectiveReturnDate! > borrowRecord.endDate) {
        return UIBorrowRecordStatus.ReturnedLate;
      } else {
        return UIBorrowRecordStatus.Returned;
      }
    } else {
      return UIBorrowRecordStatus.Late;
    }
  } else {
    return UIBorrowRecordStatus.Impossible;
  }
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
