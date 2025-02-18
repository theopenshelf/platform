import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  Notification,
  NotificationsHubApiService,
} from '../../api-client';
import { UINotification, UINotificationType } from '../../models/UINotification';
import {
  NotificationsService
} from '../notifications.service';

@Injectable({
  providedIn: 'root',
})
export class APINotificationsService implements NotificationsService {
  notifications: Array<UINotification> | undefined;

  constructor(private notificationsService: NotificationsHubApiService) { }

  getNotifications(): Observable<Array<UINotification>> {
    return this.notificationsService.getNotifications().pipe(
      map((notifications: Notification[]) => {
        this.notifications = notifications.map(
          (notification: Notification) => ({
            ...notification,
            alreadyRead: false,
            type: notification.type as unknown as UINotificationType,
            payload: notification.payload ?? {},
          }),
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
    notifications.forEach((notification) => {
      notification.alreadyRead = true;
    });
  }
}
