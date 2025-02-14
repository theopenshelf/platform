import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import users from '../../../../mock/users.json';
import { UIUser } from '../../../../models/UIUser';
import { UsersService } from '../users.service';

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

  getUserByUsername(username: string): UIUser {
    return users.find((user) => user.username === username) || ({} as UIUser);
  }

  findUser(query: string, limit?: number): Observable<UIUser[]> {
    return of(users.filter((user) => user.username.includes(query) || user.email.includes(query)).slice(0, limit));
  }
}
