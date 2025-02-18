import { Routes } from '@angular/router';
import { AdminGuard } from './guards/admin-guards';
import { HubGuard } from './guards/hub-guards';

export const routes: Routes = [
  {
    path: 'hub',
    loadChildren: () =>
      import('./portal/hub/hub.routes').then(
        (m) => m.COMMUNITY_ROUTES,
      ),
    canActivate: [HubGuard], // Protect with HubGuard
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./portal/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
    canActivate: [AdminGuard], // Protect with AdminGuard
  },
  {
    path: '',
    loadChildren: () =>
      import('./portal/public/public.routes').then((m) => m.PUBLIC_ROUTES),
  },

  // Catch-all route for unknown paths
  { path: '**', redirectTo: '' },
];
