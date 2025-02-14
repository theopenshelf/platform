import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import users from '../../../../mock/users.json';
import { UIUser } from '../../../../models/UIUser';
import { UsersService } from '../users.service';

@Injectable({
  providedIn: 'root',
})
export class MockUsersService implements UsersService {
  private index = 1;

  public allUsers = users;

  getUsers(): Observable<UIUser[]> {
    return of(users);
  }

  getUser(id: string): Observable<UIUser> {
    return of(users.find((user) => user.id === id) || ({} as UIUser));
  }

  saveUser(user: UIUser): Observable<UIUser> {
    const existingUserIndex = users.findIndex((u) => u.id === user.id);
    if (existingUserIndex >= 0) {
      // Update existing user
      users[existingUserIndex] = user as any;
    } else {
      // Add new user with incremented ID
      user.id = this.index++ + '';
      users.push(user as any);
    }
    return of(user);
  }

  setUserPassword(userId: string, newPassword: string): Observable<void> {
    if (userId && newPassword) {
      console.log(`Password updated for user ${userId}`);
    } else {
      console.error('Invalid user ID or password');
    }
    return of(undefined);
  }
}
