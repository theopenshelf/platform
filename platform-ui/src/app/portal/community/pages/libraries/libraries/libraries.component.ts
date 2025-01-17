import { Component, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  TuiAppearance,
  TuiButton,
  TuiIcon,
  TuiTitle
} from '@taiga-ui/core';
import { TuiCardMedium } from '@taiga-ui/layout';
import { LIBRARIES_SERVICE_TOKEN } from '../../../community.provider';
import { UILibrary } from '../../../models/UILibrary';
import { LibrariesService } from '../../../services/libraries.service';

@Component({
  selector: 'app-libraries',
  imports: [
    RouterModule,
    TuiAppearance,
    TuiCardMedium,
    TuiTitle,
    TuiButton,
    TuiIcon
  ],
  templateUrl: './libraries.component.html',
  styleUrl: './libraries.component.scss',
})
export class LibrariesComponent {
  libraries: UILibrary[] = [];

  constructor(
    @Inject(LIBRARIES_SERVICE_TOKEN) private librariesService: LibrariesService,
  ) {
    this.librariesService.getLibraries().subscribe((libraries) => {
      this.libraries = libraries;
    });
  }
}
