import { Observable } from 'rxjs';

export interface UIUser {
    id: string;
    username: string;
    email: string;
    flatNumber: string;
    address: string;
    borrowedItems: number;
    returnedLate: number;
    successRate: number;
    disabled: boolean;
};

export interface UsersService {
    getUsers(): Observable<UIUser[]>;
    getUser(id: string): Observable<UIUser>;
    saveUser(user: UIUser): Observable<UIUser>;
    setUserPassword(userId: string, newPassword: string): Observable<void>;
} 