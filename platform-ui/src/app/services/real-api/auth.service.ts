import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthApiService, ResponseHelloWorld, User } from '../../api-client';
import { AuthService, UserInfo } from '../auth.service';


@Injectable({
  providedIn: 'root',
})
export class APIAuthService implements AuthService {
  private isAuthenticated$ = new BehaviorSubject<boolean>(false);
  private userRoles: string[] = ['admin', 'community']; // Store multiple roles
  message: string = '';
  userInfo: UserInfo = {
    "firstName": "unknown",
    "lastName": "unknown",
    "username": "unknown",
  };

  constructor(private router: Router, private authApiService: AuthApiService) {}


  getCurrentUserInfo(): UserInfo {
    return this.userInfo;
  }

  signIn(username: string, password: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.authApiService.login({
        username: username,
        password: password
      }).subscribe({
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
        }
      });
    });
  }

  // Check if the user has a specific role
  hasRole(role: string): boolean {
    return this.userRoles.includes(role);
  }


  signUp(email: string, password: string): void {
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