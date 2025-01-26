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
    const endDate = this.borrowRecord().endDate;

    if (effectiveReturnDate) {
      if (effectiveReturnDate < endDate) {
        items.push({
          label: effectiveReturnDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
          position: 'right',
          dotColor: 'accent',
          lineColor: 'success',
          items: [
            {
              icon: '/gift.png',
              label: 'Return',
            }
          ]
        });

        items.push({
          label: endDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
          position: 'right',
          dotColor: 'success',
          lineColor: 'primary',
          items: [
            {
              icon: '@tui.calendar-check',
              label: 'End',
            }
          ]
        });
      } else if (effectiveReturnDate > endDate) {
        items.push({
          label: endDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
          position: 'right',
          dotColor: 'danger',
          lineColor: 'danger',
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
          dotColor: 'danger',
          lineColor: 'primary',
          items: [
            {
              icon: '/gift.png',
              label: 'Return',
            }
          ]
        });
      } else {
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
        });
      }
    } else {
      items.push({
        label: endDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
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
