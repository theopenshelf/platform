import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
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

  protected readonly status = computed(() => {
    return getBorrowRecordStatus(this.borrowRecord());
  });

  protected readonly timelineItems = computed(() => {
    let items: TimelineItem[] = [];
    switch (this.status()) {

      case 'reserved':
        items = [
          {
            label: this.borrowRecord().reservationDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'accent',
            lineColor: 'primary',
            lastItem: false,
            items: [
              {
                icon: '@tui.clock',
                label: 'Reservation',
              }
            ]
          },
          {
            label: this.borrowRecord().startDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'secondary',
            lineColor: 'secondary',
            lastItem: false,
            items: [
              {
                icon: '@tui.calendar-clock',
                label: 'Start',
              }
            ]
          },
          {
            label: this.borrowRecord().endDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'secondary',
            lineColor: 'secondary',
            lastItem: false,
            items: [
              {
                icon: '@tui.calendar-check',
                label: 'End',
              }
            ]
          }
        ]
        break;
      case 'currently-borrowed':
        items = [
          {
            label: this.borrowRecord().reservationDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'primary',
            lineColor: 'primary',
            lastItem: false,
            items: [
              {
                icon: '@tui.clock',
                label: 'Reservation',
              }
            ]
          },
          {
            label: this.borrowRecord().startDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'accent',
            lineColor: 'accent',
            lastItem: false,
            items: [
              {
                icon: '@tui.calendar-clock',
                label: 'Start',
              }
            ]
          },
          {
            label: this.borrowRecord().endDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'secondary',
            lineColor: 'secondary',
            lastItem: false,
            items: [
              {
                icon: '@tui.calendar-check',
                label: 'End',
              }
            ]
          }
        ]
        break;

      case 'returned-early':
        items = [
          {
            label: this.borrowRecord().reservationDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'primary',
            lineColor: 'primary',
            lastItem: false,
            items: [
              {
                icon: '@tui.clock',
                label: 'Reservation',
              }
            ]
          },
          {
            label: this.borrowRecord().startDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'accent',
            lineColor: 'accent',
            lastItem: false,
            items: [
              {
                icon: '@tui.calendar-clock',
                label: 'Start',
              }
            ]
          },
          {
            label: this.borrowRecord().effectiveReturnDate!.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'accent',
            lineColor: 'success',
            lastItem: false,
            items: [
              {
                icon: '/gift.png',
                label: 'Return',
              }
            ]
          },
          {
            label: this.borrowRecord().endDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'success',
            lineColor: 'success',
            lastItem: true,
            items: [
              {
                icon: '@tui.calendar-check',
                label: 'End',
              }
            ]
          }
        ]
        break;
      case 'returned':
        items = [
          {
            label: this.borrowRecord().reservationDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'primary',
            lineColor: 'primary',
            lastItem: false,
            items: [
              {
                icon: '@tui.clock',
                label: 'Reservation',
              }
            ]
          },
          {
            label: this.borrowRecord().startDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'accent',
            lineColor: 'accent',
            lastItem: false,
            items: [
              {
                icon: '@tui.calendar-clock',
                label: 'Start',
              }
            ]
          },
          {
            label: this.borrowRecord().effectiveReturnDate!.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'accent',
            lineColor: 'success',
            lastItem: true,
            items: [
              {
                icon: '/gift.png',
                label: 'Return',
              }
            ]
          }
        ]
        break;

      case 'due-today':
        items = [
          {
            label: this.borrowRecord().reservationDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'primary',
            lineColor: 'primary',
            lastItem: false,
            items: [
              {
                icon: '@tui.clock',
                label: 'Reservation',
              }
            ]
          },
          {
            label: this.borrowRecord().startDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'accent',
            lineColor: 'accent',
            lastItem: false,
            items: [
              {
                icon: '@tui.calendar-clock',
                label: 'Start',
              }
            ]
          },
          {
            label: this.borrowRecord().endDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'warning',
            lineColor: 'warning',
            lastItem: false,
            items: [
              {
                icon: '@tui.calendar-check',
                label: 'End',
              }
            ]
          }
        ]
        break;

      case 'late':
        items = [
          {
            label: this.borrowRecord().reservationDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'primary',
            lineColor: 'primary',
            lastItem: false,
            items: [
              {
                icon: '@tui.clock',
                label: 'Reservation',
              }
            ]
          },
          {
            label: this.borrowRecord().startDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'accent',
            lineColor: 'accent',
            lastItem: false,
            items: [
              {
                icon: '@tui.calendar-clock',
                label: 'Start',
              }
            ]
          },
          {
            label: this.borrowRecord().endDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'danger',
            lineColor: 'danger',
            lastItem: false,
            items: [
              {
                icon: '@tui.calendar-check',
                label: 'End',
              }
            ]
          }
        ]
        break;

      case 'returned-late':
        items = [
          {
            label: this.borrowRecord().reservationDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'primary',
            lineColor: 'primary',
            lastItem: false,
            items: [
              {
                icon: '@tui.clock',
                label: 'Reservation',
              }
            ]
          },
          {
            label: this.borrowRecord().startDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'accent',
            lineColor: 'accent',
            lastItem: false,
            items: [
              {
                icon: '@tui.calendar-clock',
                label: 'Start',
              }
            ]
          },
          {
            label: this.borrowRecord().endDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'danger',
            lineColor: 'danger',
            lastItem: false,
            items: [
              {
                icon: '@tui.calendar-check',
                label: 'End',
              }
            ]
          },
          {
            label: this.borrowRecord().effectiveReturnDate!.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            position: 'left',
            dotColor: 'danger',
            lineColor: 'danger',
            lastItem: true,
            items: [
              {
                icon: '/gift.png',
                label: 'Return',
              }
            ]
          }
        ]
        break;
    }
    return items;
  });
}
