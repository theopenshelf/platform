import { Routes } from '@angular/router';
import { SettingsLandingPageComponent } from './settings-landing-page/settings-landing-page.component';
import { ProfileComponent } from './profile/profile.component';
import { LocationsComponent } from './locations/locations.component';
import { MyItemsComponent } from './my-items/my-items.component';

export const SETTINGS_ROUTES: Routes = [

    {
      path: '',
      component: SettingsLandingPageComponent,
      children: [
        { path: '', redirectTo: 'profile', pathMatch: 'full' }, // Redirect to 'profile'
        { path: 'profile', component: ProfileComponent },
        { path: 'locations', component: LocationsComponent },
        { path: 'my-items', component: MyItemsComponent },
      ],
    },
  ];