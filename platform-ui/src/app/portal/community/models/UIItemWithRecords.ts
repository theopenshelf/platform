import { UIBorrowRecord } from "./UIBorrowRecord";
import { UIItem } from "./UIItem";


export type UIItemWithRecords = UIItem & {
    borrowRecords: UIBorrowRecord[];
    isBookedToday: boolean;
    myBooking: UIBorrowRecord | undefined;
};
