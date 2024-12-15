import { AsyncPipe, CommonModule, NgForOf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiAppearance, TuiAutoColorPipe, TuiFallbackSrcPipe, TuiIcon, TuiInitialsPipe, TuiTitle } from '@taiga-ui/core';
import { TuiAvatar, TuiAvatarStack } from '@taiga-ui/kit';
import { TuiCardLarge, TuiCardMedium } from '@taiga-ui/layout';
import { communityProviders, LIBRARIES_SERVICE_TOKEN } from '../../../community.provider';
import { UILibrary } from '../../../models/UILibrary';
import { LibrariesService } from '../../../services/libraries.service';

@Component({
  selector: 'app-my-libraries',
  imports: [
    CommonModule,
    RouterModule,
    AsyncPipe,
    NgForOf,
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
  styleUrl: './my-libraries.component.scss',
  providers: [
    ...communityProviders,
  ]
})
export class MyLibrariesComponent {
  libraries: UILibrary[] = [];

  constructor(@Inject(LIBRARIES_SERVICE_TOKEN) private librariesService: LibrariesService) {
    this.librariesService.getLibraries().subscribe((libraries) => {
      this.libraries = libraries;
    });
  }

  addLibrary() {
    throw new Error('Method not implemented.');
  }
}
