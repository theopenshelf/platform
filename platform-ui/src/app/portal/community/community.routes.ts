import { Routes } from '@angular/router';
import CommunityLayoutComponent from './community-layout/community-layout.component';
import { AddItemComponent } from './pages/add-item/add-item.component';
import { ItemComponent } from './pages/item/item.component';
import { ItemsComponent } from './pages/items/items.component';
import { LibraryComponent } from './pages/libraries/library/library.component';
import { MyLibrariesComponent } from './pages/libraries/my-libraries/my-libraries.component';
import { MyborroweditemsComponent } from './pages/myborroweditems/myborroweditems.component';

export const COMMUNITY_ROUTES: Routes = [

  {
    path: '',
    component: CommunityLayoutComponent,
    children: [
      { path: '', redirectTo: 'items', pathMatch: 'full' }, // Redirect to 'profile'
      { path: 'items', component: ItemsComponent },
      { path: 'item/add', component: AddItemComponent },
      { path: 'items/:id', component: ItemComponent },
      { path: 'my-borrowed-items', component: MyborroweditemsComponent },
      { path: 'libraries', component: MyLibrariesComponent },
      { path: 'libraries/:id', component: LibraryComponent },
      {
        path: 'settings',
        loadChildren: () => import('./pages/settings/settings.routes').then(m => m.SETTINGS_ROUTES),
      },
    ],
  },
];