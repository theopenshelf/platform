import { Observable } from 'rxjs';
import { UIUser } from '../models/UIUser';

export interface UsersService {
    getUsers(): Observable<UIUser[]>;
    getUser(userId: string): Observable<UIUser>;
}
