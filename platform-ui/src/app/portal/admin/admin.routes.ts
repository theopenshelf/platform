import { Routes } from '@angular/router';
import { AdminLandingPageComponent } from './admin-landing-page/admin-landing-page.component';
import { UsersComponent } from './pages/users/users.component';
import { ItemsComponent } from './pages/items/items.component';
import { SecurityComponent } from './pages/security/security.component';
import { EditUserComponent } from './pages/edit-user/edit-user.component';


export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLandingPageComponent,
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' }, // Redirect to 'profile'
      { path: 'users', component: UsersComponent },
      { path: 'users/add', component: EditUserComponent },
      { path: 'users/:id/edit', component: EditUserComponent },
      { path: 'items', component: ItemsComponent },
      { path: 'security', component: SecurityComponent },
    ],
  },
];