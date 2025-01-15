import { Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { SettingsLandingPageComponent } from './settings-landing-page/settings-landing-page.component';

export const SETTINGS_ROUTES: Routes = [
  {
    path: '',
    component: SettingsLandingPageComponent,
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' }, // Redirect to 'profile'
      { path: 'profile', component: ProfileComponent },
    ],
  },
];
