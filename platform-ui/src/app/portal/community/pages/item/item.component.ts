import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TuiButton, TuiDialogService, TuiMarkerHandler } from '@taiga-ui/core';
import { TuiDay, TuiDayRange, TuiMonth } from '@taiga-ui/cdk';
import { StarRatingComponent } from '../../../../components/star-rating/star-rating.component';
import { CalendarModule, DateAdapter, CalendarEvent, CalendarUtils, CalendarA11y, CalendarDateFormatter, CalendarEventTitleFormatter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiInputDateRangeModule, TuiUnfinishedValidator } from '@taiga-ui/legacy';
import { TuiCalendarRange } from '@taiga-ui/kit/components/calendar-range';
import { of } from 'rxjs';
import { TUI_CALENDAR_DATE_STREAM } from '@taiga-ui/kit';
import { Item, BorrowRecord, ItemsService } from '../../services/items.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
  imports: [TuiCalendarRange, CommonModule, TuiButton, StarRatingComponent, CalendarModule, ReactiveFormsModule, TuiInputDateRangeModule],
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

  constructor(private itemsService: ItemsService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private dialogService: TuiDialogService,
    private datePipe: DatePipe // Inject DatePipe
  ) {
  }

  get sanitizedDescription(): SafeHtml {
    return this.item ? this.sanitizer.bypassSecurityTrustHtml(this.item.description) : '';
  }
  // Marker handler based on borrow records
  protected readonly markerHandler: TuiMarkerHandler = (day: TuiDay) => {
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
      this.records = this.itemsService.getItemBorrowRecords(itemId); // Replace '1' with a dynamic ID if needed

    }
  }

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
}