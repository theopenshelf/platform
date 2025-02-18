import { Observable } from 'rxjs';
import { GetBorrowRecordsCountByStatusParams } from '../../../models/GetBorrowRecordsCountByStatusParams';
import { GetItemsParams } from '../../../models/GetItemsParams';
import { UIBorrowRecord } from '../../../models/UIBorrowRecord';
import { UIBorrowRecordsPagination } from '../../../models/UIBorrowRecordsPagination';
import { UIBorrowDetailedStatus } from '../../../models/UIBorrowStatus';
import { UIItem } from '../../../models/UIItem';
import { UIItemsPagination } from '../../../models/UIItemsPagination';
import { UIUser } from '../../../models/UIUser';

export interface ItemsService {
  getItems(params: GetItemsParams): Observable<UIItemsPagination>;
  getBorrowRecords(params: GetItemsParams): Observable<UIBorrowRecordsPagination>;
  getBorrowRecordsCountByStatus(params: GetBorrowRecordsCountByStatusParams): Observable<Map<UIBorrowDetailedStatus, number>>;
  getItem(id: string): Observable<UIItem>;
  addItem(item: UIItem): Observable<UIItem>;
  borrowItem(
    item: UIItem,
    startDate: string,
    endDate: string,
    borrowBy?: UIUser,
  ): Observable<UIItem>;

  pickupItem(
    item: UIItem,
    borrowRecord: UIBorrowRecord,
  ): Observable<UIItem>;


  approvalReservation(
    decision: 'approve' | 'reject',
    item: UIItem,
    borrowRecord: UIBorrowRecord,
  ): Observable<UIItem>;
  approvalPickup(
    decision: 'approve' | 'reject',
    item: UIItem,
    borrowRecord: UIBorrowRecord,
  ): Observable<UIItem>;
  approvalReturn(
    decision: 'approve' | 'reject',
    item: UIItem,
    borrowRecord: UIBorrowRecord,
  ): Observable<UIItem>;


  cancelReservation(
    item: UIItem,
    borrowRecord: UIBorrowRecord,
  ): Observable<UIItem>;
  returnItem(
    item: UIItem,
    borrowRecord: UIBorrowRecord,
  ): Observable<UIItem>;
  markAsFavorite(item: UIItem): Observable<void>;

}
