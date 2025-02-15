import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthApiService } from '../../api-client';
import { MockUsersService } from '../../portal/community/services/mock/users.service';
import { AuthService, UserInfo } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class MockAuthService implements AuthService {
  private isAuthenticated$ = new BehaviorSubject<boolean>(false);
  private userRoles: string[] = ['admin', 'community']; // Store multiple roles
  message: string = '';

  private userInfo: UserInfo = {
    firstName: 'demo',
    lastName: 'demo',
    username: 'demo',
    email: 'me@example.com',
    user: {
      id: '1',
      username: 'demo',
      email: 'me@example.com',
      firstName: 'demo',
      lastName: 'demo',
      avatarUrl: 'https://mdbcdn.b-cdn.net/img/new/avatars/2.webp',
      disabled: false,
      isEmailVerified: true,
      borrowedItems: 0,
      returnedLate: 0,
      successRate: 0,
      streetAddress: '123 Main St',
      city: 'Anytown',
      postalCode: '12345',
      country: 'USA',
    },
  };

  constructor(
    private router: Router,
    private authApiService: AuthApiService,
    private usersService: MockUsersService,
  ) {
    this.userInfo.user = this.usersService.getUserByUsername('me');
  }

  getCurrentUserInfo(): UserInfo {
    return this.userInfo;
  }

  signIn(username: string, password: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      if (username === 'admin' && password === 'password') {
        this.isAuthenticated$.next(true);
        this.userRoles = ['admin', 'community'];
        this.userInfo = {
          firstName: 'admin',
          lastName: 'admin',
          username: 'admin',
          email: 'admin@example.com',
          user: this.usersService.getUserByUsername(username),
        }
        observer.next(true);
        observer.complete();
      }
      else if (username === 'demo' && password === 'password') {
        this.isAuthenticated$.next(true);
        this.userRoles = ['admin', 'community'];
        this.userInfo = {
          firstName: 'demo',
          lastName: 'demo',
          username: 'demo',
          email: 'me@example.com',
          user: this.usersService.getUserByUsername('me'),
        }
        observer.next(true);
        observer.complete();
      } else if (username === 'alice' && password === 'password') {
        this.isAuthenticated$.next(true);
        this.userRoles = ['community'];
        this.userInfo = {
          firstName: 'alice',
          lastName: 'dupont',
          username: 'alice',
          email: 'alice@example.com',
          user: this.usersService.getUserByUsername(username),
        }
        observer.next(true);
        observer.complete();
      } else if (username === 'bob' && password === 'password') {
        this.isAuthenticated$.next(true);
        this.userRoles = ['community'];
        this.userInfo = {
          firstName: 'bob',
          lastName: 'durand',
          username: 'bob',
          email: 'bob@example.com',
          user: this.usersService.getUserByUsername(username),
        }
        observer.next(true);
        observer.complete();
      }

      else {
        observer.next(false);
        observer.complete();
      }
    });
  }

  // Check if the user has a specific role
  hasRole(role: string): boolean {
    return this.userRoles.includes(role);
  }

  signUp(
    email: string,
    username: string,
    password: string,
    streetAddress: string,
    city: string,
    postalCode: string,
    country: string,
  ): void {
    // Mock sign up logic (replace with backend API call)
    console.log('User registered:', { email, password });
  }

  signOut(): void {
    this.isAuthenticated$.next(false);
    this.userRoles = [];
    this.router.navigate(['/']);
  }

  isAuthenticated() {
    return this.isAuthenticated$.asObservable();
  }

  resetPassword(email: string): void {
    console.log(`Password reset email sent to: ${email}`);
  }
}
