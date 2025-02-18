import { Component, computed, effect, Inject, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { tuiAsPortal, TuiPortals } from '@taiga-ui/cdk';
import {
  TuiAppearance,
  TuiAutoColorPipe,
  TuiButton,
  TuiDataList,
  TuiDropdown,
  TuiDropdownService,
  TuiIcon,
  TuiInitialsPipe,
  TuiRoot
} from '@taiga-ui/core';
import {
  TuiAvatar,
  TuiBadgeNotification,
  TuiChevron,
  TuiFade,
  TuiTabs
} from '@taiga-ui/kit';
import { tuiLayoutIconsProvider, TuiNavigation } from '@taiga-ui/layout';
import { FooterComponent } from '../../../components/footer/footer.component';
import { NotificationsPopupComponent } from '../../../components/notifications-popup/notifications-popup.component';
import { BreadcrumbService } from '../../../components/tos-breadcrumbs/tos-breadcrumbs.service';
import { AUTH_SERVICE_TOKEN } from '../../../global.provider';
import { UIBorrowDetailedStatus } from '../../../models/UIBorrowStatus';
import { AuthService, UserInfo } from '../../../services/auth.service';
import { ITEMS_SERVICE_TOKEN } from '../hub.provider';
import { EventService, TosEventType } from '../services/event.service';
import { ItemsService } from '../services/items.service';

@Component({
  standalone: true,
  selector: 'hub-layout',
  imports: [
    FooterComponent,
    RouterLinkActive,
    NotificationsPopupComponent,
    RouterOutlet,
    TuiRoot,
    FormsModule,
    RouterLink,
    TuiAppearance,
    TuiButton,
    TuiChevron,
    TuiAppearance,
    TuiDataList,
    TuiDropdown,
    TuiFade,
    TuiIcon,
    TuiNavigation,
    TuiTabs,
    TuiBadgeNotification,
    TranslateModule,
    TuiAvatar,
    TuiInitialsPipe,
    TuiAutoColorPipe,
  ],
  templateUrl: './hub-layout.component.html',
  styleUrl: './hub-layout.component.scss',
  providers: [
    tuiLayoutIconsProvider({ grid: '@tui.align-justify' }),
    TuiDropdownService,
    tuiAsPortal(TuiDropdownService),
  ],
})
export default class HubLayoutComponent extends TuiPortals implements OnDestroy {
  protected expanded = false;
  protected open = false;
  protected switch = false;
  protected readonly routes: any = {};
  totalItemsCurrentlyBorrowed: number = 0;
  totalApprovalRequests: number = 0;
  receivedEvent = computed(() =>
    this.eventService.event()
  );
  user: UserInfo;

  @ViewChild(NotificationsPopupComponent) notificationsPopup!: NotificationsPopupComponent;

  constructor(
    @Inject(ITEMS_SERVICE_TOKEN) private itemsService: ItemsService,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthService,
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private breadcrumbService: BreadcrumbService
  ) {
    super();
    this.breadcrumbService.resetBreadcrumbs();
    this.user = this.authService.getCurrentUserInfo();
    effect(() => {

      if (this.receivedEvent() === TosEventType.BorrowRecordsChanged) {
        this.refreshBorrowRecords();
        this.notificationsPopup.refreshNotificationsSignal.set(true);
      } else if (this.receivedEvent() === TosEventType.NotificationsChanged) {
        this.notificationsPopup.refreshNotificationsSignal.set(true);
      }


      if (this.receivedEvent()) {
        this.eventService.clearEvent();
      }
    });
  }

  ngOnInit() {
    this.refreshBorrowRecords();
  }

  ngOnDestroy() {
  }

  private refreshBorrowRecords() {
    this.itemsService
      .getBorrowRecordsCountByStatus({
        borrowedByCurrentUser: true,
        statuses: [UIBorrowDetailedStatus.Reserved_Pickup_Unconfirmed, UIBorrowDetailedStatus.Borrowed_Active, UIBorrowDetailedStatus.Borrowed_DueToday, UIBorrowDetailedStatus.Borrowed_Late],
      })
      .subscribe((countsByStatus) => {
        this.totalItemsCurrentlyBorrowed = 0;
        for (const countByStatus of countsByStatus) {
          this.totalItemsCurrentlyBorrowed += countByStatus[1];
        }
      });

    this.itemsService
      .getBorrowRecordsCountByStatus({
        statuses: [UIBorrowDetailedStatus.Reserved_Unconfirmed, UIBorrowDetailedStatus.Borrowed_Return_Unconfirmed, UIBorrowDetailedStatus.Reserved_Pickup_Unconfirmed],
      })
      .subscribe((countsByStatus) => {
        this.totalApprovalRequests = 0;
        for (const countByStatus of countsByStatus) {
          this.totalApprovalRequests += countByStatus[1];
        }
      });
  }
}
