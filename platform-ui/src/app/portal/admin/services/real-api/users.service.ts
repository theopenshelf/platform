import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersAdminApiService } from '../../../../api-client/api/usersAdminApi.service';
import { UserWithStats } from '../../../../api-client/model/userWithStats';
import { UIUser } from '../../../../models/UIUser';
import { UsersService } from '../users.service';

@Injectable({
  providedIn: 'root',
})
export class ApiUsersService implements UsersService {
  constructor(private usersAdminApiService: UsersAdminApiService) { }

  getUsers(): Observable<UIUser[]> {
    return this.usersAdminApiService.getUsers();
  }


  getUser(id: string): Observable<UIUser> {
    return this.usersAdminApiService.getUser(id);
  }

  saveUser(user: UIUser): Observable<UIUser> {
    return this.usersAdminApiService.saveUser(user as UserWithStats);
  }

  setUserPassword(userId: string, newPassword: string): Observable<void> {
    return this.usersAdminApiService.setUserPassword(userId, {
      newPassword: newPassword,
    });
  }

  private mapToApiUser(uiUser: UIUser): UserWithStats {
    return {
      id: uiUser.id,
      email: uiUser.email,
      flatNumber: uiUser.flatNumber,
      streetAddress: uiUser.streetAddress,
      city: uiUser.city,
      postalCode: uiUser.postalCode,
      country: uiUser.country,
      username: uiUser.username,
      firstName: uiUser.firstName,
      lastName: uiUser.lastName,
      isEmailVerified: uiUser.isEmailVerified,
      disabled: uiUser.disabled,
      avatarUrl: uiUser.avatarUrl,
      preferredLanguage: uiUser.preferredLanguage,
      roles: [],
      borrowedItems: uiUser.borrowedItems,
      returnedLate: uiUser.returnedLate,
      successRate: uiUser.successRate,
    };
  }

  private mapToUIUser(user: UserWithStats): UIUser {
    return {
      id: user.id,
      email: user.email || '',
      flatNumber: user.flatNumber || '',
      streetAddress: user.streetAddress || '',
      city: user.city || '',
      postalCode: user.postalCode || '',
      country: user.country || '',
      username: user.username || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      isEmailVerified: user.isEmailVerified || false,
      disabled: user.disabled || false,
      borrowedItems: user.borrowedItems,
      returnedLate: user.returnedLate,
      successRate: user.successRate,
      avatarUrl: user.avatarUrl || '',
      preferredLanguage: user.preferredLanguage || '',
    };
  }
}
