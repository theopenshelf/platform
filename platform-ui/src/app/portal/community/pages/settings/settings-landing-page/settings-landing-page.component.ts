import { Component, Inject } from '@angular/core';
import { provideRouter, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { SETTINGS_ROUTES } from '../settings.routes';
import { TuiAppearance, TuiAutoColorPipe, TuiIcon, TuiInitialsPipe } from '@taiga-ui/core';
import { tuiLayoutIconsProvider } from '@taiga-ui/layout';
import { TuiPortals } from '@taiga-ui/cdk';
import { TuiAvatar } from '@taiga-ui/kit';
import { AuthService, UserInfo } from '../../../../../services/auth.service';
import { AUTH_SERVICE_TOKEN, globalProviders } from '../../../../../global.provider';

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
    ...globalProviders,
    tuiLayoutIconsProvider({ grid: '@tui.align-justify' }),

  ],
  templateUrl: './settings-landing-page.component.html',
  styleUrl: './settings-landing-page.component.scss'
})
export class SettingsLandingPageComponent extends TuiPortals {
  protected userInfo: UserInfo;

  constructor(
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthService
  ) {
    super();
    this.userInfo = this.authService.getCurrentUserInfo()
  }

}
