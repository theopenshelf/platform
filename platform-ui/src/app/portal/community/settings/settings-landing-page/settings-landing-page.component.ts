import { Component } from '@angular/core';
import { provideRouter, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { SETTINGS_ROUTES } from '../settings.routes';
import { TuiAppearance, TuiAutoColorPipe, TuiIcon, TuiInitialsPipe } from '@taiga-ui/core';
import { tuiLayoutIconsProvider } from '@taiga-ui/layout';
import { TuiPortals } from '@taiga-ui/cdk';
import { TuiAvatar } from '@taiga-ui/kit';

@Component({
  selector: 'app-settings-landing-page',
  imports: [
    TuiAutoColorPipe,
    TuiInitialsPipe,
    TuiAvatar,
    TuiIcon,
    RouterLinkActive,
    RouterOutlet,
    RouterLink],
  providers: [
    tuiLayoutIconsProvider({ grid: '@tui.align-justify' }),

  ],
  templateUrl: './settings-landing-page.component.html',
  styleUrl: './settings-landing-page.component.css'
})
export class SettingsLandingPageComponent extends TuiPortals {

}
