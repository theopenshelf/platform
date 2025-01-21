import { Routes } from '@angular/router';
import { globalProviders } from '../../global.provider';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { adminProviders } from './admin.providers';
import { CategoriesComponent } from './pages/categories/categories.component';
import { EditCategoryComponent } from './pages/categories/edit-category.component';
import { CustomPagesEditComponent } from './pages/custom-pages-edit/custom-pages-edit.component';
import { CustomPagesComponent } from './pages/custom-pages/custom-pages.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EditUserComponent } from './pages/edit-user/edit-user.component';
import { FaqEditComponent } from './pages/faq-edit/faq-edit.component';
import { ItemsComponent } from './pages/items/items.component';
import { SecurityComponent } from './pages/security/security.component';
import { UsersComponent } from './pages/users/users.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    providers: [...adminProviders, ...globalProviders],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Redirect to 'profile'
      { path: 'users', component: UsersComponent },
      { path: 'users/add', component: EditUserComponent },
      { path: 'users/:id/edit', component: EditUserComponent },
      { path: 'items', component: ItemsComponent },
      { path: 'security', component: SecurityComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'categories/add', component: EditCategoryComponent },
      { path: 'categories/:id/edit', component: EditCategoryComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'pages', component: CustomPagesComponent },
      { path: 'pages/add', component: CustomPagesEditComponent },
      { path: 'pages/faq/edit', component: FaqEditComponent },
      { path: 'pages/:id/edit', component: CustomPagesEditComponent },
    ],
  },
];
