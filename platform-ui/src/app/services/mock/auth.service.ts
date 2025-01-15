import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthApiService, ResponseHelloWorld, User } from '../../api-client';
import { AuthService, UserInfo } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class MockAuthService implements AuthService {
  private isAuthenticated$ = new BehaviorSubject<boolean>(false);
  private userRoles: string[] = ['admin', 'community']; // Store multiple roles
  message: string = '';

  constructor(
    private router: Router,
    private authApiService: AuthApiService,
  ) {}

  getCurrentUserInfo(): UserInfo {
    return {
      firstName: 'Quentin',
      lastName: 'Castel',
      username: 'qcastel',
    };
  }

  signIn(username: string, password: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      if (username === 'admin' && password === 'password') {
        this.isAuthenticated$.next(true);
        this.userRoles = ['admin', 'community'];
        observer.next(true);
        observer.complete();
      } else if (username === 'alice' && password === 'password') {
        this.isAuthenticated$.next(true);
        this.userRoles = ['community'];
        observer.next(true);
        observer.complete();
      } else {
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
