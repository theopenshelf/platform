import { Component, computed, effect, Inject, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
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
  TuiRoot,
} from '@taiga-ui/core';
import {
  TuiAvatar,
  TuiBadgeNotification,
  TuiChevron,
  TuiFade,
  TuiTabs,
} from '@taiga-ui/kit';
import { tuiLayoutIconsProvider, TuiNavigation } from '@taiga-ui/layout';
import { FooterComponent } from '../../../components/footer/footer.component';
import { NotificationsPopupComponent } from '../../../components/notifications-popup/notifications-popup.component';
import { AUTH_SERVICE_TOKEN } from '../../../global.provider';
import { UIBorrowDetailedStatus } from '../../../models/UIBorrowStatus';
import { AuthService, UserInfo } from '../../../services/auth.service';
import { ITEMS_SERVICE_TOKEN } from '../community.provider';
import { EventService, TosEventType } from '../services/event.service';
import { ItemsService } from '../services/items.service';

@Component({
  standalone: true,
  selector: 'community-layout',
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
    TuiAutoColorPipe
  ],
  templateUrl: './community-layout.component.html',
  styleUrl: './community-layout.component.scss',
  providers: [
    tuiLayoutIconsProvider({ grid: '@tui.align-justify' }),
    TuiDropdownService,
    tuiAsPortal(TuiDropdownService),
  ],
})
export default class CommunityLayoutComponent extends TuiPortals implements OnDestroy {
  protected expanded = false;
  protected open = false;
  protected switch = false;
  protected readonly routes: any = {};
  totalItemsCurrentlyBorrowed: number = 0;
  receivedEvent = computed(() =>
    this.eventService.event()
  );
  user: UserInfo;

  @ViewChild(NotificationsPopupComponent) notificationsPopup!: NotificationsPopupComponent;

  constructor(
    @Inject(ITEMS_SERVICE_TOKEN) private itemsService: ItemsService,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthService,
    private eventService: EventService
  ) {
    super();
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
        this.totalItemsCurrentlyBorrowed = Array.from(countsByStatus.values()).reduce((sum, count) => sum + count, 0);
      });
  }
}
