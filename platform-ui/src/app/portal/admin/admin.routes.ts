import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { UsersComponent } from './pages/users/users.component';
import { ItemsComponent } from './pages/items/items.component';
import { SecurityComponent } from './pages/security/security.component';
import { EditUserComponent } from './pages/edit-user/edit-user.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { EditCategoryComponent } from './pages/categories/edit-category.component';


export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' }, // Redirect to 'profile'
      { path: 'users', component: UsersComponent },
      { path: 'users/add', component: EditUserComponent },
      { path: 'users/:id/edit', component: EditUserComponent },
      { path: 'items', component: ItemsComponent },
      { path: 'security', component: SecurityComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'categories/add', component: EditCategoryComponent },
      { path: 'categories/:id/edit', component: EditCategoryComponent },
    ],
  },
];