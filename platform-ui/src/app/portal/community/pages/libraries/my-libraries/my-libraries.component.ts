import { AsyncPipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiResponsiveDialogService } from '@taiga-ui/addon-mobile';
import { TuiAlertService, TuiAppearance, TuiAutoColorPipe, TuiFallbackSrcPipe, TuiIcon, TuiInitialsPipe, TuiTitle } from '@taiga-ui/core';
import { TUI_CONFIRM, TuiAvatar, TuiAvatarStack, TuiConfirmData } from '@taiga-ui/kit';
import { TuiCardLarge, TuiCardMedium } from '@taiga-ui/layout';
import { switchMap } from 'rxjs/operators';
import { communityProviders, LIBRARIES_SERVICE_TOKEN } from '../../../community.provider';
import { UILibrary } from '../../../models/UILibrary';
import { LibrariesService } from '../../../services/libraries.service';

@Component({
  selector: 'app-my-libraries',
  imports: [
    RouterModule,
    AsyncPipe,
    TuiAppearance,
    TuiAutoColorPipe,
    TuiAvatar,
    TuiAvatarStack,
    TuiCardMedium,
    TuiFallbackSrcPipe,
    TuiTitle,
    TuiInitialsPipe,
    TuiCardLarge,
    TuiIcon
  ],
  templateUrl: './my-libraries.component.html',
  styleUrl: './my-libraries.component.scss'
})
export class MyLibrariesComponent {
  libraries: UILibrary[] = [];

  constructor(@Inject(LIBRARIES_SERVICE_TOKEN) private librariesService: LibrariesService) {
    this.librariesService.getLibraries().subscribe((libraries) => {
      this.libraries = libraries;
    });
  }
}
