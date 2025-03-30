export enum UIBorrowStatus {
  Reserved = 'reserved',
  CurrentlyBorrowed = 'borrowed',
  Returned = 'returned',
}

export enum UIBorrowDetailedStatus {
  Reserved_Impossible = 'reserved-impossible',
  Reserved_Unconfirmed = 'reserved-unconfirmed',
  Reserved_Confirmed = 'reserved-confirmed',
  Reserved_ReadyToPickup = 'reserved-ready-to-pickup',
  Reserved_Pickup_Unconfirmed = 'reserved-pickup-unconfirmed',

  Borrowed_Active = 'borrowed-active',
  Borrowed_DueToday = 'borrowed-due-today',
  Borrowed_Late = 'borrowed-late',
  Borrowed_Return_Unconfirmed = 'borrowed-return-unconfirmed',

  Returned_Early = 'returned-early',
  Returned_OnTime = 'returned-on-time',
  Returned_Late = 'returned-late',
}

export function getStatusIcon(status: UIBorrowDetailedStatus): string {
  switch (status) {
    case UIBorrowDetailedStatus.Reserved_Impossible:
      return '@tui.x';
    case UIBorrowDetailedStatus.Reserved_Unconfirmed:
      return '@tui.clock';
    case UIBorrowDetailedStatus.Reserved_Confirmed:
      return '@tui.clock';
    case UIBorrowDetailedStatus.Reserved_ReadyToPickup:
      return '/borrow.png';
    case UIBorrowDetailedStatus.Reserved_Pickup_Unconfirmed:
      return '/borrow.png';
    case UIBorrowDetailedStatus.Borrowed_Active:
      return '/borrow.png';
    case UIBorrowDetailedStatus.Borrowed_Return_Unconfirmed:
      return '/borrow.png';
    case UIBorrowDetailedStatus.Returned_Early:
      return '@tui.calendar-check';
    case UIBorrowDetailedStatus.Returned_OnTime:
      return '@tui.calendar-check';
    case UIBorrowDetailedStatus.Borrowed_DueToday:
      return '@tui.calendar-clock';
    case UIBorrowDetailedStatus.Borrowed_Late:
      return '@tui.calendar-clock';
    case UIBorrowDetailedStatus.Returned_Late:
      return '@tui.calendar-x';
    default:
      return '@tui.x';
  }
}