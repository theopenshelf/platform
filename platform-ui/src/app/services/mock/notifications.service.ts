import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { loadNotificationsData } from '../../mock/notifications-loader';
import { UINotification, UINotificationType } from '../../models/UINotification';
import { EventService, TosEventType } from '../../portal/community/services/event.service';
import {
  NotificationsService
} from '../notifications.service';


export interface MockNotification {
  type: UINotificationType;
  payload: any;
  destinationUserId: string;
}

@Injectable({
  providedIn: 'root',
})
export class MockNotificationsService implements NotificationsService {
  private notifications: UINotification[] = loadNotificationsData();

  constructor(private eventService: EventService) {
  }

  getNotifications(): Observable<Array<UINotification>> {
    return of(this.notifications);
  }

  getUnreadNotificationsCount(): number {
    return this.notifications.filter(
      (notification) => !notification.alreadyRead,
    ).length;
  }

  acknowledgeNotifications(notifications: UINotification[]) {
    notifications.forEach((notification) => {
      notification.alreadyRead = true;
    });
  }

  pushNewNotification(notification: MockNotification) {
    this.notifications.unshift({
      id: this.notifications.length + 1,
      author: 'The Open Shelf',
      date: new Date().toISOString(),
      alreadyRead: false,
      type: notification.type,
      payload: notification.payload,
    });
    this.eventService.publishEvent(TosEventType.NotificationsChanged);
  }
}
