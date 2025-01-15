import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UIUser, UsersService } from '../users.service';

@Injectable({
  providedIn: 'root',
})
export class MockUsersService implements UsersService {
  private index = 1;

  protected readonly users: UIUser[] = [
    {
      id: this.index++ + '',
      username: 'johndoe',
      email: 'johndoe@example.com',
      flatNumber: '12A',
      address: '123 Main St, Cityville',
      borrowedItems: 5,
      returnedLate: 1,
      successRate: 80,
      disabled: false,
    },
    {
      id: this.index++ + '',
      username: 'janedoe',
      email: 'janedoe@example.com',
      flatNumber: '3B',
      address: '456 Elm St, Townsville',
      borrowedItems: 10,
      returnedLate: 0,
      successRate: 100,
      disabled: false,
    },
  ];

  getUsers(): Observable<UIUser[]> {
    return of(this.users);
  }

  getUser(id: string): Observable<UIUser> {
    return of(this.users.find((user) => user.id === id) || ({} as UIUser));
  }

  saveUser(user: UIUser): Observable<UIUser> {
    const existingUserIndex = this.users.findIndex((u) => u.id === user.id);
    if (existingUserIndex >= 0) {
      // Update existing user
      this.users[existingUserIndex] = user;
    } else {
      // Add new user with incremented ID
      user.id = this.index++ + '';
      this.users.push(user);
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
