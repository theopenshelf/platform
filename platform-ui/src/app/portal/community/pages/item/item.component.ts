import { AsyncPipe, DatePipe } from '@angular/common';
import {
  Component,
  computed,
  inject,
  Inject,
  INJECTOR,
  Injector,
  input,
  OnInit
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  TuiMobileCalendarDropdown,
  TuiResponsiveDialogService
} from '@taiga-ui/addon-mobile';
import {
  TuiBooleanHandler,
  tuiControlValue,
  TuiDay,
  TuiDayRange,
  TuiMonth,
} from '@taiga-ui/cdk';
import {
  TUI_MONTHS,
  TuiAlertService,
  TuiButton,
  TuiDialogService,
  TuiHint,
  TuiIcon,
  TuiNotification
} from '@taiga-ui/core';
import {
  TUI_CALENDAR_DATE_STREAM,
  TUI_CONFIRM,
  TuiConfirmData,
} from '@taiga-ui/kit';
import { TuiCalendarRange, TuiDayRangePeriod } from '@taiga-ui/kit/components/calendar-range';
import { TuiInputDateRangeModule } from '@taiga-ui/legacy';
import { PolymorpheusComponent, PolymorpheusContent } from '@taiga-ui/polymorpheus';
import { DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { combineLatest, EMPTY, map, Observable, switchMap, tap } from 'rxjs';
import { BorrowDialogService } from '../../../../components/borrow-dialog/borrow-dialog.service';
import { AUTH_SERVICE_TOKEN } from '../../../../global.provider';
import { AuthService, UserInfo } from '../../../../services/auth.service';
import { ITEMS_SERVICE_TOKEN } from '../../community.provider';
import { BorrowRecordCardComponent } from '../../components/borrow-record-card/borrow-record-card.component';
import { FilteredAndPaginatedBorrowRecordsComponent } from '../../components/filtered-and-paginated-borrow-records/filtered-and-paginated-borrow-records.component';
import { getBorrowRecordStatus, UIBorrowRecord, UIBorrowRecordStatus } from '../../models/UIBorrowRecord';
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
    TuiHint,
    TuiCalendarRange,
    TuiButton,
    TuiIcon,
    ReactiveFormsModule,
    TuiInputDateRangeModule,
    TuiNotification,
    AsyncPipe,
    DatePipe,
    BorrowRecordCardComponent,
    TranslateModule,
    FilteredAndPaginatedBorrowRecordsComponent
  ],
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  providers: [
    DatePipe,
    {
      provide: DateAdapter,
      useFactory: adapterFactory,
    },
  ],
})
export class ItemComponent implements OnInit {
  itemId = input.required<string>();

  item: UIItem | undefined;
  borrowItemRecordsForCurrentUser: UIBorrowRecord[] = [];

  protected readonly bookForm = new FormGroup({
    testValue: new FormControl(),
  });
  private readonly today = new Date();
  protected readonly defaultViewedMonth = new TuiMonth(
    this.today.getFullYear(),
    this.today.getMonth(),
  );
  protected readonly min: TuiDay = TuiDay.fromLocalNativeDate(this.today);
  protected readonly max: TuiDay = new TuiDay(
    this.today.getFullYear() + 1,
    this.today.getMonth(),
    this.today.getDate(),
  );
  records: UIBorrowRecord[] = [];
  selectedDate: TuiDayRange | null | undefined;

  disabledItemHandler: TuiBooleanHandler<TuiDay> = (day: TuiDay) => {
    return day.dayBefore(this.min);
  };
  currentUser: UserInfo;
  isReserved = false;
  nextReservation: UIBorrowRecord | undefined = undefined;
  itemsReturned: UIBorrowRecord[] = [];
  itemsReserved: UIBorrowRecord[] = [];
  itemsCurrentlyBorrowed: UIBorrowRecord | undefined;
  itemsReadyToPickup: UIBorrowRecord | undefined;
  public getItemsParams = computed(() => ({
    borrowedByCurrentUser: true,
    itemId: this.itemId(),
  }));

  constructor(
    @Inject(ITEMS_SERVICE_TOKEN) private itemsService: ItemsService,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private dialogService: TuiDialogService,
    private datePipe: DatePipe,
    private dialogs: TuiResponsiveDialogService,
    private alerts: TuiAlertService,
    private router: Router,
    private translate: TranslateService,
    private borrowDialogService: BorrowDialogService
  ) {
    this.currentUser = this.authService.getCurrentUserInfo();
    this.control = new FormControl<TuiDayRange | null | undefined>(
      this.selectedDate,
    );

    this.control.valueChanges.subscribe(
      (value: TuiDayRange | null | undefined) => {
        this.selectedDate = value;
      },
    );

    this.date$ = combineLatest([
      tuiControlValue<TuiDayRange>(this.control),
      this.months$,
    ]).pipe(
      map(([value, months]) => {
        if (!value) {
          return this.translate.instant('item.chooseDateRange');
        }

        return value.isSingleDay
          ? `${months[value.from.month]} ${value.from.day}, ${value.from.year}`
          : `${months[value.from.month]} ${value.from.day}, ${value.from.year} - ${months[value.to.month]
          } ${value.to.day}, ${value.to.year}`;
      }),
    );

    this.dialog$ = this.dialogs.open(
      new PolymorpheusComponent(
        TuiMobileCalendarDropdown,
        Injector.create({
          providers: [
            {
              provide: TUI_CALENDAR_DATE_STREAM,
              useValue: tuiControlValue(this.control),
            },
          ],
          parent: this.injector,
        }),
      ),
      {
        size: 'fullscreen',
        closeable: false,
        data: {
          single: false,
          min: this.min,
          max: this.max,
          disabledItemHandler: this.disabledItemHandlerForMobile,
        },
      },
    );
  }

  isCssLoaded = false;


  ngOnInit() {
    this.itemsService.getItem(this.itemId()).subscribe((item) => {
      this.setItem(item);
      this.route.queryParams.subscribe(params => {
        const action = params['ACTION'];
        switch (action) {
          case 'return':
            if (this.itemsCurrentlyBorrowed) {
              this.returnItem(this.itemsCurrentlyBorrowed);
            }
            break;
          case 'pickUp':
            if (this.itemsReadyToPickup) {
              this.pickUpItem(this.itemsReadyToPickup);
            }
            break;
          // Add more cases if needed
          default:
            break;
        }
      });
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.isCssLoaded = true;

  }

  setItem(item: UIItem) {
    this.item = item;

    this.borrowItemRecordsForCurrentUser = item.borrowRecords
      .filter((record) => record.borrowedBy === this.currentUser.email)
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());


    this.itemsReserved = this.borrowItemRecordsForCurrentUser.filter(
      (record) => {
        const status = getBorrowRecordStatus(record);
        switch (status) {
          case UIBorrowRecordStatus.Reserved:
            return true;
          default:
            return false;
        }
      }
    ).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    this.isReserved = this.itemsReserved.length > 0;
    this.nextReservation = this.itemsReserved[0];

    this.itemsReturned = this.borrowItemRecordsForCurrentUser.filter(
      (record) => {
        const status = getBorrowRecordStatus(record);
        switch (status) {
          case UIBorrowRecordStatus.Returned:
          case UIBorrowRecordStatus.ReturnedEarly:
          case UIBorrowRecordStatus.ReturnedLate:
            return true;
          default:
            return false;
        }
      }
    ).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    this.itemsCurrentlyBorrowed = this.borrowItemRecordsForCurrentUser.find(
      (record) => {
        const status = getBorrowRecordStatus(record);
        switch (status) {
          case UIBorrowRecordStatus.CurrentlyBorrowed:
          case UIBorrowRecordStatus.Late:
          case UIBorrowRecordStatus.DueToday:
            return true;
          default:
            return false;
        }
      }
    );

    this.itemsReadyToPickup = this.borrowItemRecordsForCurrentUser.find(
      (record) => {
        const status = getBorrowRecordStatus(record);
        return status === UIBorrowRecordStatus.ReadyToPickup;
      }
    );
  }


  get sanitizedDescription(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.item?.description ?? '');
  }
  // Marker handler based on borrow records
  protected markerHandler = (day: TuiDay): [string] => {
    this.updateCellAvailability();
    if (day.dayBefore(this.min)) {
      return [BEFORE_TODAY];
    }
    for (const record of this.item?.borrowRecords || []) {
      const startDate = TuiDay.fromLocalNativeDate(new Date(record.startDate));
      const endDate = TuiDay.fromLocalNativeDate(new Date(record.endDate));

      if (day.daySameOrAfter(startDate) && day.daySameOrBefore(endDate)) {
        if (
          this.item?.borrowRecords.find(
            (record) => record.borrowedBy === this.currentUser.email,
          )
        ) {
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
      cells.forEach((cell) => {
        const dot = cell.querySelector('.t-dot');
        if (dot) {
          cell.classList.remove('not-available');
          cell.classList.remove('t-cell_disabled');
          cell.classList.remove('my-booking');
          const dotColor = window.getComputedStyle(dot).backgroundColor;
          if (dotColor == BEFORE_TODAY) {
            cell.classList.add('t-cell_disabled');
          } else if (dotColor == BOOKED_BY_ME) {
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

  public borrowItemConfirmation(): void {
    this.itemsService
      .borrowItem(
        this.item!,
        this.selectedDate?.from
          .toLocalNativeDate()
          .toISOString()
          .split('T')[0] ?? '',
        this.selectedDate?.to
          .toLocalNativeDate()
          .toISOString()
          .split('T')[0] ?? '',
      )
      .pipe(
        tap((item) => {
          this.setItem(item);
          this.alerts
            .open(
              this.translate.instant('item.borrowSuccess', {
                itemName: this.item?.name,
                startDate: this.selectedDate?.from.toLocalNativeDate().toLocaleDateString(this.translate.currentLang, { day: 'numeric', month: 'short', year: 'numeric' }),
                endDate: this.selectedDate?.to.toLocalNativeDate().toLocaleDateString(this.translate.currentLang, { day: 'numeric', month: 'short', year: 'numeric' }),
              }),
              { appearance: 'positive' },
            )
            .subscribe();
          this.router.navigate(['/community/borrowed-items'], { queryParams: { selectedStatus: 'reserved' } });
        }),
      )
      .subscribe();
  }

  borrowItem() {
    const data: TuiConfirmData = {
      content: this.translate.instant('item.confirmBorrowContent', {
        itemName: this.item?.name,
        startDate: this.selectedDate?.from.toLocalNativeDate().toLocaleDateString(this.translate.currentLang, { day: 'numeric', month: 'short', year: 'numeric' }),
        endDate: this.selectedDate?.to.toLocalNativeDate().toLocaleDateString(this.translate.currentLang, { day: 'numeric', month: 'short', year: 'numeric' }),
      }),
      yes: this.translate.instant('item.yesBorrow'),
      no: this.translate.instant('item.cancel'),
    };

    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: this.translate.instant('item.borrowLabel', { itemName: this.item?.name }),
        size: 'm',
        data,
      })
      .pipe(
        switchMap((response) => {
          if (response) {
            this.borrowItemConfirmation();
            return EMPTY;
          }
          return EMPTY;
        }),
      )
      .subscribe();
  }

  cancelReservation(borrowRecord: UIBorrowRecord) {
    this.borrowDialogService.cancelReservation(borrowRecord, this.item!, this.itemsService)
      .pipe(
        tap((item) => {
          this.item = item;
          this.updateCellAvailability();
        })
      )
      .subscribe();
  }

  returnItem(borrowRecord: UIBorrowRecord) {
    this.borrowDialogService.returnItem(borrowRecord, this.item!, this.itemsService)
      .pipe(
        tap((item) => {
          this.setItem(item);
          this.updateCellAvailability();
        })
      )
      .subscribe();
  }

  pickUpItem(borrowRecord: UIBorrowRecord) {
    this.borrowDialogService.pickUpItem(borrowRecord, this.item!, this.itemsService)
      .pipe(
        tap((item) => {
          this.setItem(item);
          this.updateCellAvailability();
        })
      )
      .subscribe();
  }

  markAsFavorite() {
    this.itemsService.markAsFavorite(this.item!);
  }


  borrowNowDialog(
    choose: PolymorpheusContent,
  ): void {
    this.borrowDialogService.borrowNowDialog(choose, this.item!, this.itemsService);
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

  //mobile calendar

  private readonly injector = inject(INJECTOR);
  private readonly months$ = inject(TUI_MONTHS);
  public readonly control;

  private readonly dialog$: Observable<TuiDayRange>;

  protected readonly date$;

  protected suggestedDates: TuiDayRangePeriod[] = [];

  protected get empty(): boolean {
    return !this.control.value;
  }

  protected onChooseDate(): void {
    this.dialog$.subscribe((value) => this.control.setValue(value));
  }

  // Marker handler based on borrow records
  protected disabledItemHandlerForMobile = (day: TuiDay): boolean => {
    this.updateCellAvailability();
    if (day.dayBefore(this.min)) {
      return true;
    }
    for (const record of this.records) {
      const startDate = TuiDay.fromLocalNativeDate(new Date(record.startDate));
      const endDate = TuiDay.fromLocalNativeDate(new Date(record.endDate));

      if (day.daySameOrAfter(startDate) && day.daySameOrBefore(endDate)) {
        return true; // Marked day
      }
    }
    return false; // Not marked
  };

  formatReservationDate(date: Date | undefined): string | null {
    if (date) {
      return date.toLocaleDateString(this.translate.currentLang, { day: 'numeric', month: 'short', year: 'numeric' });
    }
    return null;
  }

  isItemAvailable(): boolean {
    const today = new Date();
    return !this.item?.borrowRecords.some((record) => {
      const pickupDate = record.pickupDate ? new Date(record.pickupDate) : new Date(record.startDate);
      const endDate = new Date(record.endDate);

      // If there's no effectiveReturnDate, the item is still borrowed
      if (!record.effectiveReturnDate) {
        return false;
      }

      // If effectiveReturnDate is set, check if the item was returned early
      const effectiveReturnDate = new Date(record.effectiveReturnDate);
      return pickupDate <= today && today < effectiveReturnDate;
    });
  }

  isNextReservationStartingSoon(): boolean {
    if (!this.nextReservation) {
      return false;
    }

    const today = new Date();
    const startDate = new Date(this.nextReservation.startDate);
    const timeDifference = startDate.getTime() - today.getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24);

    return daysDifference < 2;
  }
}
