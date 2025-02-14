import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TuiDay, TuiDayRange, TuiMonth } from '@taiga-ui/cdk';
import { TuiCalendar, TuiIcon } from '@taiga-ui/core';
import { TuiTabs } from '@taiga-ui/kit';
import { BorrowRecordCardComponent } from '../../../../components/borrow-record-card/borrow-record-card.component';
import { UIBorrowRecord } from '../../../../models/UIBorrowRecord';
import { UIBorrowRecordStandalone } from '../../../../models/UIBorrowRecordsPagination';
import { UIBorrowStatus } from '../../../../models/UIBorrowStatus';
import { UIUser } from '../../../../models/UIUser';
import { ITEMS_SERVICE_TOKEN, USERS_SERVICE_TOKEN } from '../../admin.providers';
import { CardCounterComponent } from '../../components/dashboards/card-counter/card-counter.component';
import { ItemsService, UIItemWithStats } from '../../services/items.service';
import { UsersService } from '../../services/users.service';

const BOOKED: string = 'rgba(0, 0, 2, 0)';
const AVAILABLE: string = '';

@Component({
  selector: 'app-item-activity',
  imports: [
    TuiIcon,
    TuiCalendar,
    CardCounterComponent,
    TuiTabs,
    BorrowRecordCardComponent,
    TranslateModule
  ],
  templateUrl: './item-activity.component.html',
  styleUrl: './item-activity.component.scss',

})
export class ItemActivityComponent {
  itemId: string | null = null;
  item: UIItemWithStats = {} as UIItemWithStats;

  protected value: TuiDayRange | null = null;

  protected firstMonth = TuiMonth.currentLocal();


  protected lastMonth = TuiMonth.currentLocal().append({ month: 1 });

  protected borrowRecordsByStatus: { [key: string]: UIBorrowRecordStandalone[] } = {
    [UIBorrowStatus.Returned]: [],
    [UIBorrowStatus.CurrentlyBorrowed]: [],
    [UIBorrowStatus.Reserved]: [],
  };

  protected hoveredItem: TuiDay | null = null;
  protected selectedStatus: UIBorrowStatus = UIBorrowStatus.Reserved;
  protected activeStatusIndex = 2;
  protected statuses = [
    {
      status: UIBorrowStatus.Returned,
      name: 'Returned',
      color: '#95a5a6',
      icon: '@tui.archive',
    }, // Gray
    {
      status: UIBorrowStatus.CurrentlyBorrowed,
      name: 'Currently Borrowed',
      color: '#2ecc71',
      icon: '/borrow.png',
    }, // Green
    {
      status: UIBorrowStatus.Reserved,
      name: 'Reserved',
      color: '#3498db',
      icon: '@tui.calendar-clock',
    }, // Light Blue
  ];
  users: UIUser[] = [];
  usersById: { [email: string]: UIUser } = {};

  favoritesCount: number = 3;
  avgBorrowDuration: string = '3 days';
  reservationsCount: number = 30;
  currentStatus: string = 'Available';
  returnsCount: number = 100;
  lateCount: string = '3 %';

  isMobile: boolean = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,

    @Inject(ITEMS_SERVICE_TOKEN) private itemsService: ItemsService,
    @Inject(USERS_SERVICE_TOKEN) private usersService: UsersService,
  ) {
    this.breakpointObserver.observe(['(max-width: 680px)']).subscribe((result) => {
      this.isMobile = result.matches;
    });
  }

  ngOnInit() {
    this.itemId = this.route.snapshot.paramMap.get('id');
    if (this.itemId) {
      this.itemsService.getItem(this.itemId).subscribe((item) => {
        this.item = item;
        this.buildBorrowRecordsByStatus();
      });
    }
    this.usersService.getUsers().subscribe((users) => {
      this.users = users;
      this.usersById = this.createUsersByIdMap(users);
    });
  }

  get sanitizedDescription(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.item?.description ?? '');
  }

  protected markerHandler = (day: TuiDay): [string] => {
    this.updateCellAvailability();

    for (const record of this.item?.borrowRecords || []) {
      const startDate = TuiDay.fromLocalNativeDate(new Date(record.startDate));
      const endDate = TuiDay.fromLocalNativeDate(new Date(record.endDate));

      if (day.daySameOrAfter(startDate) && day.daySameOrBefore(endDate)) {
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
          const dotColor = window.getComputedStyle(dot).backgroundColor;
          if (dotColor == BOOKED) {
            cell.classList.add('not-available');
            cell.classList.add('t-cell_disabled');
          }
        }
      });
    });
  }

  protected onDayClick(day: TuiDay): void {
    if (!this.value?.isSingleDay) {
      this.value = new TuiDayRange(day, day);
    }

    this.value = TuiDayRange.sort(this.value.from, day);
  }

  protected onMonthChangeFirst(month: TuiMonth): void {
    this.firstMonth = month;
    this.lastMonth = month.append({ month: 1 });
  }


  protected onMonthChangeLast(month: TuiMonth): void {
    this.firstMonth = month.append({ month: -1 });
    this.lastMonth = month;
  }

  protected selectStatus(status: UIBorrowStatus): void {
    this.selectedStatus = status;
  }

  private buildBorrowRecordsByStatus(): void {
    const today = new Date();
    this.borrowRecordsByStatus = this.item.borrowRecords.reduce((acc, record) => {
      let status: UIBorrowStatus;

      if (record.endDate < today) {
        status = UIBorrowStatus.Returned;
      } else if (record.startDate <= today && record.endDate >= today) {
        status = UIBorrowStatus.CurrentlyBorrowed;
      } else {
        status = UIBorrowStatus.Reserved;
      }

      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push({ ...record, item: this.item });
      return acc;
    }, {} as { [key: string]: UIBorrowRecordStandalone[] });

    // Ensure each status is initialized with at least an empty array
    this.borrowRecordsByStatus = {
      [UIBorrowStatus.Returned]: this.borrowRecordsByStatus[UIBorrowStatus.Returned] || [],
      [UIBorrowStatus.CurrentlyBorrowed]: this.borrowRecordsByStatus[UIBorrowStatus.CurrentlyBorrowed] || [],
      [UIBorrowStatus.Reserved]: this.borrowRecordsByStatus[UIBorrowStatus.Reserved] || [],
    };

    // Sort each status's records by start date
    this.borrowRecordsByStatus[UIBorrowStatus.Reserved].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    this.borrowRecordsByStatus[UIBorrowStatus.Returned].sort((a, b) => -1 * (new Date(a.startDate).getTime() - new Date(b.startDate).getTime()));

    this.returnsCount = this.borrowRecordsByStatus[UIBorrowStatus.Returned].length;

    this.returnsCount = this.borrowRecordsByStatus[UIBorrowStatus.Returned].length;
    var nbLateReturns = this.borrowRecordsByStatus[UIBorrowStatus.Returned].filter(record => record.effectiveReturnDate && record.effectiveReturnDate > record.endDate).length;

    this.lateCount = ((nbLateReturns / this.returnsCount) * 100).toFixed(0) + '%';

    this.avgBorrowDuration = (this.borrowRecordsByStatus[UIBorrowStatus.CurrentlyBorrowed].reduce((acc, record) => acc + (new Date(record.endDate).getTime() - new Date(record.startDate).getTime()), 0) / (1000 * 60 * 60 * 24) / this.borrowRecordsByStatus[UIBorrowStatus.CurrentlyBorrowed].length).toFixed(0) + ' days';
    this.reservationsCount = this.borrowRecordsByStatus[UIBorrowStatus.Reserved].length;
    this.currentStatus = this.borrowRecordsByStatus[UIBorrowStatus.CurrentlyBorrowed].length > 0 ? 'Currently Borrowed' : 'Available';
  }

  private createUsersByIdMap(users: UIUser[]): { [email: string]: UIUser } {
    return users.reduce((map, user) => {
      map[user.id] = user;
      return map;
    }, {} as { [email: string]: UIUser });
  }

  public duration(start: Date, end: Date): string {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + ' days';
  }



  public getReturnedOnTimeStatus(record: UIBorrowRecord): { 'label': string; 'status': 'on-time' | 'late' | 'before-end-date' | 'not-returned' } {
    if (record.effectiveReturnDate) {
      if (
        record.effectiveReturnDate.getFullYear() === record.endDate.getFullYear() &&
        record.effectiveReturnDate.getMonth() === record.endDate.getMonth() &&
        record.effectiveReturnDate.getDate() === record.endDate.getDate()
      ) {
        return {
          label: 'On Time',
          status: 'on-time'
        };
      } else if (record.effectiveReturnDate < record.endDate) {
        return {
          label: 'Before End Date',
          status: 'before-end-date'
        };
      } else {
        return {
          label: 'Late',
          status: 'late'
        };
      }
    }
    return {
      label: 'Not Returned',
      status: 'not-returned'
    };

  }
}

