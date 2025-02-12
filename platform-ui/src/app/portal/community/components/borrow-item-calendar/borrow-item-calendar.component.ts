import { AsyncPipe } from '@angular/common';
import { Component, effect, inject, INJECTOR, Injector, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TuiMobileCalendarDropdown, TuiResponsiveDialogService } from '@taiga-ui/addon-mobile';
import { TuiBooleanHandler, tuiControlValue, TuiDay, TuiDayRange, TuiMonth } from '@taiga-ui/cdk';
import { TUI_MONTHS, TuiButton, TuiHint } from '@taiga-ui/core';
import { TUI_CALENDAR_DATE_STREAM, TuiCalendarRange } from '@taiga-ui/kit';
import { TuiInputDateRangeModule } from '@taiga-ui/legacy';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { combineLatest, map, Observable } from 'rxjs';
import { UIItem } from '../../../../models/UIItem';
import { UserInfo } from '../../../../services/auth.service';

const BEFORE_TODAY: string = 'rgba(0, 0, 1, 0)';
const BOOKED: string = 'rgba(0, 0, 2, 0)';
const BOOKED_BY_ME: string = 'rgba(0, 0, 3, 0)';
const AVAILABLE: string = '';

@Component({
  selector: 'borrow-item-calendar',
  imports: [
    TuiHint,
    TuiCalendarRange,
    TuiButton,
    ReactiveFormsModule,
    TuiInputDateRangeModule,
    AsyncPipe,
    TranslateModule,
  ],
  templateUrl: './borrow-item-calendar.component.html',
  styleUrl: './borrow-item-calendar.component.scss'
})
export class BorrowItemCalendarComponent {

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

  private readonly dialog$: Observable<TuiDayRange>;
  protected readonly date$;

  private readonly injector = inject(INJECTOR);
  private readonly months$ = inject(TUI_MONTHS);
  public readonly control;
  public item = input.required<UIItem>();
  public currentUser = input.required<UserInfo>();
  public selectedDate = output<TuiDayRange | null | undefined>();

  constructor(
    private translate: TranslateService,
    private dialogs: TuiResponsiveDialogService,
  ) {
    this.control = new FormControl<TuiDayRange | null | undefined>(null);

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

    // Create an effect to watch for changes in the item signal
    effect(() => {
      this.item(); // Access the signal to track it
      this.updateCellAvailability();
    });
  }


  // Marker handler based on borrow records
  protected disabledItemHandlerForMobile = (day: TuiDay): boolean => {
    this.updateCellAvailability();
    if (day.dayBefore(this.min)) {
      return true;
    }
    for (const record of this.item().borrowRecords) {
      const startDate = TuiDay.fromLocalNativeDate(new Date(record.startDate));
      const endDate = TuiDay.fromLocalNativeDate(new Date(record.endDate));

      if (day.daySameOrAfter(startDate) && day.daySameOrBefore(endDate)) {
        return true; // Marked day
      }
    }
    return false; // Not marked
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

  protected markerHandler = (day: TuiDay): [string] => {
    this.updateCellAvailability();
    if (day.dayBefore(this.min)) {
      return [BEFORE_TODAY];
    }
    for (const record of this.item().borrowRecords) {
      const startDate = TuiDay.fromLocalNativeDate(new Date(record.startDate));
      const endDate = TuiDay.fromLocalNativeDate(new Date(record.endDate));

      if (day.daySameOrAfter(startDate) && day.daySameOrBefore(endDate)) {
        if (
          this.item().borrowRecords.find(
            (record) => record.borrowedBy === this.currentUser().email,
          )
        ) {
          return [BOOKED_BY_ME]; // Marked day
        }
        return [BOOKED]; // Marked day
      }
    }
    return [AVAILABLE]; // Not marked
  };

  public onRangeChange(range: TuiDayRange | null): void {
    if (range) {
      this.selectedDate.emit(range);
    }
  }

  protected get empty(): boolean {
    return !this.control.value;
  }

  protected onChooseDate(): void {
    this.dialog$.subscribe((value) => this.control.setValue(value));
  }

  disabledItemHandler: TuiBooleanHandler<TuiDay> = (day: TuiDay) => {
    return day.dayBefore(this.min);
  };
}

