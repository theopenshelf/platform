import { Observable } from 'rxjs';
import { UINotification } from '../models/UINotification';

export enum NotificationType {
  ITEM_AVAILABLE,
  ITEM_DUE,
  ITEM_BORROW_RESERVATION_DATE_START,
  ITEM_RESERVED_NO_LONGER_AVAILABLE,
}

export interface NotificationsService {
  getNotifications(): Observable<Array<UINotification>>;
  getUnreadNotificationsCount(): number;
  acknowledgeNotifications(notifications: UINotification[]): void;
}
