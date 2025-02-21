import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { TuiAvatar, TuiPagination } from '@taiga-ui/kit';
import { TuiCardMedium } from '@taiga-ui/layout';
import { BreadcrumbService } from '../../../../components/tos-breadcrumbs/tos-breadcrumbs.service';
import { AUTH_SERVICE_TOKEN } from '../../../../global.provider';
import { GetCommunitiesParams } from '../../../../models/GetCommunitiesParams';
import { UICommunitiesPagination } from '../../../../models/UICommunitiesPagination';
import { UICommunity } from '../../../../models/UICommunity';
import { AuthService } from '../../../../services/auth.service';
import { COMMUNITIES_SERVICE_TOKEN } from '../../hub.provider';
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
    FormsModule,
    TuiPagination,
  ],
  templateUrl: './communities.component.html',
  styleUrl: './communities.component.scss',
})
export class CommunitiesComponent {
  communities: UICommunity[] = [];
  searchText = '';
  getCommunitiesParams: GetCommunitiesParams = {
    pageSize: 5
  };

  // Pagination properties
  totalPages: number = 10;
  currentPage: number = 0;
  itemsPerPage: number = 12; // Default value

  constructor(
    @Inject(COMMUNITIES_SERVICE_TOKEN) private communitiesService: CommunitiesService,
    private breadcrumbService: BreadcrumbService,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthService
  ) {
    this.refreshCommunities();
    this.breadcrumbService.setBreadcrumbs([
      { caption: 'breadcrumb.communities', routerLink: '/hub/communities' }
    ]);
  }

  onTextFilterChange() {
    this.getCommunitiesParams.searchText = this.searchText;
    this.refreshCommunities();
  }

  ngOnInit() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  requestToJoin(community: UICommunity) {
    const user = this.authService.getCurrentUserInfo();
    this.communitiesService.addMember(community.id, {
      ...user.user,
      role: 'requestingJoin'
    }).subscribe();
  }

  protected updatePagination(communitiesPagination: UICommunitiesPagination) {
    this.totalPages = communitiesPagination.totalPages;
    this.currentPage = communitiesPagination.currentPage;
    this.itemsPerPage = communitiesPagination.itemsPerPage;
    this.communities = communitiesPagination.items;
  }

  // Public methods
  goToPage(page: number) {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.getCommunitiesParams.page = page;
    this.refreshCommunities();
  }

  refreshCommunities() {
    this.communitiesService.getCommunities(this.getCommunitiesParams).subscribe((communities) => {
      this.updatePagination(communities);
    });
  }
}
