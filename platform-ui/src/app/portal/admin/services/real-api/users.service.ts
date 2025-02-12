import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersAdminApiService } from '../../../../api-client/api/usersAdminApi.service';
import { UserWithStats } from '../../../../api-client/model/userWithStats';
import { UIUser } from '../../../community/models/UIUser';
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
}
