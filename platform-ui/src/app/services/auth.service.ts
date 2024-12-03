import { Observable } from 'rxjs';

export interface UserInfo {
  firstName: string;
  lastName: string;
  username: string;
}

// Define the interface for AuthService
export interface AuthService {
  message: string;
  getCurrentUserInfo(): UserInfo;
  signIn(username: string, password: string): boolean;
  hasRole(role: string): boolean;
  signUp(email: string, password: string): void;
  signOut(): void;
  isAuthenticated(): Observable<boolean>;
  resetPassword(email: string): void;
}