import { Component, Inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TuiPortals } from '@taiga-ui/cdk';
import {
  TuiButton,
  TuiDataList,
  TuiDropdown,
  TuiIcon
} from '@taiga-ui/core';
import { tuiLayoutIconsProvider } from '@taiga-ui/layout';
import { UserAvatarComponent } from '../../../../../components/user-avatar/user-avatar.component';
import {
  AUTH_SERVICE_TOKEN,
  getGlobalProviders,
} from '../../../../../global.provider';
import { AuthService, UserInfo } from '../../../../../services/auth.service';

@Component({
  selector: 'app-settings-landing-page',
  imports: [
    TuiIcon,
    TuiButton,
    RouterLinkActive,
    RouterOutlet,
    RouterLink,
    TuiDataList,
    TuiDropdown,
    UserAvatarComponent,
  ],
  providers: [
    ...getGlobalProviders(),
    tuiLayoutIconsProvider({ grid: '@tui.align-justify' }),
  ],
  templateUrl: './settings-landing-page.component.html',
  styleUrl: './settings-landing-page.component.scss',
})
export class SettingsLandingPageComponent extends TuiPortals {
  protected userInfo: UserInfo;

  constructor(@Inject(AUTH_SERVICE_TOKEN) private authService: AuthService) {
    super();
    this.userInfo = this.authService.getCurrentUserInfo();
  }
}
