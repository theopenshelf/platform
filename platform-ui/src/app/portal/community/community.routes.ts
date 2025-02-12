import { Routes } from '@angular/router';
import { globalProviders } from '../../global.provider';
import CommunityLayoutComponent from './community-layout/community-layout.component';
import { communityProviders } from './community.provider';
import { AddItemComponent } from './pages/add-item/add-item.component';
import { BorrowedItemsComponent } from './pages/borroweditems/borroweditems.component';
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
    component: CommunityLayoutComponent,
    providers: [...communityProviders, ...globalProviders],
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
      { path: 'wishlist', component: WishlistComponent },
      { path: 'help-center', component: HelpCenterComponent },
      { path: 'page/:ref', component: CustomPageComponent },
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
