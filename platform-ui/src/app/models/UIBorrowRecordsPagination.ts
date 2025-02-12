import { UIBorrowRecord } from './UIBorrowRecord';
import { UIItem } from './UIItem';
import { UIPagination } from './UIPagination';

export interface UIBorrowRecordStandalone extends UIBorrowRecord {
    item: UIItem;
}

export interface UIBorrowRecordsPagination extends UIPagination<UIBorrowRecordStandalone> {
}
