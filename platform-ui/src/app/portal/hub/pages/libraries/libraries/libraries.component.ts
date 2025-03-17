import { ChangeDetectorRef, Component, Inject, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  TuiAppearance,
  TuiButton,
  TuiIcon,
  TuiTitle
} from '@taiga-ui/core';
import { TuiCardMedium } from '@taiga-ui/layout';
import { BreadcrumbService } from '../../../../../components/tos-breadcrumbs/tos-breadcrumbs.service';
import { UILibrary } from '../../../../../models/UILibrary';
import { LIBRARIES_SERVICE_TOKEN } from '../../../hub.provider';
import { LibrariesService } from '../../../services/libraries.service';

@Component({
  selector: 'libraries',
  imports: [
    RouterModule,
    TuiAppearance,
    TuiCardMedium,
    TuiTitle,
    TuiButton,
    TuiIcon,
    TranslateModule
  ],
  templateUrl: './libraries.component.html',
  styleUrl: './libraries.component.scss',
})
export class LibrariesComponent {
  public communityId = input.required<string>();
  libraries: UILibrary[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(LIBRARIES_SERVICE_TOKEN) private librariesService: LibrariesService,
    private breadcrumbService: BreadcrumbService
  ) {
  }


  ngOnInit() {
    this.librariesService.getLibrariesByCommunityId(this.communityId()).subscribe((libraries) => {
      this.libraries = libraries;
      this.cdr.detectChanges();
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
