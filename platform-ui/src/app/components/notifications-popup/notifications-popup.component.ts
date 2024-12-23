import { Component, HostListener, ElementRef, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { NotificationsService, UINotification, NotificationType } from '../../services/notifications.service';
import { Router, RouterLink } from '@angular/router';
import { TuiBadgeNotification } from '@taiga-ui/kit';
import { TuiButton } from '@taiga-ui/core';
import { globalProviders, NOTIFICATIONS_SERVICE_TOKEN } from '../../global.provider';

@Component({
  standalone: true,
  selector: 'app-notifications-popup',
  imports: [
    TuiBadgeNotification,
    TuiButton
],
  providers: [
    ...globalProviders
  ],
  templateUrl: './notifications-popup.component.html',
  styleUrls: ['./notifications-popup.component.scss']
})
export class NotificationsPopupComponent implements OnInit {
  notifications: UINotification[] = [];
  protected unreadNotificationsCount: number = 0;

  @Input() isPopupVisible: boolean = false;  // Popup visibility controlled by the parent
  @Output() isPopupVisibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();  // Emit changes to the parent
  
  constructor(
    private elRef: ElementRef,
    private router: Router, 
    @Inject(NOTIFICATIONS_SERVICE_TOKEN) private notificationsService: NotificationsService) {}
  ngOnInit() {
    this.notificationsService.getNotifications().subscribe((notifications: UINotification[]) => {
      this.notifications = notifications;
      this.notificationsService.acknowledgeNotifications(this.notifications);
      this.unreadNotificationsCount = this.notificationsService.getUnreadNotificationsCount();
    });
  }

  toggleNotificationsPopup() {
    this.isPopupVisible = !this.isPopupVisible;
    this.unreadNotificationsCount = this.notificationsService.getUnreadNotificationsCount();
  }

  markAsRead(notification: UINotification): void {
    notification.alreadyRead = true;
  }

  markAllAsRead(): void {
    this.notificationsService.acknowledgeNotifications(this.notifications);
  }

  getNotificationText(type: NotificationType): string {
    switch (type) {
      case NotificationType.ITEM_AVAILABLE:
        return 'An item is now available!';
      case NotificationType.ITEM_DUE:
        return 'Your item is due soon!';
      case NotificationType.ITEM_BORROW_RESERVATION_DATE_START:
        return 'Your reserved item is ready to borrow.';
      case NotificationType.ITEM_RESERVED_NO_LONGER_AVAILABLE:
        return 'A reserved item is no longer available.';
      default:
        return 'Notification';
    }
  }

  getNotificationLink(notification: UINotification): string | null {
    switch (notification.type) {
      case NotificationType.ITEM_AVAILABLE:
      case NotificationType.ITEM_DUE:
      case NotificationType.ITEM_BORROW_RESERVATION_DATE_START:
      case NotificationType.ITEM_RESERVED_NO_LONGER_AVAILABLE:
        return notification.payload?.item ? `/community/items/${notification.payload.item.id}` : null;
  
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
      this.router.navigate([link]);
    }
  }

  openPopup() {
    this.isPopupVisible = true;
  }

  // Close the popup (manually triggered or on outside click)
  closePopup() {
    this.isPopupVisible = false;
  }

  // Close the popup when clicking outside of it
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.closePopup();
    }
  }
}