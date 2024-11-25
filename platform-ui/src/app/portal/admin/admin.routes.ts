import { Routes } from '@angular/router';
import { AdminLandingPageComponent } from './admin-landing-page/admin-landing-page.component';
import { UsersComponent } from './users/users.component';
import { ItemsComponent } from './items/items.component';
import { SecurityComponent } from './security/security.component';


export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLandingPageComponent,
    children: [
      { path: '', component: UsersComponent },
      { path: 'users', component: UsersComponent },
      { path: 'items', component: ItemsComponent },
      { path: 'security', component: SecurityComponent },
    ],
  },
];