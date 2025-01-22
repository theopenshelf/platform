import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UIUser, UsersService } from '../users.service';

@Injectable({
  providedIn: 'root',
})
export class MockUsersService implements UsersService {
  private index = 1;

  public readonly users: UIUser[] = [
    {
      id: this.index++ + '',
      username: 'tiago',
      email: 'tiago@example.com',
      flatNumber: '1A',
      address: '123 Main St, Cityville',
      borrowedItems: 0,
      returnedLate: 0,
      successRate: 100,
      disabled: false,
    },
    {
      id: this.index++ + '',
      username: 'paul',
      email: 'paul@example.com',
      flatNumber: '2B',
      address: '456 Elm St, Townsville',
      borrowedItems: 0,
      returnedLate: 0,
      successRate: 100,
      disabled: false,
    },
    {
      id: this.index++ + '',
      username: 'bob',
      email: 'bob@example.com',
      flatNumber: '3C',
      address: '789 Oak St, Villagetown',
      borrowedItems: 0,
      returnedLate: 0,
      successRate: 100,
      disabled: false,
    },
    {
      id: this.index++ + '',
      username: 'alice',
      email: 'alice@example.com',
      flatNumber: '4D',
      address: '101 Pine St, Hamletville',
      borrowedItems: 0,
      returnedLate: 0,
      successRate: 100,
      disabled: false,
    },
    {
      id: this.index++ + '',
      username: 'jane',
      email: 'jane@example.com',
      flatNumber: '5E',
      address: '202 Birch St, Metropolis',
      borrowedItems: 0,
      returnedLate: 0,
      successRate: 100,
      disabled: false,
    },
    {
      id: this.index++ + '',
      username: 'nolan',
      email: 'nolan@example.com',
      flatNumber: '6F',
      address: '303 Cedar St, Urbania',
      borrowedItems: 0,
      returnedLate: 0,
      successRate: 100,
      disabled: false,
    },
    {
      id: this.index++ + '',
      username: 'louwen',
      email: 'louwen@example.com',
      flatNumber: '7G',
      address: '404 Spruce St, Suburbia',
      borrowedItems: 0,
      returnedLate: 0,
      successRate: 100,
      disabled: false,
    },
    {
      id: this.index++ + '',
      username: 'john',
      email: 'john@example.com',
      flatNumber: '8H',
      address: '505 Maple St, Countryside',
      borrowedItems: 0,
      returnedLate: 0,
      successRate: 100,
      disabled: false,
    },
    {
      id: this.index++ + '',
      username: 'audrey',
      email: 'audrey@example.com',
      flatNumber: '9I',
      address: '606 Willow St, Seaside',
      borrowedItems: 0,
      returnedLate: 0,
      successRate: 100,
      disabled: false,
    },
    {
      id: this.index++ + '',
      username: 'allan',
      email: 'allan@example.com',
      flatNumber: '10J',
      address: '707 Ash St, Riverside',
      borrowedItems: 0,
      returnedLate: 0,
      successRate: 100,
      disabled: false,
    },
    {
      id: this.index++ + '',
      username: 'me',
      email: 'me@example.com',
      flatNumber: '11K',
      address: '808 Fir St, Lakeside',
      borrowedItems: 0,
      returnedLate: 0,
      successRate: 100,
      disabled: false,
    },
    {
      id: this.index++ + '',
      username: 'quentin',
      email: 'quentin@example.com',
      flatNumber: '12L',
      address: '909 Poplar St, Hilltop',
      borrowedItems: 0,
      returnedLate: 0,
      successRate: 100,
      disabled: false,
    },
    {
      id: this.index++ + '',
      username: 'arthur',
      email: 'arthur@example.com',
      flatNumber: '13M',
      address: '1010 Cypress St, Valleyview',
      borrowedItems: 0,
      returnedLate: 0,
      successRate: 100,
      disabled: false,
    },
    {
      id: this.index++ + '',
      username: 'marie',
      email: 'marie@example.com',
      flatNumber: '14N',
      address: '1111 Redwood St, Mountainview',
      borrowedItems: 0,
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
