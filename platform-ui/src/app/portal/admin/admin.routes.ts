import { Routes } from '@angular/router';
import { AdminLandingPageComponent } from './admin-landing-page/admin-landing-page.component';
import { UsersComponent } from './pages/users/users.component';
import { ItemsComponent } from './pages/items/items.component';
import { SecurityComponent } from './pages/security/security.component';


export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLandingPageComponent,
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' }, // Redirect to 'profile'
      { path: 'users', component: UsersComponent },
      { path: 'items', component: ItemsComponent },
      { path: 'security', component: SecurityComponent },
    ],
  },
];