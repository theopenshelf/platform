import { animate, style, transition, trigger } from '@angular/animations';
import {
  Component,
  effect,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  output,
  signal
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiBadgeNotification } from '@taiga-ui/kit';
import { interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import {
  getGlobalProviders,
  NOTIFICATIONS_SERVICE_TOKEN,
} from '../../global.provider';
import { UINotification, UINotificationType } from '../../models/UINotification';
import { hubProviders } from '../../portal/hub/hub.provider';
import {
  NotificationsService
} from '../../services/notifications.service';
import { SharedModule } from '../shared-module/shared-module.component';

@Component({
  standalone: true,
  selector: 'notifications-popup',
  imports: [TranslateModule, TuiBadgeNotification, TuiButton, TuiIcon, SharedModule],
  providers: [...getGlobalProviders(), ...hubProviders],
  templateUrl: './notifications-popup.component.html',
  styleUrls: ['./notifications-popup.component.scss'],
  animations: [
    trigger('pulseAnimation', [
      transition('* => true', [
        style({ transform: 'scale(1)' }),
        animate('300ms ease-in-out', style({ transform: 'scale(1.2)' })),
        animate('300ms ease-in-out', style({ transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class NotificationsPopupComponent implements OnInit, OnDestroy {
  private readonly POLLING_INTERVAL = 30000; // Poll every 30 seconds
  private pollingSubscription?: Subscription;
  private isAlive = true; // Track component lifecycle

  // Use signals for reactive state
  notifications = signal<UINotification[]>([]);
  unreadNotificationsCount = signal<number>(0);
  hasNewNotifications = signal(false);
  isPopupVisible = signal(false);
  isPopupVisibleChange = output<boolean>();
  refreshNotificationsSignal = signal(false);

  constructor(
    private elRef: ElementRef,
    private router: Router,
    @Inject(NOTIFICATIONS_SERVICE_TOKEN)
    private notificationsService: NotificationsService,
  ) {
    // Effect to handle notifications refresh
    effect(() => {
      if (this.refreshNotificationsSignal()) {
        this.refreshNotificationsSignal.set(false);
        this.refreshNotifications();
      }
    });
  }

  ngOnInit() {
    this.refreshNotifications();
    this.startPolling();
  }

  ngOnDestroy() {
    this.isAlive = false;
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  private startPolling() {
    // Start polling for notifications
    this.pollingSubscription = interval(this.POLLING_INTERVAL)
      .pipe(
        takeWhile(() => this.isAlive)
      )
      .subscribe(() => {
        this.refreshNotifications();
      });
  }

  refreshNotifications() {
    this.notificationsService
      .getNotifications()
      .subscribe({
        next: (notifications: UINotification[]) => {
          const previousCount = this.unreadNotificationsCount();

          // Update notifications signal
          this.notifications.set(notifications);

          // Calculate unread count from the notifications
          const newUnreadCount = notifications.filter(n => !n.alreadyRead).length;
          this.unreadNotificationsCount.set(newUnreadCount);

          // Trigger animation if we have new notifications
          if (newUnreadCount > previousCount) {
            this.hasNewNotifications.set(true);
            setTimeout(() => {
              this.hasNewNotifications.set(false);
            }, 600);
          }
        },
        error: (error) => {
          console.error('Failed to fetch notifications:', error);
        }
      });
  }

  toggleNotificationsPopup() {
    const newVisibility = !this.isPopupVisible();
    this.isPopupVisible.set(newVisibility);

    // If opening the popup, refresh notifications
    if (newVisibility) {
      this.refreshNotifications();
    }
  }

  markAsRead(notification: UINotification): void {
    // Update the notification's read status
    const updatedNotifications = this.notifications().map(n =>
      n.id === notification.id ? { ...n, alreadyRead: true } : n
    );

    // Update notifications signal
    this.notifications.set(updatedNotifications);

    // Update unread count
    this.unreadNotificationsCount.set(updatedNotifications.filter(n => !n.alreadyRead).length);

    // Notify the service
    this.notificationsService.acknowledgeNotifications([notification]);
  }

  markAllAsRead(): void {
    // Update all notifications as read
    const updatedNotifications = this.notifications().map(n => ({ ...n, alreadyRead: true }));

    // Update notifications signal
    this.notifications.set(updatedNotifications);

    // Reset unread count
    this.unreadNotificationsCount.set(0);

    // Notify the service
    this.notificationsService.acknowledgeNotifications(this.notifications());
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
      case UINotificationType.ITEM_PICKUP_APPROVED:
      case UINotificationType.ITEM_RETURN_APPROVED:
      case UINotificationType.ITEM_RESERVATION_APPROVED:
        return notification.payload?.item?.id
          ? `/hub/items/${notification.payload.item.id}`
          : null;

      // Add other cases if needed for different notification types
      default:
        return null;
    }
  }

  getNotificationImage(notification: UINotification): string {
    // Check if the notification has an associated item with an image
    if (notification.item?.imageUrl) {
      return notification.item.imageUrl;
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

  onNotificationHover(notification: UINotification) {
    this.markAsRead(notification);
  }
}
