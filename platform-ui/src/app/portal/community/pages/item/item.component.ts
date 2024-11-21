import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TuiButton, TuiDialogService, TuiMarkerHandler } from '@taiga-ui/core';
import { TuiDay, TuiDayRange, TuiMonth } from '@taiga-ui/cdk';
import { StarRatingComponent } from '../../../../components/star-rating/star-rating.component';
import { CalendarModule, DateAdapter, CalendarEvent, CalendarUtils, CalendarA11y, CalendarDateFormatter, CalendarEventTitleFormatter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {TuiInputDateRangeModule, TuiUnfinishedValidator} from '@taiga-ui/legacy';
import { TuiCalendarRange } from '@taiga-ui/kit/components/calendar-range';
import { of } from 'rxjs';
import { TUI_CALENDAR_DATE_STREAM } from '@taiga-ui/kit';

type ItemStatus = 'available' | 'reserved' | 'borrowed' | 'borrowed-by-me';

interface BorrowRecord {
  borrowedBy: string;
  startDate: string;
  endDate: string;
  status: 'borrowed' | 'reserved';
}
export const calendarStream$ = of(
  new TuiDayRange(new TuiDay(2019, 2, 11), new TuiDay(2019, 2, 14)),
);

const TWO_DOTS: [string, string] = [
  'var(--tui-background-accent-1)',
  'var(--tui-status-info)',
];
const ONE_DOT: [string] = ['var(--tui-background-accent-1)'];
const NO_DOT: [string] = [''];
const today = TuiDay.currentLocal();
const plusFive = today.append({ day: 5 });
const plusTen = today.append({ day: 10 });

@Component({
  standalone: true,
  imports: [TuiCalendarRange, CommonModule, TuiButton, StarRatingComponent, CalendarModule, ReactiveFormsModule, TuiInputDateRangeModule, TuiUnfinishedValidator],
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
  providers: [DatePipe, {
    provide: DateAdapter,
    useFactory: adapterFactory,
  }]
})
export class ItemComponent {
  protected readonly markerHandler: TuiMarkerHandler = (day: TuiDay) =>
    day.dayAfter(plusFive) && day.dayBefore(plusTen) ? ONE_DOT : NO_DOT;
    
    item = {
    name: 'Wireless Mouse',
    description: 'Ergonomic mouse designed for comfort.',
    category: 'electronics',
    imageUrl: '/sterilisateur.png'
  };

  ngAfterViewInit() {
    setTimeout(() => {
      const cells = document.querySelectorAll('.t-cell');
    cells.forEach(cell => {
      const dot = cell.querySelector('.t-dot');
      if (dot) {
        const dotColor = window.getComputedStyle(dot).backgroundColor;
        if (dotColor !== "rgba(0, 0, 0, 0)") {
          
          cell.classList.add('not-available');
          cell.classList.add('t-cell_disabled');
          
        }
      }
    });
    });
  }
  borrowRecords: BorrowRecord[] = [
    {
      borrowedBy: 'me@example.com',
      startDate: '2024-11-18',
      endDate: '2024-11-20',
      status: 'borrowed',
    },
    {
      borrowedBy: 'someone_else@example.com',
      startDate: '2024-12-01',
      endDate: '2024-12-10',
      status: 'reserved',
    },
  ];

  protected readonly bookForm = new FormGroup({
      testValue: new FormControl(
          new TuiDayRange(new TuiDay(2024, 11, 21), new TuiDay(2024, 11, 28)),
      ),
  });
  protected readonly defaultViewedMonth = new TuiMonth(2024, 10) 
  protected readonly min = new TuiDay(2024, 10, 21);
  protected readonly max = new TuiDay(2025, 10, 21);

  itemStatus: ItemStatus = 'available';
  currentUser = 'me@example.com';

  events: CalendarEvent[] = [];
  viewDate: Date = new Date(); // Set the default viewDate to the current date

  constructor(
    private dialogService: TuiDialogService,
    private datePipe: DatePipe // Inject DatePipe
  ) {
    this.updateItemStatus();
    this.mapBorrowRecordsToEvents();
  }

  updateItemStatus(): void {
    const now = new Date();

    // Determine if the item is currently borrowed or reserved
    const activeRecord = this.borrowRecords.find(record => {
      const startDate = new Date(record.startDate);
      const endDate = new Date(record.endDate);
      return startDate <= now && now <= endDate;
    });

    if (activeRecord) {
      if (activeRecord.borrowedBy === this.currentUser && activeRecord.status === 'borrowed') {
        this.itemStatus = 'borrowed-by-me';
      } else if (activeRecord.status === 'borrowed') {
        this.itemStatus = 'borrowed';
      } else if (activeRecord.status === 'reserved') {
        this.itemStatus = 'reserved';
      }
    } else {
      this.itemStatus = 'available';
    }
  }

  mapBorrowRecordsToEvents(): void {
    this.events = this.borrowRecords.map(record => {
      return {
        start: new Date(record.startDate),
        end: new Date(record.endDate),
        title: `${record.status === 'borrowed' ? 'Borrowed' : 'Reserved'} by ${record.borrowedBy}`,
        color: {
          primary: record.status === 'borrowed' ? '#ff6f61' : '#f1c40f', // Red for borrowed, yellow for reserved
          secondary: '#fff',
        },
      };
    });
  }




}