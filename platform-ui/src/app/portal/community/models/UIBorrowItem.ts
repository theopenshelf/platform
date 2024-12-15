import { UIBorrowRecord } from "./UIBorrowRecord";
import { UIItem } from "./UIItem";


export interface UIBorrowItem extends UIItem {
    record: UIBorrowRecord;
}
