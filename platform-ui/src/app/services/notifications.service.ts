export enum NotificationType {
    ITEM_AVAILABLE,
    ITEM_DUE,
    ITEM_BORROW_RESERVATION_DATE_START,
    ITEM_RESERVED_NO_LONGER_AVAILABLE
}

export interface Notification {
    id: number;
    author: string;
    date: string;
    type: NotificationType;
    alreadyRead: boolean;
    payload: any | undefined
}

export interface NotificationsService {
    getNotifications(): Notification[];
    getUnreadNotificationsCount(): number;
    acknowledgeNotifications(notifications: Notification[]): void;
}