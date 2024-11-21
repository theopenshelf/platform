import { Routes } from '@angular/router';
import { HomeComponent } from './portal/community/pages/home/home.component';
import { ItemComponent } from './portal/community/pages/item/item.component';
import { ItemsComponent } from './portal/community/pages/items/items.component';
import { MyborroweditemsComponent } from './portal/community/pages/myborroweditems/myborroweditems.component';
import { SignInComponent } from './portal/public/auth/sign-in/sign-in.component';
import { SignUpComponent } from './portal/public/auth/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './portal/public/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './portal/public/auth/reset-password/reset-password.component';
import { EmailConfirmationComponent } from './portal/public/auth/email-confirmation/email-confirmation.component';
import { CommunityGuard } from './guards/community-guards';
import { AdminGuard } from './guards/admin-guards';

export const routes: Routes = [
    {
      path: 'community',
      loadChildren: () => import('./portal/community/community.routes').then(m => m.COMMUNITY_ROUTES),
      canActivate: [CommunityGuard], // Protect with CommunityGuard
    },
    {
      path: 'admin',
      loadChildren: () => import('./portal/admin/admin.routes').then(m => m.ADMIN_ROUTES),
      canActivate: [AdminGuard], // Protect with AdminGuard
    },
    {
      path: '',
      loadChildren: () => import('./portal/public/public.routes').then(m => m.PUBLIC_ROUTES),
    },

  // Catch-all route for unknown paths
  { path: '**', redirectTo: '' },
  ];