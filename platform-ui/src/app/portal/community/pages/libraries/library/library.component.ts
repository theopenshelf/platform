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
  TuiAutoColorPipe,
  TuiButton,
  TuiDataList,
  TuiIcon,
  TuiInitialsPipe,
  TuiTextfield
} from '@taiga-ui/core';
import {
  TUI_CONFIRM,
  TuiAccordion,
  TuiAvatar,
  TuiAvatarStack,
  TuiConfirmData,
  TuiDataListWrapper
} from '@taiga-ui/kit';
import {
  TuiSelectModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/legacy';
import { EMPTY, switchMap } from 'rxjs';
import { FilteredAndPaginatedBorrowRecordsComponent } from '../../../../../components/filtered-and-paginated-borrow-records/filtered-and-paginated-borrow-records.component';
import { FilteredAndPaginatedItemsComponent } from '../../../../../components/filtered-and-paginated-items/filtered-and-paginated-items.component';
import { TosBreadcrumbsComponent } from '../../../../../components/tos-breadcrumbs/tos-breadcrumbs.component';
import { BreadcrumbItem, BreadcrumbService } from '../../../../../components/tos-breadcrumbs/tos-breadcrumbs.service';
import { AUTH_SERVICE_TOKEN } from '../../../../../global.provider';
import { GetItemsParams } from '../../../../../models/GetItemsParams';
import { isLibraryAdmin, UILibrary } from '../../../../../models/UILibrary';
import { UIUser } from '../../../../../models/UIUser';
import { AuthService, UserInfo } from '../../../../../services/auth.service';
import {
  LIBRARIES_SERVICE_TOKEN,
  USERS_SERVICE_TOKEN
} from '../../../community.provider';
import { LibrariesService } from '../../../services/libraries.service';
import { UsersService } from '../../../services/users.service';
import { FilteredAndPaginatedMembersComponent } from '../../../../../components/filtered-and-paginated-members/filtered-and-paginated-members.component';

@Component({
  selector: 'app-library',
  imports: [
    RouterModule,
    RouterLink,
    FormsModule,
    TuiIcon,
    TuiAccordion,
    TuiAvatar,
    TuiButton,
    TuiIcon,
    TuiInitialsPipe,
    TuiAutoColorPipe,
    TuiTextfieldControllerModule,
    ReactiveFormsModule,
    TuiTextfield,
    TuiDataList,
    TuiDataListWrapper,
    TuiSelectModule,
    FilteredAndPaginatedItemsComponent,
    FilteredAndPaginatedBorrowRecordsComponent,
    TranslateModule,
    TuiAvatar,
    TuiAvatarStack,
    TosBreadcrumbsComponent,
    FilteredAndPaginatedMembersComponent
  ],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss',
})
export class LibraryComponent {
  public getItemsParams: GetItemsParams | undefined;

  library: UILibrary | undefined;
  tabOpened: 'items' | 'borrow-records' | 'approval' | 'members' = 'items';
  usersPerId: Map<string, UIUser> = new Map();
  userInfo: UserInfo | undefined;
  isAdmin: boolean = false;
  breadcrumbs: BreadcrumbItem[] = [];
  constructor(
    @Inject(LIBRARIES_SERVICE_TOKEN) private librariesService: LibrariesService,
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
    const libraryId = this.route.snapshot.paramMap.get('id');
    this.userService.getUsers().subscribe((users) => {
      this.usersPerId = new Map(users.map(user => [user.id, user]));
    });
    this.userInfo = this.authService.getCurrentUserInfo();
    if (libraryId) {
      this.librariesService.getLibrary(libraryId).subscribe((library) => {
        this.library = library;
        this.breadcrumbs = [
          {
            name: library.name,
            routerLink: `/community/libraries/${library.id}`
          }
        ];
        this.breadcrumbService.appendBreadcrumbs('library', this.breadcrumbs, [
          {
            caption: 'breadcrumb.libraries',
            routerLink: '/community/libraries'
          }
        ]);
        this.isAdmin = isLibraryAdmin(this.userInfo?.user!, this.library);
        this.getItemsParams = {
          libraryIds: [libraryId!],
          borrowedByCurrentUser: !this.isAdmin
        };
      });
    }

    // Check the current route to set the tabOpened property
    this.route.url.subscribe(urlSegments => {
      const path = urlSegments.map(segment => segment.path).join('/');
      if (path.includes('borrow-records')) {
        this.tabOpened = 'borrow-records';
      } else if (path.includes('approval')) {
        this.tabOpened = 'approval';
      } else if (path.includes('members'))  {
        this.tabOpened = 'members';
      } else {
        this.tabOpened = 'items';
      }
    });
    this.isCssLoaded = true;
  }

  deleteLibrary(library: UILibrary): void {
    const data: TuiConfirmData = {
      content: this.translate.instant('library.confirmDeleteContent', { libraryName: library.name }),
      yes: this.translate.instant('library.yesDelete'),
      no: this.translate.instant('library.cancel'),
    };

    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: this.translate.instant('library.deleteLabel', { libraryName: library.name }),
        size: 'm',
        data,
      })
      .pipe(
        switchMap((response) => {
          if (response) {
            this.librariesService.deleteLibrary(library.id).subscribe(() => {
              this.alerts.open(this.translate.instant('library.deleteSuccess', { libraryName: library.name }), {
                appearance: 'positive',
              }).subscribe();
              this.router.navigate(['/community/libraries']);
            });
          }
          return EMPTY;
        }),
      )
      .subscribe();
  }

  onTabChange(tab: 'items' | 'borrow-records' | 'approval' | 'members'): void {
    this.tabOpened = tab;

    var queryParams: any = {};

    let path = `/community/libraries/${this.library?.id}`;

    if (tab === 'borrow-records') {
      path += '/borrow-records';
      queryParams['selectedStatus'] = 'borrowed-active';
    } else if (tab === 'approval') {
      path += '/approval';
      queryParams['selectedStatus'] = 'reserved-unconfirmed';
    } else if (tab === 'members') {
      path += '/members';
    } else {
      path += '/items';
      queryParams['selectedStatus'] = undefined;
    }


    this.router.navigate([path], {
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }

}