import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TuiAlertService } from '@taiga-ui/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthApiService, User } from '../../api-client';
import { AuthService, UserInfo } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class APIAuthService implements AuthService {
  private isAuthenticated$ = new BehaviorSubject<boolean>(false);
  private userRoles: string[] = ['admin', 'hub']; // Store multiple roles
  message: string = '';
  userInfo: UserInfo = {
    firstName: 'unknown',
    lastName: 'unknown',
    username: 'unknown',
    email: 'unknown',
    user: {
      id: 'unknown',
      username: 'unknown',
      email: 'unknown',
      avatarUrl: 'unknown',
      disabled: false,
      isEmailVerified: false,
      firstName: 'unknown',
      lastName: 'unknown',
      borrowedItems: 0,
      returnedLate: 0,
      successRate: 0,
      streetAddress: 'unknown',
      city: 'unknown',
      postalCode: 'unknown',
      country: 'unknown',
    },
  };

  constructor(
    private router: Router,
    private authApiService: AuthApiService,
    private alerts: TuiAlertService,
  ) { }

  verifyEmail(token: string): Observable<boolean> {
    return this.authApiService.verifyEmail(token).pipe(
      map((response) => {
        return response.success;
      })
    );
  }
  getCurrentUserInfo(): UserInfo {
    return this.userInfo;
  }

  signIn(username: string, password: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.authApiService
        .login({
          username: username,
          password: password,
        })
        .subscribe({
          next: (user: User) => {
            this.isAuthenticated$.next(true);
            this.userRoles = user.roles; // Assuming the user object has a roles property
            this.userInfo.firstName = user.firstName;
            this.userInfo.lastName = user.lastName;
            this.userInfo.username = user.username;
            this.userInfo.email = user.email ?? 'unknown';
            this.userInfo.user = {
              id: user.id,
              username: user.username,
              email: user.email ?? 'unknown',
              avatarUrl: user.avatarUrl ?? 'unknown',
              disabled: user.disabled ?? false,
              isEmailVerified: user.isEmailVerified ?? false,
              firstName: user.firstName ?? 'unknown',
              lastName: user.lastName ?? 'unknown',
              borrowedItems: 0,
              returnedLate: 0,
              successRate: 0,
              streetAddress: user.streetAddress ?? 'unknown',
              city: user.city ?? 'unknown',
              postalCode: user.postalCode ?? 'unknown',
              country: user.country ?? 'unknown',
            };
            observer.next(true);
            observer.complete();
          },
          error: (error) => {
            observer.next(false);
            observer.complete();
          },
        });
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
  ): Observable<boolean> {
    // Mock sign up logic (replace with backend API call)
    return new Observable<boolean>((observer) => {
      this.authApiService
        .signUp({
          email: email,
          username: username,
          password: password,
          streetAddress: streetAddress,
          city: city,
          postalCode: postalCode,
          country: country,
        })
        .subscribe({
          next: (response) => {
            observer.next(true);
            observer.complete();
          },
        });
    });
  }

  signOut(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.authApiService.signOut()
        .subscribe({
          next: (response) => {
            observer.next(true);
            observer.complete();
          },
        });
    });
  }

  isAuthenticated() {
    return this.isAuthenticated$.asObservable();
  }

  resetPassword(email: string): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.authApiService.resetPassword({
        email: email,
      }).subscribe({
        next: () => {
          observer.next(true);
          observer.complete();
        },
        error: () => {
          observer.next(false);
          observer.complete();
        }
      });
    });
  }

  confirmResetPassword(token: string, newPassword: string): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.authApiService.confirmResetPassword({
        token: token,
        newPassword: newPassword,
      }).subscribe({
        next: () => {
          observer.next(true);
          observer.complete();
        },
        error: () => {
          observer.next(false);
          observer.complete();
        }
      });
    });
  }
}
