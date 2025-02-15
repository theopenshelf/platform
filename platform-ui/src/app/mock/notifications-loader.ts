import { UINotification, UINotificationType } from '../models/UINotification';
import { loadItems } from './items-loader';
import notificationsData from './notifications.json';


export const loadNotificationsData = (): UINotification[] => {
    const itemsData = loadItems();
    return notificationsData.map(notification => ({
        ...notification,
        type: notification.type as unknown as UINotificationType,
        payload: {
            item: itemsData.find(item => item.id === notification.payload.itemId)
        }
    }));
};
