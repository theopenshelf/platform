import { Component, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiAppearance, TuiAutoColorPipe, TuiButton, TuiIcon, TuiInitialsPipe, TuiTitle } from '@taiga-ui/core';
import { TuiAvatar, TuiAvatarStack } from '@taiga-ui/kit';
import { TuiCardMedium } from '@taiga-ui/layout';
import { LIBRARIES_SERVICE_TOKEN } from '../../../community.provider';
import { UILibrary } from '../../../models/UILibrary';
import { LibrariesService } from '../../../services/libraries.service';

@Component({
  selector: 'app-libraries',
  imports: [
    RouterModule,
    TuiAppearance,
    TuiAutoColorPipe,
    TuiAvatar,
    TuiAvatarStack,
    TuiCardMedium,
    TuiTitle,
    TuiInitialsPipe,
    TuiButton,
    TuiIcon
  ],
  templateUrl: './libraries.component.html',
  styleUrl: './libraries.component.scss'
})
export class LibrariesComponent {
  libraries: UILibrary[] = [];

  constructor(@Inject(LIBRARIES_SERVICE_TOKEN) private librariesService: LibrariesService) {
    this.librariesService.getLibraries().subscribe((libraries) => {
      this.libraries = libraries;
    });
  }
}
