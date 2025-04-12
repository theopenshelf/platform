import { Observable } from 'rxjs';
import { UINotificationsSettings } from '../../../models/UINotificationsSettings';
import { UIUser } from '../../../models/UIUser';

export interface UsersService {
    getUsers(): Observable<UIUser[]>;
    getUser(userId: string): Observable<UIUser>;
    findUser(query: string, limit?: number): Observable<UIUser[]>;
    updateUser(user: UIUser): Observable<UIUser>;
    getNotificationsSettings(): Observable<UINotificationsSettings>;
    updateNotificationsSettings(settings: UINotificationsSettings): Observable<UINotificationsSettings>;
}
