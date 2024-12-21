import { Routes } from '@angular/router';
import { AdminGuard } from './guards/admin-guards';
import { CommunityGuard } from './guards/community-guards';

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