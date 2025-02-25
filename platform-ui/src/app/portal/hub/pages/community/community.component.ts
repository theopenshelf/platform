import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterModule,
} from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TuiResponsiveDialogService } from '@taiga-ui/addon-mobile';
import {
  TuiAlertService,
  TuiButton,
  TuiDataList,
  TuiIcon,
  TuiTextfield
} from '@taiga-ui/core';
import {
  TUI_CONFIRM,
  TuiAccordion,
  TuiConfirmData,
  TuiDataListWrapper,
  TuiTabs
} from '@taiga-ui/kit';
import {
  TuiSelectModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/legacy';
import { EMPTY, switchMap } from 'rxjs';
import { FilteredAndPaginatedItemsComponent } from '../../../../components/filtered-and-paginated-items/filtered-and-paginated-items.component';
import { FilteredAndPaginatedMembersComponent } from '../../../../components/filtered-and-paginated-members/filtered-and-paginated-members.component';
import { TosBreadcrumbsComponent } from '../../../../components/tos-breadcrumbs/tos-breadcrumbs.component';
import { BreadcrumbItem, BreadcrumbService } from '../../../../components/tos-breadcrumbs/tos-breadcrumbs.service';
import { AUTH_SERVICE_TOKEN } from '../../../../global.provider';
import { GetItemsParams } from '../../../../models/GetItemsParams';
import { UICommunity } from '../../../../models/UICommunity';
import { UICustomPage } from '../../../../models/UICustomPage';
import { UIUser } from '../../../../models/UIUser';
import { AuthService, UserInfo } from '../../../../services/auth.service';
import {
  COMMUNITIES_SERVICE_TOKEN,
  USERS_SERVICE_TOKEN
} from '../../hub.provider';
import { CommunitiesService } from '../../services/communities.service';
import { UsersService } from '../../services/users.service';
import { CustomPageComponent } from '../custom-page/custom-page.component';
import { CustomPagesEditComponent } from '../custom-pages-edit/custom-pages-edit.component';
import { LibrariesComponent } from '../libraries/libraries/libraries.component';
@Component({
  selector: 'app-community',
  imports: [
    RouterModule,
    RouterLink,
    FormsModule,
    TuiIcon,
    TuiAccordion,
    TuiButton,
    TuiIcon,
    TuiTextfieldControllerModule,
    ReactiveFormsModule,
    TuiTextfield,
    TuiDataList,
    TuiDataListWrapper,
    TuiSelectModule,
    TranslateModule,
    TosBreadcrumbsComponent,
    FilteredAndPaginatedMembersComponent,
    LibrariesComponent,
    CustomPageComponent,
    CustomPagesEditComponent,
    TuiTabs,
    FilteredAndPaginatedItemsComponent
  ],
  templateUrl: './community.component.html',
  styleUrl: './community.component.scss',
})
export class CommunityComponent {

  public getItemsParams: GetItemsParams | undefined;

  community: UICommunity | undefined;
  tabOpened: 'libraries' | 'members' | 'pages' | 'items' = 'pages';
  usersPerId: Map<string, UIUser> = new Map();
  userInfo: UserInfo | undefined;
  isAdmin: boolean = false;
  breadcrumbs: BreadcrumbItem[] = [];

  selectedPage: UICustomPage | undefined;
  pages: UICustomPage[] = [];
  editMode: boolean = false;
  activeTabIndex: number = 0;
  constructor(
    @Inject(COMMUNITIES_SERVICE_TOKEN) private communitiesService: CommunitiesService,
    @Inject(USERS_SERVICE_TOKEN) private userService: UsersService,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthService,
    private dialogs: TuiResponsiveDialogService,
    private alerts: TuiAlertService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private breadcrumbService: BreadcrumbService
  ) {
  }

  isCssLoaded = false;

  ngOnInit() {
    const communityId = this.route.snapshot.paramMap.get('id');
    this.userService.getUsers().subscribe((users) => {
      this.usersPerId = new Map(users.map(user => [user.id, user]));
    });
    this.userInfo = this.authService.getCurrentUserInfo();
    if (communityId) {
      this.communitiesService.getCommunity(communityId).subscribe((community) => {
        this.community = community;
        this.isAdmin = true; //TODO
        this.getItemsParams = {
          communityIds: [communityId!],
          borrowedByCurrentUser: !this.isAdmin
        };
      });
    }

    // Check the current route to set the tabOpened property
    this.route.url.subscribe(urlSegments => {
      this.breadcrumbs = [
        {
          caption: 'breadcrumb.communities',
          routerLink: '/hub/communities'
        },
        {
          name: this.community?.name,
          routerLink: `/hub/communities/${this.community?.id}`
        }
      ];
      const path = urlSegments.map(segment => segment.path).join('/');
      if (path.includes('libraries')) {
        this.tabOpened = 'libraries';
        this.activeTabIndex = 1;
        this.breadcrumbs.push({
          caption: 'breadcrumb.libraries',
          routerLink: `/hub/communities/${this.community?.id}/libraries`
        });
      } else if (path.includes('items')) {
        this.tabOpened = 'items';
        this.activeTabIndex = 2;
        this.breadcrumbs.push({
          caption: 'breadcrumb.items',
          routerLink: `/hub/communities/${this.community?.id}/items`
        });
      } else if (path.includes('members')) {
        this.tabOpened = 'members';
        this.activeTabIndex = 3;
        this.breadcrumbs.push({
          caption: 'breadcrumb.members',
          routerLink: `/hub/communities/${this.community?.id}/members`
        });
      } else if (path.includes('pages') && urlSegments.length > 3) {
        this.tabOpened = 'pages';
        this.activeTabIndex = 0;
        const pageRef = urlSegments[3].path;
        this.communitiesService.getCustomPages(this.community?.id!).subscribe((pages) => {
          this.pages = pages;
          this.selectPage(this.pages.find(page => page.ref === pageRef)!)
          this.breadcrumbs.push({
            caption: 'breadcrumb.pages',
            routerLink: `/hub/communities/${this.community?.id}/pages/`
          });

          this.breadcrumbs.push({
            name: this.selectedPage?.title,
            routerLink: `/hub/communities/${this.community?.id}/pages/${pageRef}`
          });
        });
      } else {
        this.activeTabIndex = 0;
        this.breadcrumbs.push({
          caption: 'breadcrumb.pages',
          routerLink: `/hub/communities/${this.community?.id}/pages`
        });
        this.tabOpened = 'pages';
        this.communitiesService.getCustomPages(this.community?.id!).subscribe((pages) => {
          this.pages = pages;
          this.selectPage(this.pages[0]);
        });
      }
      this.breadcrumbService.setBreadcrumbs(this.breadcrumbs);
    });


    this.isCssLoaded = true;
  }

  deleteCommunity(community: UICommunity): void {
    const data: TuiConfirmData = {
      content: this.translate.instant('community.confirmDeleteContent', { communityName: community.name }),
      yes: this.translate.instant('community.yesDelete'),
      no: this.translate.instant('community.cancel'),
    };

    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: this.translate.instant('community.deleteLabel', { communityName: community.name }),
        size: 'm',
        data,
      })
      .pipe(
        switchMap((response) => {
          if (response) {
            this.communitiesService.deleteCommunity(community.id).subscribe(() => {
              this.alerts.open(this.translate.instant('community.deleteSuccess', { communityName: community.name }), {
                appearance: 'positive',
              }).subscribe();
              this.router.navigate(['/hub/communities']);
            });
          }
          return EMPTY;
        }),
      )
      .subscribe();
  }

  deletePage(page: UICustomPage): void {

    const data: TuiConfirmData = {
      content: this.translate.instant('community.confirmDeletePage', { pageTitle: page.title }),
      yes: this.translate.instant('community.yesDelete'),
      no: this.translate.instant('community.cancel'),
    };

    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: this.translate.instant('community.deletePageLabel', { pageTitle: page.title }),
        size: 'm',
        data,
      })
      .pipe(
        switchMap((response) => {
          if (response) {
            this.communitiesService.deleteCustomPage(this.community?.id!, page.id).subscribe(() => {
              this.alerts.open(this.translate.instant('community.deletePageSuccess', { pageTitle: page.title }), {
                appearance: 'positive',
              }).subscribe();
              this.pages = this.pages.filter(p => p.id !== page.id);
            });
          }
          return EMPTY;
        }),
      )
      .subscribe();
  }

  onTabChange(tab: 'libraries' | 'members' | 'pages' | 'items'): void {
    this.tabOpened = tab;

    var queryParams: any = {};

    let path = `/hub/communities/${this.community?.id}`;

    if (tab === 'libraries') {
      path += '/libraries';
    } else if (tab === 'pages') {
      path += '/pages';
    } else if (tab === 'members') {
      path += '/members';
    } else if (tab === 'items') {
      path += '/items';
    } else if (tab === 'libraries') {
      path += '/libraries';
    }


    this.router.navigate([path], {
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }

  selectPage(page: UICustomPage) {
    this.selectedPage = page;
    this.editMode = false;

    var queryParams: any = {};

    let path = `/hub/communities/${this.community?.id}`;
    path += '/pages/' + page.ref;

    this.router.navigate([path], {
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }

  editPage(page: UICustomPage) {
    this.selectedPage = page;
    this.editMode = true;
  }

  createPage() {
    this.selectedPage = {
      id: '',
      communityId: this.community?.id!,
      ref: '',
      order: 100,
      title: '',
      content: '',
      position: 'community',
    };
    this.editMode = true;
  }
}