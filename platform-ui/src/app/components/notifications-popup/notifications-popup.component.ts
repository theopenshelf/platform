import {
  Component,
  effect,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  output,
  signal
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiBadgeNotification } from '@taiga-ui/kit';
import {
  globalProviders,
  NOTIFICATIONS_SERVICE_TOKEN,
} from '../../global.provider';
import { UINotification, UINotificationType } from '../../models/UINotification';
import { communityProviders } from '../../portal/community/community.provider';
import {
  NotificationsService
} from '../../services/notifications.service';
import { SharedModule } from '../shared-module/shared-module.component';

@Component({
  standalone: true,
  selector: 'notifications-popup',
  imports: [TranslateModule, TuiBadgeNotification, TuiButton, TuiIcon, SharedModule],
  providers: [...globalProviders, ...communityProviders],
  templateUrl: './notifications-popup.component.html',
  styleUrls: ['./notifications-popup.component.scss']
})
export class NotificationsPopupComponent implements OnInit {
  notifications: UINotification[] = [];
  protected unreadNotificationsCount: number = 0;

  isPopupVisible = signal(false); // Popup visibility controlled by the parent
  isPopupVisibleChange = output<boolean>(); // Emit changes to the parent

  // Signal to trigger notifications refresh
  refreshNotificationsSignal = signal(false);

  constructor(
    private elRef: ElementRef,
    private router: Router,
    @Inject(NOTIFICATIONS_SERVICE_TOKEN)
    private notificationsService: NotificationsService,
  ) {
    effect(() => {
      if (this.refreshNotificationsSignal()) {
        this.refreshNotificationsSignal.set(false);
        this.refreshNotifications();
      }
    });
    effect(() => {
      if (this.isPopupVisible()) {
        this.markAllAsRead();
      }
    });
  }

  ngOnInit() {
    this.refreshNotifications();

  }

  refreshNotifications() {
    this.notificationsService
      .getNotifications()
      .subscribe((notifications: UINotification[]) => {
        this.notifications = notifications;
        this.unreadNotificationsCount =
          this.notificationsService.getUnreadNotificationsCount();
      });
  }

  toggleNotificationsPopup() {
    this.isPopupVisible.set(!this.isPopupVisible());
    this.unreadNotificationsCount =
      this.notificationsService.getUnreadNotificationsCount();
  }

  markAsRead(notification: UINotification): void {
    notification.alreadyRead = true;
  }

  markAllAsRead(): void {
    this.notificationsService.acknowledgeNotifications(this.notifications);
    this.unreadNotificationsCount = 0;
  }

  getNotificationText(type: UINotificationType): string {
    switch (type) {
      case UINotificationType.ITEM_AVAILABLE:
        return 'notifications.itemAvailable';
      case UINotificationType.ITEM_DUE:
        return 'notifications.itemDue';
      case UINotificationType.ITEM_BORROW_RESERVATION_DATE_START:
        return 'notifications.itemBorrowReservationDateStart';
      case UINotificationType.ITEM_RESERVED_NO_LONGER_AVAILABLE:
        return 'notifications.itemReservedNoLongerAvailable';
      case UINotificationType.ITEM_PICKUP_APPROVED:
        return 'notifications.itemPickupApproved';
      case UINotificationType.ITEM_RETURN_APPROVED:
        return 'notifications.itemReturnApproved';
      case UINotificationType.ITEM_RESERVATION_APPROVED:
        return 'notifications.itemReservationApproved';
      default:
        return 'notifications.unknown';
    }
  }

  getNotificationLink(notification: UINotification): string | null {
    switch (notification.type) {
      case UINotificationType.ITEM_AVAILABLE:
      case UINotificationType.ITEM_DUE:
      case UINotificationType.ITEM_BORROW_RESERVATION_DATE_START:
      case UINotificationType.ITEM_RESERVED_NO_LONGER_AVAILABLE:
        return notification.payload?.itemId
          ? `/community/items/${notification.payload.item.id}`
          : null;

      // Add other cases if needed for different notification types
      default:
        return null;
    }
  }

  getNotificationImage(notification: UINotification): string {
    // Check if the notification has an associated item with an image
    if (notification.payload?.item?.imageUrl) {
      return notification.payload.item.imageUrl;
    }
    // Fallback to a default image
    return '/assets/default-notification.png';
  }

  onNotificationClick(notification: UINotification) {
    // Handle notification click depending on its type or other properties
    const link = this.getNotificationLink(notification);
    if (link) {
      this.router.navigate([link]).then(() => {
        this.closePopup();
      });
    }
  }

  openPopup() {
    this.markAllAsRead();
    this.refreshNotifications();
    this.isPopupVisible.set(true);
  }

  // Close the popup (manually triggered or on outside click)
  closePopup() {
    this.isPopupVisible.set(false);
  }

  // Close the popup when clicking outside of it
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.closePopup();
    }
  }
}
