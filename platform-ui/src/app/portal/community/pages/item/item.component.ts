import { Component, HostListener } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TuiAlertService, TuiButton, TuiDialogService, TuiHint, TuiIcon, TuiMarkerHandler } from '@taiga-ui/core';
import { TuiDay, TuiDayRange, TuiMonth } from '@taiga-ui/cdk';
import { StarRatingComponent } from '../../../../components/star-rating/star-rating.component';
import { CalendarModule, DateAdapter, CalendarEvent, CalendarUtils, CalendarA11y, CalendarDateFormatter, CalendarEventTitleFormatter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiInputDateRangeModule, TuiUnfinishedValidator } from '@taiga-ui/legacy';
import { TuiCalendarRange } from '@taiga-ui/kit/components/calendar-range';
import { EMPTY, of, switchMap } from 'rxjs';
import { TUI_CALENDAR_DATE_STREAM, TUI_CONFIRM, TuiConfirmData } from '@taiga-ui/kit';
import { Item, BorrowRecord, ItemsService, BorrowItem } from '../../services/items.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TuiResponsiveDialogService } from '@taiga-ui/addon-mobile';

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
  imports: [
    TuiHint,
    TuiCalendarRange,
    CommonModule,
    TuiButton,
    TuiIcon,
    ReactiveFormsModule,
    TuiInputDateRangeModule],
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  providers: [DatePipe, {
    provide: DateAdapter,
    useFactory: adapterFactory,
  }]
})
export class ItemComponent {

  item: Item | undefined;

  protected readonly bookForm = new FormGroup({
    testValue: new FormControl(),
  });
  private readonly today = new Date();
  protected readonly defaultViewedMonth = new TuiMonth(this.today.getFullYear(), this.today.getMonth());
  protected readonly min = new TuiDay(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
  protected readonly max = new TuiDay(this.today.getFullYear() + 1, this.today.getMonth(), this.today.getDate());
  records: BorrowRecord[] = [];
  selectedDate: TuiDayRange | undefined;
  borrowItemRecord: BorrowItem | undefined;

  constructor(private itemsService: ItemsService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private dialogService: TuiDialogService,
    private datePipe: DatePipe,
    private dialogs: TuiResponsiveDialogService,
    private alerts: TuiAlertService,

  ) {
  }

  get sanitizedDescription(): SafeHtml {
    return this.item ? this.sanitizer.bypassSecurityTrustHtml(this.item.description) : '';
  }
  // Marker handler based on borrow records
  protected markerHandler = (day: TuiDay): [string] => {
    this.updateCellAvailability();
    for (const record of this.records) {
      const startDate = TuiDay.fromLocalNativeDate(new Date(record.startDate));
      const endDate = TuiDay.fromLocalNativeDate(new Date(record.endDate));

      if (day.daySameOrAfter(startDate) && day.daySameOrBefore(endDate)) {
        return ONE_DOT; // Marked day
      }
    }
    return NO_DOT; // Not marked
  };

  ngOnInit() {
    const itemId = this.route.snapshot.paramMap.get('id');
    if (itemId) {
      this.item = this.itemsService.getItem(itemId);
      this.records = this.itemsService.getItemBorrowRecords(itemId);
      this.borrowItemRecord = this.itemsService.getMyBorrowItem(itemId);
      if (this.borrowItemRecord) {
        let [day, month, year] = this.borrowItemRecord.record.startDate.split('/'); // Split into parts
        const startDate = TuiDay.fromLocalNativeDate(new Date(`${year}-${month}-${day}`));
        [day, month, year] = this.borrowItemRecord.record.endDate.split('/'); // Split into parts
        const endDate = TuiDay.fromLocalNativeDate(new Date(`${year}-${month}-${day}`));
        this.selectedDate = new TuiDayRange(startDate, endDate);
      }
    }
  }

  updateCellAvailability() {
    setTimeout(() => {
      const cells = document.querySelectorAll('.t-cell');
      cells.forEach(cell => {
        const dot = cell.querySelector('.t-dot');
        cell.classList.remove('not-available');
        cell.classList.remove('t-cell_disabled');
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
  public onRangeChange(range: TuiDayRange | null): void {
    if (range) {
    this.selectedDate = range;
    }
  }

  borrowItem() {
    const data: TuiConfirmData = {
      content: 'Are you sure you want to disable this user?',  // Simple content
      yes: 'Yes, Disable',
      no: 'Cancel',
    };

    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: `Borrow ${this.item?.name}`,
        size: 'm',
        data: {
          content: `Are you sure you want to borrow this item from ${this.selectedDate?.from.toLocalNativeDate().toLocaleDateString()} to ${this.selectedDate?.to.toLocalNativeDate().toLocaleDateString()}?`,
          yes: 'Yes, Borrow',
          no: 'Cancel'
        },
      })
      .pipe(switchMap((response) => {
        if (response) {
          this.borrowItemRecord = this.itemsService.borrowItem(
            this.item!,
            this.selectedDate?.from.toLocalNativeDate().toLocaleDateString() ?? '',
            this.selectedDate?.to.toLocalNativeDate().toLocaleDateString() ?? ''
          );
          return this.alerts.open(`Successfully borrowed ${this.borrowItemRecord.name} from ${this.borrowItemRecord.record.startDate} to ${this.borrowItemRecord.record.endDate}`, { appearance: 'positive' });
        }
        return EMPTY;
      }))
      .subscribe();
  }

  cancelReservation() {
    if (this.borrowItemRecord) {
      this.dialogs
        .open<boolean>(TUI_CONFIRM, {
          label: `Cancel Reservation for ${this.borrowItemRecord.name}`,
          size: 'm',
          data: {
            content: `Are you sure you want to cancel your reservation for ${this.borrowItemRecord.name} from ${this.borrowItemRecord.record.startDate} to ${this.borrowItemRecord.record.endDate}?`,
            yes: 'Yes, Cancel',
            no: 'Keep Reservation'
          },
        })
        .pipe(switchMap((response) => {
          if (response) {
            this.itemsService.cancelReservation(this.borrowItemRecord!);
            this.borrowItemRecord = undefined;
            return this.alerts.open('Reservation cancelled successfully', { appearance: 'success' });
          }
          return EMPTY;
        }))
        .subscribe();
    }
  }

  protected getCategoryBadgeClass(category: string): string {
    switch (category) {
      case 'books':
        return 'badge badge-books';
      case 'electronics':
        return 'badge badge-electronics';
      case 'clothing':
        return 'badge badge-clothing';
      default:
        return '';
    }
  }
}