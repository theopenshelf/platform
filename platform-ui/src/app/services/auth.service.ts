import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated$ = new BehaviorSubject<boolean>(false);
  private userRole: 'admin' | 'community' | null = null;

  constructor(private router: Router) {}

  signIn(username: string, password: string): boolean {
    // Mock login (Replace with actual backend logic)
    if (username === 'admin' && password === 'password') {
      this.isAuthenticated$.next(true);
      this.userRole = 'admin';
      return true;
    }
    if (username === 'alice' && password === 'password') {
      this.isAuthenticated$.next(true);
      this.userRole = 'community';
      return true;
    }
    return false;
  }

  getRole(): 'admin' | 'community' | null {
    return this.userRole;
  }

  signUp(email: string, password: string): void {
    // Mock sign up logic (replace with backend API call)
    console.log('User registered:', { email, password });
  }

  signOut(): void {
    this.isAuthenticated$.next(false);
    this.userRole = null;
    this.router.navigate(['/']);
  }

  isAuthenticated() {
    return this.isAuthenticated$.asObservable();
  }

  resetPassword(email: string): void {
    console.log(`Password reset email sent to: ${email}`);
  }
}