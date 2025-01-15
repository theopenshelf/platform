import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TuiAlertService } from '@taiga-ui/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthApiService, User } from '../../api-client';
import { AuthService, UserInfo } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class APIAuthService implements AuthService {
  private isAuthenticated$ = new BehaviorSubject<boolean>(false);
  private userRoles: string[] = ['admin', 'community']; // Store multiple roles
  message: string = '';
  userInfo: UserInfo = {
    firstName: 'unknown',
    lastName: 'unknown',
    username: 'unknown',
  };

  constructor(
    private router: Router,
    private authApiService: AuthApiService,
    private alerts: TuiAlertService,
  ) {}

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
  ): void {
    // Mock sign up logic (replace with backend API call)
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
          this.router.navigate(['/']);
          this.alerts
            .open(`Successfully signed up`, { appearance: 'positive' })
            .subscribe();
        },
      });
  }

  signOut(): void {
    this.authApiService.signOut().subscribe({
      next: (response) => {
        this.isAuthenticated$.next(false);
        this.userRoles = [];
        this.router.navigate(['/']);
        this.alerts
          .open(`Successfully logged out`, { appearance: 'positive' })
          .subscribe();
      },
    });
  }

  isAuthenticated() {
    return this.isAuthenticated$.asObservable();
  }

  resetPassword(email: string): void {
    this.authApiService
      .resetPassword({
        email: email,
      })
      .subscribe({
        next: (response) => {
          console.log('Password reset email sent:', response);
        },
      });
  }
}
