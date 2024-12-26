import { DatePipe, JsonPipe } from '@angular/common';
import { Component, effect, Inject, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TuiResponsiveDialogService } from '@taiga-ui/addon-mobile';
import { TuiBooleanHandler, TuiDay, TuiDayRange, TuiMonth } from '@taiga-ui/cdk';
import { TuiAlertService, TuiButton, TuiDialogService, TuiHint, TuiIcon } from '@taiga-ui/core';
import { TUI_CONFIRM, TuiConfirmData } from '@taiga-ui/kit';
import { TuiCalendarRange } from '@taiga-ui/kit/components/calendar-range';
import { TuiInputDateRangeModule } from '@taiga-ui/legacy';
import type { PolymorpheusContent } from '@taiga-ui/polymorpheus';
import { DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { EMPTY, switchMap, tap } from 'rxjs';
import { CategoryBadgeComponent } from '../../../../components/category-badge/category-badge.component';
import { ITEMS_SERVICE_TOKEN } from '../../community.provider';
import { UIBorrowItem } from '../../models/UIBorrowItem';
import { UIBorrowRecord } from '../../models/UIBorrowRecord';
import { UIItem } from '../../models/UIItem';
import { ItemsService } from '../../services/items.service';

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
    TuiButton,
    TuiIcon,
    ReactiveFormsModule,
    TuiInputDateRangeModule,
    RouterLink,
    JsonPipe
  ],
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  providers: [
    DatePipe,
    {
      provide: DateAdapter,
      useFactory: adapterFactory,
    }]
})
export class ItemComponent {

  itemId = input.required<string>();

  item: UIItem | undefined;

  protected readonly bookForm = new FormGroup({
    testValue: new FormControl(),
  });
  private readonly today = new Date();
  protected readonly defaultViewedMonth = new TuiMonth(this.today.getFullYear(), this.today.getMonth());
  protected readonly min: TuiDay = TuiDay.fromLocalNativeDate(this.today);
  protected readonly max: TuiDay = new TuiDay(this.today.getFullYear() + 1, this.today.getMonth(), this.today.getDate());
  records: UIBorrowRecord[] = [];
  selectedDate: TuiDayRange | undefined;
  borrowItemRecord: UIBorrowItem | undefined;
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
    effect(() => {
      const itemId = this.itemId();
      if (itemId) {
        this.itemsService.getItem(itemId).subscribe(item => this.item = item);
        this.itemsService.getItemBorrowRecords(itemId).subscribe(records => this.records = records);
        this.itemsService.getMyBorrowItem(itemId).subscribe(borrowItemRecord => {
          if (borrowItemRecord && new Date(borrowItemRecord.record.endDate) > new Date()) {
            this.borrowItemRecord = borrowItemRecord;
          } else {
            this.borrowItemRecord = undefined;
          }
        });
      }
    })
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

  borrowItem(header: PolymorpheusContent) {
    const data: TuiConfirmData = {
      content: 'Are you sure you want to disable this user?',  // Simple content
      yes: 'Yes, Disable',
      no: 'Cancel',
    };

    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: `Borrow ${this.item?.name}`,
        size: 'm',
        header: header,
        data: {
          content: `Are you sure you want to borrow this item from ${this.selectedDate?.from.toLocalNativeDate().toLocaleDateString()} to ${this.selectedDate?.to.toLocalNativeDate().toLocaleDateString()}?`,
          yes: 'Yes, Borrow',
          no: 'Cancel'
        },
      })
      .pipe(switchMap((response) => {
        if (response) {
          return this.itemsService.borrowItem(
            this.item!,
            this.selectedDate?.from.toLocalNativeDate().toISOString().split('T')[0] ?? '',
            this.selectedDate?.to.toLocalNativeDate().toISOString().split('T')[0] ?? ''
          ).pipe(
            tap(borrowItemRecord => {
              this.borrowItemRecord = borrowItemRecord;
            })
          ).pipe(
            tap(() => {
              if (this.borrowItemRecord) {
                this.alerts.open(`Successfully borrowed ${this.borrowItemRecord.name} from ${this.borrowItemRecord.record.startDate} to ${this.borrowItemRecord.record.endDate}`, { appearance: 'positive' }).subscribe();
                this.router.navigate(['/community/my-borrowed-items']);
              }
            })
          );
          return EMPTY;
        }
        return EMPTY;
      }))
      .subscribe();
  }

  cancelReservation(header: PolymorpheusContent) {
    if (this.borrowItemRecord) {
      this.dialogs
        .open<boolean>(TUI_CONFIRM, {
          label: `Cancel Reservation for ${this.borrowItemRecord.name}`,
          size: 'm',
          header: header,
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
