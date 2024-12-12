import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationType, NotificationsService, UINotification } from '../notifications.service';
import { NotificationsApiService, Notification } from '../../api-client';

@Injectable({
  providedIn: 'root',
})
export class APINotificationsService implements NotificationsService {
    notifications: Array<UINotification> | undefined;

    constructor(private notificationsService: NotificationsApiService) {}
    
    getNotifications(): Observable<Array<UINotification>> {
        return this.notificationsService.getNotifications().pipe(
            map((notifications: Notification[]) => {
                this.notifications = notifications.map((notification: Notification) => ({
                    ...notification,
                    alreadyRead: false,
                    type: notification.type as unknown as NotificationType,
                    payload: notification.payload ?? {}
                }));
                return this.notifications;
            })
        );
    }

    getUnreadNotificationsCount(): number {
        return this.notifications?.filter(notification => !notification.alreadyRead).length ?? 0;
    }

    acknowledgeNotifications(notifications: UINotification[]) {
        notifications.forEach(notification => {
            notification.alreadyRead = true;
        })
    }

}