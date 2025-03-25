
export enum UINotificationType {
    ITEM_AVAILABLE = 'item-available',
    ITEM_DUE = 'item-due',
    ITEM_BORROW_RESERVATION_DATE_START = 'item-borrow-reservation-date-start',
    ITEM_RESERVED_NO_LONGER_AVAILABLE = 'item-reserved-no-longer-available',
    ITEM_RESERVATION_APPROVED = 'item-reservation-approved',
    ITEM_RESERVATION_REJECTED = 'item-reservation-rejected',
    ITEM_PICKUP_APPROVED = 'item-pickup-approved',
    ITEM_PICKUP_REJECTED = 'item-pickup-rejected',
    ITEM_RETURN_APPROVED = 'item-return-approved',
    ITEM_RETURN_REJECTED = 'item-return-rejected',
}

export interface UINotification {
    id: string;
    author: string;
    date: string;
    type: UINotificationType;
    alreadyRead: boolean;
    payload: any | undefined;
}
