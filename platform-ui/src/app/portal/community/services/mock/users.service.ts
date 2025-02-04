import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UIUser } from '../../models/UIUser';
import { UsersService } from '../users.service';
import users from './users.json';

@Injectable({
  providedIn: 'root',
})
export class MockUsersService implements UsersService {
  getUsers(): Observable<UIUser[]> {
    return of(users);
  }

  getUser(userId: string): Observable<UIUser> {
    return of(users.find((user) => user.id === userId) || ({} as UIUser));
  }
}
