import { Observable } from 'rxjs';
import { UIUser } from '../models/UIUser';

export interface UserInfo {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  user: UIUser;
}

// Define the interface for AuthService
export interface AuthService {
  message: string;
  getCurrentUserInfo(): UserInfo;
  getUserProfile(): Observable<UIUser>;
  initializeSession(): Promise<void>;
  signIn(username: string, password: string): Observable<boolean>;
  hasRole(role: string): boolean;
  signUp(
    email: string,
    username: string,
    password: string,
    streetAddress: string,
    city: string,
    postalCode: string,
    country: string,
  ): Observable<boolean>;
  signOut(): Observable<boolean>;
  isAuthenticated(): Observable<boolean>;
  resetPassword(email: string): Observable<boolean>;
  confirmResetPassword(token: string, newPassword: string): Observable<boolean>;
  verifyEmail(token: string): Observable<boolean>;
}
