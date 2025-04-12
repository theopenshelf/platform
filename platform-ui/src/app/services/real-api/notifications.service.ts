import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { map, Observable } from 'rxjs';
import {
  Notification,
  NotificationsHubApiService,
} from '../../api-client';
import { UIBorrowRecord } from '../../models/UIBorrowRecord';
import { UIItem } from '../../models/UIItem';
import { UINotification, UINotificationType } from '../../models/UINotification';
import {
  NotificationsService
} from '../notifications.service';

@Injectable({
  providedIn: 'root',
})
export class APINotificationsService implements NotificationsService {
  notifications: Array<UINotification> | undefined;

  constructor(
    private notificationsService: NotificationsHubApiService,
    private translateService: TranslateService
  ) { }

  private mapNotificationType(apiType: string): UINotificationType {
    // Convert from UPPER_CASE to kebab-case
    const kebabCase = apiType.toLowerCase().replace(/_/g, '-');
    return kebabCase as UINotificationType;
  }

  private mapToApiNotification(notification: UINotification): Notification {
    return {
      id: notification.id,
      author: notification.author,
      date: notification.date,
      type: notification.type.toUpperCase().replace(/-/g, '_') as Notification['type'],
      alreadyRead: true,
      payload: notification.payload
    };
  }

  private getNotificationTranslationKey(type: UINotificationType): string {
    const typeMap: Record<UINotificationType, string> = {
      [UINotificationType.ITEM_AVAILABLE]: 'notifications.itemAvailable',
      [UINotificationType.ITEM_DUE]: 'notifications.itemDue',
      [UINotificationType.ITEM_BORROW_RESERVATION_DATE_START]: 'notifications.itemBorrowReservationDateStart',
      [UINotificationType.ITEM_RESERVED_NO_LONGER_AVAILABLE]: 'notifications.itemReservedNoLongerAvailable',
      [UINotificationType.ITEM_PICKUP_APPROVED]: 'notifications.itemPickupApproved',
      [UINotificationType.ITEM_RETURN_APPROVED]: 'notifications.itemReturnApproved',
      [UINotificationType.ITEM_RESERVATION_APPROVED]: 'notifications.itemReservationApproved',
      [UINotificationType.ITEM_RESERVATION_REJECTED]: 'notifications.itemReservationRejected',
      [UINotificationType.ITEM_PICKUP_REJECTED]: 'notifications.itemPickupRejected',
      [UINotificationType.ITEM_RETURN_REJECTED]: 'notifications.itemReturnRejected'
    };
    return typeMap[type] || 'notifications.unknown';
  }

  getNotifications(): Observable<Array<UINotification>> {
    return this.notificationsService.getNotifications().pipe(
      map((notifications: Notification[]) => {
        this.notifications = notifications.map(
          (notification: Notification) => {
            const type = this.mapNotificationType(notification.type);
            return {
              ...notification,
              type,
              translationKey: this.getNotificationTranslationKey(type),
              payload: notification.payload ?? {},
              item: notification.item as UIItem | undefined,
              borrowRecord: notification.borrowRecord as UIBorrowRecord | undefined,
            };
          }
        );
        return this.notifications;
      }),
    );
  }

  getUnreadNotificationsCount(): number {
    return (
      this.notifications?.filter((notification) => !notification.alreadyRead)
        .length ?? 0
    );
  }

  acknowledgeNotifications(notifications: UINotification[]) {
    // Map UINotifications back to API Notifications
    const apiNotifications = notifications.map(notification => this.mapToApiNotification(notification));

    // Call the backend API
    return this.notificationsService.acknowledgeNotifications(apiNotifications).subscribe({
      next: () => {
        // Update local state only after successful backend update
        notifications.forEach((notification) => {
          notification.alreadyRead = true;
        });
      },
      error: (error) => {
        console.error('Failed to acknowledge notifications:', error);
      }
    });
  }
}
