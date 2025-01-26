import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';
import { UIBorrowRecord } from '../../portal/community/models/UIBorrowRecord';
import { UIItem } from '../../portal/community/models/UIItem';
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
  public item = input.required<UIItem>();
  public borrowRecord = input.required<UIBorrowRecord>();

  protected readonly timelineItems = computed(() => {
    const items: TimelineItem[] = [
      {
        label: this.borrowRecord().reservationDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        position: 'right',
        dotColor: 'primary',
        lineColor: 'primary',
        items: [
          {
            icon: '@tui.clock',
            label: 'Reservation',
          }
        ]
      },
      {
        label: this.borrowRecord().startDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        position: 'right',
        dotColor: 'accent',
        lineColor: 'accent',
        items: [
          {
            icon: '@tui.calendar-clock',
            label: 'Start',
          }
        ]
      }
    ]
    const effectiveReturnDate = this.borrowRecord().effectiveReturnDate;
    if (effectiveReturnDate) {
      items.push({
        label: this.borrowRecord().endDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        position: 'right',
        dotColor: 'primary',
        lineColor: 'accent',
        items: [
          {
            icon: '@tui.calendar-check',
            label: 'End',
          }
        ]
      });

      items.push({
        label: effectiveReturnDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        position: 'right',
        dotColor: 'accent',
        lineColor: 'primary',
        items: [
          {
            icon: '/gift.png',
            label: 'Return',
          }
        ]
      })
    } else {
      items.push({
        label: this.borrowRecord().endDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        position: 'right',
        dotColor: 'primary',
        lineColor: 'primary',
        items: [
          {
            icon: '@tui.calendar-check',
            label: 'End',
          }
        ]
      });
    }
    return items;
  });
}
