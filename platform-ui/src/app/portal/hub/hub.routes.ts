import { Routes } from '@angular/router';
import { getGlobalProviders } from '../../global.provider';
import HubLayoutComponent from './hub-layout/hub-layout.component';
import { hubProviders } from './hub.provider';
import { AddCommunityComponent } from './pages/add-community/add-community.component';
import { AddItemComponent } from './pages/add-item/add-item.component';
import { ApprovalDashboardComponent } from './pages/approval-dashboard/approval-dashboard.component';
import { BorrowedItemsComponent } from './pages/borroweditems/borroweditems.component';
import { CommunitiesComponent } from './pages/communities/communities.component';
import { CustomPageComponent } from './pages/custom-page/custom-page.component';
import { HelpCenterComponent } from './pages/help-center/help-center.component';
import { ItemComponent } from './pages/item/item.component';
import { ItemsComponent } from './pages/items/items.component';
import { EditLibraryComponent } from './pages/libraries/edit-library/edit-library.component';
import { LibrariesComponent } from './pages/libraries/libraries/libraries.component';
import { LibraryComponent } from './pages/libraries/library/library.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';

export const COMMUNITY_ROUTES: Routes = [
  {
    path: '',
    component: HubLayoutComponent,
    providers: [...hubProviders, ...getGlobalProviders()],
    children: [
      { path: '', redirectTo: 'items', pathMatch: 'full' }, // Redirect to 'profile'
      { path: 'items', component: ItemsComponent },
      { path: 'item/add', component: AddItemComponent },
      { path: 'items/:itemId', component: ItemComponent },
      { path: 'borrowed-items', component: BorrowedItemsComponent },
      { path: 'libraries', component: LibrariesComponent },
      { path: 'libraries/add-library', component: EditLibraryComponent },
      { path: 'libraries/:id', component: LibraryComponent },
      { path: 'libraries/:id/edit', component: EditLibraryComponent },
      { path: 'libraries/:id/items', component: LibraryComponent },
      { path: 'libraries/:id/borrow-records', component: LibraryComponent },
      { path: 'libraries/:id/approval', component: LibraryComponent },
      { path: 'libraries/:id/members', component: LibraryComponent },
      { path: 'wishlist', component: WishlistComponent },
      { path: 'help-center', component: HelpCenterComponent },
      { path: 'page/:ref', component: CustomPageComponent },
      { path: 'approval-dashboard', component: ApprovalDashboardComponent },
      { path: 'communities', component: CommunitiesComponent },
      { path: 'communities/add-community', component: AddCommunityComponent },
      {
        path: 'communities/:id',
        loadChildren: () =>
          import('./pages/community/community.routes').then(
            (m) => m.communityRoutes,
          ),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./pages/settings/settings.routes').then(
            (m) => m.SETTINGS_ROUTES,
          ),
      },
    ],
  },
];
