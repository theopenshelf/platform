import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationType, Notification, NotificationsService } from '../notifications.service';

@Injectable({
  providedIn: 'root',
})
export class MockNotificationsService implements NotificationsService {

    private notifications: Notification[] = [
        {
            "id": 4,
            "author": "Platform",
            "date": "2024-11-21",
            "type": NotificationType.ITEM_AVAILABLE,
            "alreadyRead": false,
            "payload": {
                "item": {
                    id: "2",
                    name: 'Harry Potter Book',
                    imageUrl: '/items/terraforming-mars.png',
                    category: 'books',
                }
            }
        },
        {
            "id": 3,
            "author": "Platform",
            "date": "2024-11-20",
            "type": NotificationType.ITEM_DUE,
            "alreadyRead": false,
            "payload": {
                "item": {
                    id: "4",
                    name: 'Smartphone Pro',
                    imageUrl: '/items/terraforming-mars.png',
                    category: 'electronics',
                }
            }
        },
        {
            "id": 2,
            "author": "Platform",
            "date": "2024-11-19",
            "type": NotificationType.ITEM_BORROW_RESERVATION_DATE_START,
            "alreadyRead": true,
            "payload": {
                "item": {
                    id: "4",
                    name: 'Smartphone Pro',
                    imageUrl: '/items/terraforming-mars.png',
                    category: 'electronics',
                }
            }
        },
        {
            "id": 1,
            "author": "Platform",
            "date": "2024-11-19",
            "type": NotificationType.ITEM_RESERVED_NO_LONGER_AVAILABLE,
            "alreadyRead": true,
            "payload": {
                "item": {
                    id: "6",
                    name: 'The Great Gatsby',
                    imageUrl: '/items/terraforming-mars.png',
                    category: 'books',
                }
            }
        }
    ];

    getNotifications(): Notification[] {
        return this.notifications;
    }

    getUnreadNotificationsCount(): number {
        return this.notifications.filter(notification => !notification.alreadyRead).length;
    }

    acknowledgeNotifications(notifications: Notification[]) {
        notifications.forEach(notification => {
            notification.alreadyRead = true;
        })
    }

}