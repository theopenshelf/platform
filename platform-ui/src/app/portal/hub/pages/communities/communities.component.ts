import { Component, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  TuiAppearance,
  TuiAutoColorPipe,
  TuiButton,
  TuiIcon,
  TuiInitialsPipe,
  TuiTitle
} from '@taiga-ui/core';
import { TuiCardMedium } from '@taiga-ui/layout';
import { BreadcrumbService } from '../../../../components/tos-breadcrumbs/tos-breadcrumbs.service';
import { UICommunity } from '../../../../models/UICommunity';
import { COMMUNITIES_SERVICE_TOKEN } from '../../hub.provider';
import { TuiAvatar } from '@taiga-ui/kit';
import { CommunitiesService } from '../../services/communities.service';

@Component({
  selector: 'app-libraries',
  imports: [
    RouterModule,
    TuiAppearance,
    TuiCardMedium,
    TuiTitle,
    TuiButton,
    TuiIcon,
    TranslateModule,
    TuiAvatar,
    TuiInitialsPipe,
    TuiAutoColorPipe,
  ],
  templateUrl: './communities.component.html',
  styleUrl: './communities.component.scss',
})
export class CommunitiesComponent {
  communities: UICommunity[] = [];

  constructor(
    @Inject(COMMUNITIES_SERVICE_TOKEN) private communitiesService: CommunitiesService,
    private breadcrumbService: BreadcrumbService
  ) {
    this.communitiesService.getCommunities().subscribe((communities) => {
      this.communities = communities;
    });
    this.breadcrumbService.setBreadcrumbs([
      { caption: 'breadcrumb.communities', routerLink: '/hub/communities' }
    ]);
  }


  ngOnInit() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
