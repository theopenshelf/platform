import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TuiDialogService } from '@taiga-ui/core';
import { TuiDay } from '@taiga-ui/cdk';
import { StarRatingComponent } from '../../../../components/star-rating/star-rating.component';
import { CalendarModule, DateAdapter, CalendarEvent, CalendarUtils, CalendarA11y, CalendarDateFormatter, CalendarEventTitleFormatter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

type ItemStatus = 'available' | 'reserved' | 'borrowed' | 'borrowed-by-me';

interface BorrowRecord {
  borrowedBy: string;
  startDate: string;
  endDate: string;
  status: 'borrowed' | 'reserved';
}

@Component({
  standalone: true,
  imports: [CommonModule, StarRatingComponent, CalendarModule],
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
  providers: [DatePipe, {
    provide: DateAdapter,
    useFactory: adapterFactory,
  },
  CalendarUtils, CalendarA11y, CalendarDateFormatter, CalendarEventTitleFormatter]
})
export class ItemComponent {
  item = {
    name: 'Wireless Mouse',
    description: 'Ergonomic mouse designed for comfort.',
    category: 'electronics',
    imageUrl: '/sterilisateur.png'
  };

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

  borrowNow() {
    alert('Item borrowed successfully!');
  }


  openReservationDialog() {
    this.dialogService
      .open<{ start: TuiDay; end: TuiDay }>('Reserve this item', { label: 'Select dates' })
      .subscribe((result) => {
        if (result) {
          console.log(`Reserved from ${result.start} to ${result.end}`);
        }
      });
  }

  formatDate(date: string): string {
    // Use DatePipe to format the date
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }

   // Navigate to the previous month
   goToPreviousMonth(): void {
    const currentMonth = this.viewDate.getMonth();
    const previousMonth = new Date(this.viewDate);
    previousMonth.setMonth(currentMonth - 1);
    this.viewDate = previousMonth;
  }

  // Navigate to the next month
  goToNextMonth(): void {
    const currentMonth = this.viewDate.getMonth();
    const nextMonth = new Date(this.viewDate);
    nextMonth.setMonth(currentMonth + 1);
    this.viewDate = nextMonth;
  }
}