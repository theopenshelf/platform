import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import AuthService from '../services/mock/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CommunityGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated() && this.authService.hasRole('community')) {
        return true;
    }
    this.router.navigate(['/']); // Redirect to the home page if unauthorized
    return false;
  }
}