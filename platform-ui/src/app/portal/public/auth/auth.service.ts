import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated$ = new BehaviorSubject<boolean>(false);

  signIn(email: string, password: string): boolean {
    // Mock login (Replace with actual backend logic)
    if (email === 'test@example.com' && password === 'password123') {
      this.isAuthenticated$.next(true);
      return true;
    }
    return false;
  }

  signUp(email: string, password: string): void {
    // Mock sign up logic (replace with backend API call)
    console.log('User registered:', { email, password });
  }

  signOut(): void {
    this.isAuthenticated$.next(false);
  }

  isAuthenticated() {
    return this.isAuthenticated$.asObservable();
  }

  resetPassword(email: string): void {
    console.log(`Password reset email sent to: ${email}`);
  }
}