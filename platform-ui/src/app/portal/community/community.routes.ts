import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ItemComponent } from './pages/item/item.component';
import { ItemsComponent } from './pages/items/items.component';
import { MyborroweditemsComponent } from './pages/myborroweditems/myborroweditems.component';
import CommunityLayoutComponent from './community-layout/community-layout.component';
import { AddItemComponent } from './pages/add-item/add-item.component';

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
        {
          path: 'settings',
          loadChildren: () => import('./pages/settings/settings.routes').then(m => m.SETTINGS_ROUTES),
        },
      ],
    },
  ];