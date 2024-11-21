import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ItemComponent } from './pages/item/item.component';
import { ItemsComponent } from './pages/items/items.component';
import { MyborroweditemsComponent } from './pages/myborroweditems/myborroweditems.component';
import { CommunityLandingPageComponent } from './community-landing-page/community-landing-page.component';

export const COMMUNITY_ROUTES: Routes = [

    {
      path: '',
      component: CommunityLandingPageComponent,
      children: [
        { path: '', component: ItemsComponent },
        { path: 'items', component: ItemsComponent },
        { path: 'item', component: ItemComponent },
        { path: 'my-borrowed-items', component: MyborroweditemsComponent },
      ],
    },
  ];