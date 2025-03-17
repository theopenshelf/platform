import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  NavigationEnd,
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
import { filter, map, startWith } from 'rxjs/operators';
import { TosBreadcrumbsComponent } from '../../../../components/tos-breadcrumbs/tos-breadcrumbs.component';
import { BreadcrumbItem, BreadcrumbService } from '../../../../components/tos-breadcrumbs/tos-breadcrumbs.service';
import { AUTH_SERVICE_TOKEN } from '../../../../global.provider';
import { UICommunity } from '../../../../models/UICommunity';
import { UIUser } from '../../../../models/UIUser';
import { AuthService, UserInfo } from '../../../../services/auth.service';
import {
  COMMUNITIES_SERVICE_TOKEN,
  USERS_SERVICE_TOKEN
} from '../../hub.provider';
import { CommunitiesService } from '../../services/communities.service';
import { UsersService } from '../../services/users.service';
import { CommunityStateService } from './community.service';

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
    TuiTabs,
  ],
  templateUrl: './community.component.html',
  styleUrl: './community.component.scss',
})
export class CommunityComponent implements OnInit {


  community: UICommunity | undefined;
  tabOpened: 'libraries' | 'members' | 'pages' | 'items' = 'pages';
  usersPerId: Map<string, UIUser> = new Map();
  userInfo: UserInfo | undefined;
  breadcrumbs: BreadcrumbItem[] = []
  activeTabIndex: number = 0;
  isAdmin: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(COMMUNITIES_SERVICE_TOKEN) private communitiesService: CommunitiesService,
    @Inject(USERS_SERVICE_TOKEN) private userService: UsersService,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthService,
    private dialogs: TuiResponsiveDialogService,
    private alerts: TuiAlertService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private breadcrumbService: BreadcrumbService,
    private communityState: CommunityStateService
  ) {
  }

  isCssLoaded = false;

  ngOnInit() {
    const communityId = this.route.snapshot.paramMap.get('id');
    this.userService.getUsers().subscribe((users) => {
      this.usersPerId = new Map(users.map(user => [user.id, user]));
      this.cdr.detectChanges();
    });
    this.userInfo = this.authService.getCurrentUserInfo();
    if (communityId) {
      // Only fetch if community is not loaded or if it's a different community
      if (!this.community || this.community.id !== communityId) {
        this.communitiesService.getCommunity(communityId).subscribe((community) => {
          this.community = community;
          this.cdr.detectChanges();
          this.communityState.setCommunity(community);
        });
      }
    }

    // Use paramMap to get the ID and combine with router.url for the full path
    this.route.paramMap.pipe(
      switchMap(params => {
        const communityId = params.get('id');
        return this.router.events.pipe(
          filter(event => event instanceof NavigationEnd),
          map(() => this.router.url),
          startWith(this.router.url),
          map(url => ({ url, communityId }))
        );
      })
    ).subscribe(({ url, communityId }) => {
      // Now you'll have the full URL path even on page refresh
      const path = url;
      this.breadcrumbs = [
        {
          caption: 'breadcrumb.communities',
          routerLink: '/hub/communities'
        },
        {
          name: this.community?.name,
          routerLink: `/hub/communities/${communityId}`
        }
      ];

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
      } else if (path.includes('pages') && url.length > 3) {
        this.tabOpened = 'pages';
        this.activeTabIndex = 0;
        this.breadcrumbs.push({
          caption: 'breadcrumb.pages',
          routerLink: `/hub/communities/${this.community?.id}/pages`
        });
        this.tabOpened = 'pages';
      }
      this.breadcrumbService.setBreadcrumbs(this.breadcrumbs);
      this.cdr.detectChanges();
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

}