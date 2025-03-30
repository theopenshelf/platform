import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TuiIcon } from '@taiga-ui/core';
import { UIBorrowRecord } from '../../models/UIBorrowRecord';
import { UIBorrowDetailedStatus } from '../../models/UIBorrowStatus';
import { TimelineComponent, TimelineItem } from '../timeline/timeline.component';
@Component({
  selector: 'borrow-record-timeline',
  imports: [
    TimelineComponent,
    TuiIcon,
    CommonModule
  ],
  templateUrl: './borrow-record-timeline.component.html',
  styleUrl: './borrow-record-timeline.component.scss'
})
export class BorrowRecordTimelineComponent {
  public borrowRecord = input.required<UIBorrowRecord>();

  constructor(private translate: TranslateService) { }

  protected readonly status = computed(() => {
    return this.borrowRecord().status;
  });

  protected readonly timelineItems = computed(() => {
    const locale = this.translate.currentLang;
    let items: TimelineItem[] = [];

    var pickupMoment: 'early' | 'on-time' | 'late' | undefined = undefined;
    var timelineStartAndPickup: TimelineItem[] = [];
    if (this.borrowRecord().pickupDate) {
      if (this.borrowRecord().pickupDate! < this.borrowRecord().startDate!) {
        pickupMoment = 'early';
        timelineStartAndPickup = [
          this.createTimelineItem(this.borrowRecord().pickupDate!, 'left', 'accent', 'accent', false, '/borrow.png', 'timeline.pickup'),
          this.createTimelineItem(this.borrowRecord().startDate, 'left', 'accent', 'accent', false, '@tui.calendar-clock', 'timeline.start')
        ];
      } else if (this.borrowRecord().pickupDate! > this.borrowRecord().startDate) {
        pickupMoment = 'late';
        timelineStartAndPickup = [
          this.createTimelineItem(this.borrowRecord().startDate, 'left', 'primary', 'primary', false, '@tui.calendar-clock', 'timeline.start'),
          this.createTimelineItem(this.borrowRecord().pickupDate!, 'left', 'accent', 'accent', false, '/borrow.png', 'timeline.pickup')
        ];
      } else {
        pickupMoment = 'on-time';
        timelineStartAndPickup = [
          this.createTimelineItem(this.borrowRecord().pickupDate!, 'left', 'accent', 'accent', false, '/borrow.png', 'timeline.pickup')
        ];
      }
    }

    switch (this.status()) {
      case UIBorrowDetailedStatus.Reserved_Unconfirmed:
        items = [
          this.createTimelineItem(this.borrowRecord().reservationDate, 'left', 'accent', 'primary', false, '@tui.clock', 'timeline.reservation-unconfirmed'),
          this.createTimelineItem(this.borrowRecord().startDate, 'left', 'secondary', 'secondary', false, '@tui.calendar-clock', 'timeline.start'),
          this.createTimelineItem(this.borrowRecord().endDate, 'left', 'secondary', 'secondary', false, '@tui.calendar-check', 'timeline.end')
        ];
        break;

      case UIBorrowDetailedStatus.Reserved_Confirmed:
        items = [
          this.createTimelineItem(this.borrowRecord().reservationDate, 'left', 'accent', 'primary', false, '@tui.clock', 'timeline.reservation'),
          this.createTimelineItem(this.borrowRecord().startDate, 'left', 'secondary', 'secondary', false, '@tui.calendar-clock', 'timeline.start'),
          this.createTimelineItem(this.borrowRecord().endDate, 'left', 'secondary', 'secondary', false, '@tui.calendar-check', 'timeline.end')
        ];
        break;

      case UIBorrowDetailedStatus.Reserved_ReadyToPickup:
        items = [
          this.createTimelineItem(this.borrowRecord().reservationDate, 'left', 'primary', 'primary', false, '@tui.clock', 'timeline.reservation'),
          this.createTimelineItem(this.borrowRecord().startDate, 'left', 'accent', 'accent', false, '@tui.calendar-clock', 'timeline.start'),
          this.createTimelineItem(this.borrowRecord().endDate, 'left', 'secondary', 'secondary', false, '@tui.calendar-check', 'timeline.end')
        ];
        break;

      case UIBorrowDetailedStatus.Reserved_Pickup_Unconfirmed:
        items = [
          this.createTimelineItem(this.borrowRecord().reservationDate, 'left', 'primary', 'primary', false, '@tui.clock', 'timeline.reservation'),
          this.createTimelineItem(this.borrowRecord().pickupDate!, 'left', 'accent', 'accent', false, '/borrow.png', 'timeline.pickup-unconfirmed'),
          this.createTimelineItem(this.borrowRecord().startDate, 'left', 'accent', 'accent', false, '@tui.calendar-clock', 'timeline.start'),
          this.createTimelineItem(this.borrowRecord().endDate, 'left', 'secondary', 'secondary', false, '@tui.calendar-check', 'timeline.end')
        ];
        break;

      case UIBorrowDetailedStatus.Borrowed_Active:
        items = [
          this.createTimelineItem(this.borrowRecord().reservationDate, 'left', 'primary', 'primary', false, '@tui.clock', 'timeline.reservation'),
          ...timelineStartAndPickup,
          this.createTimelineItem(this.borrowRecord().endDate, 'left', 'secondary', 'secondary', false, '@tui.calendar-check', 'timeline.end')
        ];
        break;

      case UIBorrowDetailedStatus.Borrowed_Return_Unconfirmed:
        if (this.borrowRecord().effectiveReturnDate! < this.borrowRecord().endDate!) {
          items = [
            this.createTimelineItem(this.borrowRecord().reservationDate, 'left', 'primary', 'primary', false, '@tui.clock', 'timeline.reservation'),
            ...timelineStartAndPickup,
            this.createTimelineItem(this.borrowRecord().effectiveReturnDate!, 'left', 'accent', 'success', false, '/returnItem.png', 'timeline.return-unconfirmed'),
            this.createTimelineItem(this.borrowRecord().endDate, 'left', 'success', 'success', true, '@tui.calendar-check', 'timeline.end')
          ];
        } else if (this.borrowRecord().effectiveReturnDate! == this.borrowRecord().endDate!) {
          items = [
            this.createTimelineItem(this.borrowRecord().reservationDate, 'left', 'primary', 'primary', false, '@tui.clock', 'timeline.reservation'),
            ...timelineStartAndPickup,
            this.createTimelineItem(this.borrowRecord().effectiveReturnDate!, 'left', 'accent', 'success', true, '/returnItem.png', 'timeline.return-unconfirmed')
          ];
        } else {
          items = [
            this.createTimelineItem(this.borrowRecord().reservationDate, 'left', 'primary', 'primary', false, '@tui.clock', 'timeline.reservation'),
            ...timelineStartAndPickup,
            this.createTimelineItem(this.borrowRecord().endDate, 'left', 'danger', 'danger', false, '@tui.calendar-check', 'timeline.end'),
            this.createTimelineItem(this.borrowRecord().effectiveReturnDate!, 'left', 'danger', 'danger', true, '/returnItem.png', 'timeline.return-unconfirmed')
          ];
        }
        break;
      case UIBorrowDetailedStatus.Returned_Early:
        items = [
          this.createTimelineItem(this.borrowRecord().reservationDate, 'left', 'primary', 'primary', false, '@tui.clock', 'timeline.reservation'),
          ...timelineStartAndPickup,
          this.createTimelineItem(this.borrowRecord().effectiveReturnDate!, 'left', 'accent', 'success', false, '/returnItem.png', 'timeline.return'),
          this.createTimelineItem(this.borrowRecord().endDate, 'left', 'success', 'success', true, '@tui.calendar-check', 'timeline.end')
        ];
        break;

      case UIBorrowDetailedStatus.Returned_OnTime:
        items = [
          this.createTimelineItem(this.borrowRecord().reservationDate, 'left', 'primary', 'primary', false, '@tui.clock', 'timeline.reservation'),
          ...timelineStartAndPickup,
          this.createTimelineItem(this.borrowRecord().effectiveReturnDate!, 'left', 'accent', 'success', true, '/returnItem.png', 'timeline.return')
        ];
        break;

      case UIBorrowDetailedStatus.Borrowed_DueToday:
        items = [
          this.createTimelineItem(this.borrowRecord().reservationDate, 'left', 'primary', 'primary', false, '@tui.clock', 'timeline.reservation'),
          ...timelineStartAndPickup,
          this.createTimelineItem(this.borrowRecord().endDate, 'left', 'warning', 'warning', false, '@tui.calendar-check', 'timeline.end')
        ];
        break;

      case UIBorrowDetailedStatus.Borrowed_Late:
        items = [
          this.createTimelineItem(this.borrowRecord().reservationDate, 'left', 'primary', 'primary', false, '@tui.clock', 'timeline.reservation'),
          ...timelineStartAndPickup,
          this.createTimelineItem(this.borrowRecord().endDate, 'left', 'danger', 'danger', false, '@tui.calendar-check', 'timeline.end')
        ];
        break;

      case 'returned-late':
        items = [
          this.createTimelineItem(this.borrowRecord().reservationDate, 'left', 'primary', 'primary', false, '@tui.clock', 'timeline.reservation'),
          ...timelineStartAndPickup,
          this.createTimelineItem(this.borrowRecord().endDate, 'left', 'danger', 'danger', false, '@tui.calendar-check', 'timeline.end'),
          this.createTimelineItem(this.borrowRecord().effectiveReturnDate!, 'left', 'danger', 'danger', true, '/returnItem.png', 'timeline.return')
        ];
        break;
    }
    return items;
  });


  private createTimelineItem(date: Date, position: 'left' | 'right', dotColor: 'accent' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger', lineColor: 'accent' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger', lastItem: boolean, icon: string, labelKey: string): TimelineItem {
    const locale = this.translate.currentLang;
    return {
      label: date ? date.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }) : '',
      position,
      dotColor,
      lineColor,
      lastItem,
      items: [
        {
          icon,
          label: this.translate.instant(labelKey),
        }
      ]
    };
  }
}
