import { Inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AUTH_SERVICE_TOKEN } from '../global.provider';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(): boolean {
    if (
      this.authService.isAuthenticated() &&
      this.authService.hasRole('admin')
    ) {
      return true;
    }
    this.router.navigate(['/']); // Redirect to the home page if unauthorized
    return false;
  }
}
