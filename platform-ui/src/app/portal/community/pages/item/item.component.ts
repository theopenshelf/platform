import { Component, HostListener, Inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TuiAlertService, TuiButton, TuiDialogService, TuiHint, TuiIcon, TuiMarkerHandler } from '@taiga-ui/core';
import { TuiBooleanHandler, TuiDay, TuiDayRange, TuiMonth } from '@taiga-ui/cdk';
import { StarRatingComponent } from '../../../../components/star-rating/star-rating.component';
import { CalendarModule, DateAdapter, CalendarEvent, CalendarUtils, CalendarA11y, CalendarDateFormatter, CalendarEventTitleFormatter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiInputDateRangeModule, TuiUnfinishedValidator } from '@taiga-ui/legacy';
import { TuiCalendarRange } from '@taiga-ui/kit/components/calendar-range';
import { EMPTY, of, switchMap } from 'rxjs';
import { TUI_CALENDAR_DATE_STREAM, TUI_CONFIRM, TuiConfirmData } from '@taiga-ui/kit';
import { Item, BorrowRecord, ItemsService, BorrowItem } from '../../services/items.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TuiResponsiveDialogService } from '@taiga-ui/addon-mobile';
import { CategoryBadgeComponent } from '../../../../components/category-badge/category-badge.component';
import { communityProviders, ITEMS_SERVICE_TOKEN } from '../../community.provider';

const BEFORE_TODAY: string = 'rgba(0, 0, 1, 0)';
const BOOKED: string = 'rgba(0, 0, 2, 0)';
const BOOKED_BY_ME: string = 'rgba(0, 0, 3, 0)';
const AVAILABLE: string = '';
const today = TuiDay.currentLocal();
const plusFive = today.append({ day: 5 });
const plusTen = today.append({ day: 10 });

@Component({
  standalone: true,
  imports: [
    CategoryBadgeComponent,
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
  providers: [
    ...communityProviders,
    DatePipe, 
    {
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
  protected readonly min: TuiDay = TuiDay.fromLocalNativeDate(this.today);
  protected readonly max: TuiDay = new TuiDay(this.today.getFullYear() + 1, this.today.getMonth(), this.today.getDate());
  records: BorrowRecord[] = [];
  selectedDate: TuiDayRange | undefined;
  borrowItemRecord: BorrowItem | undefined;
  disabledItemHandler: TuiBooleanHandler<TuiDay> = (day: TuiDay) => {
    return day.dayBefore(this.min);
  };

  constructor(
    @Inject(ITEMS_SERVICE_TOKEN) private itemsService: ItemsService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private dialogService: TuiDialogService,
    private datePipe: DatePipe,
    private dialogs: TuiResponsiveDialogService,
    private alerts: TuiAlertService,
    private router: Router
  ) {
  }

  get sanitizedDescription(): SafeHtml {
    return this.item ? this.sanitizer.bypassSecurityTrustHtml(this.item.description) : '';
  }
  // Marker handler based on borrow records
  protected markerHandler = (day: TuiDay): [string] => {
    this.updateCellAvailability();
    if (day.dayBefore(this.min)) {
      return [BEFORE_TODAY];
    }
    for (const record of this.records) {
      const startDate = TuiDay.fromLocalNativeDate(new Date(record.startDate));
      const endDate = TuiDay.fromLocalNativeDate(new Date(record.endDate));

      if (day.daySameOrAfter(startDate) && day.daySameOrBefore(endDate)) {
        if (record == this.borrowItemRecord?.record) {
          return [BOOKED_BY_ME]; // Marked day
        }
        return [BOOKED]; // Marked day
      }
    }
    return [AVAILABLE]; // Not marked
  };

  ngOnInit() {
    const itemId = this.route.snapshot.paramMap.get('id');
    if (itemId) {
      this.item = this.itemsService.getItem(itemId);
      this.records = this.itemsService.getItemBorrowRecords(itemId);
      this.borrowItemRecord = this.itemsService.getMyBorrowItem(itemId) || undefined;
    }
  }

  updateCellAvailability() {
    setTimeout(() => {
      const cells = document.querySelectorAll('.t-cell');
      cells.forEach(cell => {
        const dot = cell.querySelector('.t-dot');
        if (dot) {
          cell.classList.remove('not-available');
          cell.classList.remove('t-cell_disabled');
          cell.classList.remove('my-booking');
          const dotColor = window.getComputedStyle(dot).backgroundColor;
          if (dotColor == BEFORE_TODAY) {
            cell.classList.add('t-cell_disabled');
          } else if (dotColor == BOOKED_BY_ME && this.borrowItemRecord) {
            cell.classList.add('my-booking');
          } else if (dotColor == BOOKED) {
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
            this.selectedDate?.from.toLocalNativeDate().toISOString().split('T')[0] ?? '',
            this.selectedDate?.to.toLocalNativeDate().toISOString().split('T')[0] ?? ''
          );
          this.alerts.open(`Successfully borrowed ${this.borrowItemRecord.name} from ${this.borrowItemRecord.record.startDate} to ${this.borrowItemRecord.record.endDate}`, { appearance: 'positive' }).subscribe();
          this.router.navigate(['/community/my-borrowed-items']);
          return EMPTY;
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
            this.updateCellAvailability();
            return this.alerts.open('Reservation cancelled successfully', { appearance: 'success' });
          }
          return EMPTY;
        }))
        .subscribe();
    }
  }

  markAsFavorite() {
    this.itemsService.markAsFavorite(this.item!);
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