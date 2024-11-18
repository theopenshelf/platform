import { TuiRoot } from "@taiga-ui/core";
import { RouterOutlet } from '@angular/router';
import {KeyValuePipe, NgForOf} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {tuiAsPortal, TuiPortals, TuiRepeatTimes} from '@taiga-ui/cdk';
import {
    TuiAppearance,
    TuiButton,
    TuiDataList,
    TuiDropdown,
    TuiDropdownService,
    TuiIcon,
    TuiTitle,
} from '@taiga-ui/core';
import {
    TuiAvatar,
    TuiBadge,
    TuiBadgeNotification,
    TuiChevron,
    TuiDataListDropdownManager,
    TuiFade,
    TuiSwitch,
    TuiTabs,
} from '@taiga-ui/kit';
import {TuiCardLarge, TuiHeader, TuiNavigation} from '@taiga-ui/layout';

@Component({
  selector: 'app-public-landing-page',
  standalone: true,
  imports: [
    RouterOutlet,
    TuiRoot,
    FormsModule,
    KeyValuePipe,
    NgForOf,
    RouterLink,
    RouterLinkActive,
    TuiAppearance,
    TuiAvatar,
    TuiBadge,
    TuiBadgeNotification,
    TuiButton,
    TuiCardLarge,
    TuiChevron,
    TuiRepeatTimes,
    TuiAppearance,
    TuiCardLarge,
    TuiAvatar,
    TuiDataList,
    TuiDataListDropdownManager,
    TuiDropdown,
    TuiFade,
    TuiHeader,
    TuiIcon,
    TuiNavigation,
    TuiSwitch,
    TuiTabs,
    TuiTitle,
],
  templateUrl: './public-landing-page.component.html',
  styleUrl: './public-landing-page.component.css',
  providers: [TuiDropdownService, tuiAsPortal(TuiDropdownService)],
})
export class PublicLandingPageComponent  extends TuiPortals {

}
