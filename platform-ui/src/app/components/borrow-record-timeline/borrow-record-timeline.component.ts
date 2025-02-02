import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TuiIcon } from '@taiga-ui/core';
import { getBorrowRecordStatus, UIBorrowRecord } from '../../portal/community/models/UIBorrowRecord';
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
    return getBorrowRecordStatus(this.borrowRecord());
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
          {
            label: this.borrowRecord().pickupDate!.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'accent',
            lineColor: 'accent',
            lastItem: false,
            items: [
              {
                icon: '/borrow.png',
                label: this.translate.instant('timeline.pickup'),
              }
            ]
          },
          {
            label: this.borrowRecord().startDate.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'accent',
            lineColor: 'accent',
            lastItem: false,
            items: [
              {
                icon: '@tui.calendar-clock',
                label: this.translate.instant('timeline.start'),
              }
            ]
          }
        ]
      } else if (this.borrowRecord().pickupDate! > this.borrowRecord().startDate) {
        pickupMoment = 'late';
        timelineStartAndPickup = [
          {
            label: this.borrowRecord().startDate.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'primary',
            lineColor: 'primary',
            lastItem: false,
            items: [
              {
                icon: '@tui.calendar-clock',
                label: this.translate.instant('timeline.start'),
              }
            ]
          },
          {
            label: this.borrowRecord().pickupDate!.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'accent',
            lineColor: 'accent',
            lastItem: false,
            items: [
              {
                icon: '/borrow.png',
                label: this.translate.instant('timeline.pickup'),
              }
            ]
          },
        ]
      } else {
        pickupMoment = 'on-time';
        timelineStartAndPickup = [
          {
            label: this.borrowRecord().pickupDate!.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'accent',
            lineColor: 'accent',
            lastItem: false,
            items: [
              {
                icon: '/borrow.png',
                label: this.translate.instant('timeline.pickup'),
              }
            ]
          },
        ]
      }
    }

    switch (this.status()) {

      case 'reserved':
        items = [
          {
            label: this.borrowRecord().reservationDate.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'accent',
            lineColor: 'primary',
            lastItem: false,
            items: [
              {
                icon: '@tui.clock',
                label: this.translate.instant('timeline.reservation'),
              }
            ]
          },
          {
            label: this.borrowRecord().startDate.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'secondary',
            lineColor: 'secondary',
            lastItem: false,
            items: [
              {
                icon: '@tui.calendar-clock',
                label: this.translate.instant('timeline.start'),
              }
            ]
          },
          {
            label: this.borrowRecord().endDate.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'secondary',
            lineColor: 'secondary',
            lastItem: false,
            items: [
              {
                icon: '@tui.calendar-check',
                label: this.translate.instant('timeline.end'),
              }
            ]
          }
        ]
        break;

      case 'ready-to-pickup':
        items = [
          {
            label: this.borrowRecord().reservationDate.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'primary',
            lineColor: 'primary',
            lastItem: false,
            items: [
              {
                icon: '@tui.clock',
                label: this.translate.instant('timeline.reservation'),
              }
            ]
          },
          {
            label: this.borrowRecord().startDate.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'accent',
            lineColor: 'accent',
            lastItem: false,
            items: [
              {
                icon: '@tui.calendar-clock',
                label: this.translate.instant('timeline.start'),
              }
            ]
          },
          {
            label: this.borrowRecord().endDate.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'secondary',
            lineColor: 'secondary',
            lastItem: false,
            items: [
              {
                icon: '@tui.calendar-check',
                label: this.translate.instant('timeline.end'),
              }
            ]
          }
        ]
        break;
      case 'currently-borrowed':
        items = [
          {
            label: this.borrowRecord().reservationDate.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'primary',
            lineColor: 'primary',
            lastItem: false,
            items: [
              {
                icon: '@tui.clock',
                label: this.translate.instant('timeline.reservation'),
              }
            ]
          },
          ...timelineStartAndPickup,
          {
            label: this.borrowRecord().endDate.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'secondary',
            lineColor: 'secondary',
            lastItem: false,
            items: [
              {
                icon: '@tui.calendar-check',
                label: this.translate.instant('timeline.end'),
              }
            ]
          }
        ]
        break;

      case 'returned-early':
        items = [
          {
            label: this.borrowRecord().reservationDate.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'primary',
            lineColor: 'primary',
            lastItem: false,
            items: [
              {
                icon: '@tui.clock',
                label: this.translate.instant('timeline.reservation'),
              }
            ]
          },
          ...timelineStartAndPickup,

          {
            label: this.borrowRecord().effectiveReturnDate!.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'accent',
            lineColor: 'success',
            lastItem: false,
            items: [
              {
                icon: '/returnItem.png',
                label: this.translate.instant('timeline.return'),
              }
            ]
          },
          {
            label: this.borrowRecord().endDate.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'success',
            lineColor: 'success',
            lastItem: true,
            items: [
              {
                icon: '@tui.calendar-check',
                label: this.translate.instant('timeline.end'),
              }
            ]
          }
        ]
        break;
      case 'returned':
        items = [
          {
            label: this.borrowRecord().reservationDate.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'primary',
            lineColor: 'primary',
            lastItem: false,
            items: [
              {
                icon: '@tui.clock',
                label: this.translate.instant('timeline.reservation'),
              }
            ]
          },
          ...timelineStartAndPickup,

          {
            label: this.borrowRecord().effectiveReturnDate!.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'accent',
            lineColor: 'success',
            lastItem: true,
            items: [
              {
                icon: '/returnItem.png',
                label: this.translate.instant('timeline.return'),
              }
            ]
          }
        ]
        break;

      case 'due-today':
        items = [
          {
            label: this.borrowRecord().reservationDate.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'primary',
            lineColor: 'primary',
            lastItem: false,
            items: [
              {
                icon: '@tui.clock',
                label: this.translate.instant('timeline.reservation'),
              }
            ]
          },
          ...timelineStartAndPickup,

          {
            label: this.borrowRecord().endDate.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'warning',
            lineColor: 'warning',
            lastItem: false,
            items: [
              {
                icon: '@tui.calendar-check',
                label: this.translate.instant('timeline.end'),
              }
            ]
          }
        ]
        break;

      case 'late':
        items = [
          {
            label: this.borrowRecord().reservationDate.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'primary',
            lineColor: 'primary',
            lastItem: false,
            items: [
              {
                icon: '@tui.clock',
                label: this.translate.instant('timeline.reservation'),
              }
            ]
          },
          ...timelineStartAndPickup,

          {
            label: this.borrowRecord().endDate.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'danger',
            lineColor: 'danger',
            lastItem: false,
            items: [
              {
                icon: '@tui.calendar-check',
                label: this.translate.instant('timeline.end'),
              }
            ]
          }
        ]
        break;

      case 'returned-late':
        items = [
          {
            label: this.borrowRecord().reservationDate.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'primary',
            lineColor: 'primary',
            lastItem: false,
            items: [
              {
                icon: '@tui.clock',
                label: this.translate.instant('timeline.reservation'),
              }
            ]
          },
          ...timelineStartAndPickup,
          {
            label: this.borrowRecord().endDate.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'danger',
            lineColor: 'danger',
            lastItem: false,
            items: [
              {
                icon: '@tui.calendar-check',
                label: this.translate.instant('timeline.end'),
              }
            ]
          },
          {
            label: this.borrowRecord().effectiveReturnDate!.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'danger',
            lineColor: 'danger',
            lastItem: true,
            items: [
              {
                icon: '/returnItem.png',
                label: this.translate.instant('timeline.return'),
              }
            ]
          }
        ]
        break;
    }
    return items;
  });

}
