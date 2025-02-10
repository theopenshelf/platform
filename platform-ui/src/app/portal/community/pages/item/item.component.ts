import { DatePipe } from '@angular/common';
import {
  Component,
  computed,
  Inject,
  input,
  OnInit
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  TuiDayRange
} from '@taiga-ui/cdk';
import {
  TuiButton,
  TuiHint,
  TuiIcon,
  TuiNotification
} from '@taiga-ui/core';
import { TuiDayRangePeriod } from '@taiga-ui/kit/components/calendar-range';
import { TuiInputDateRangeModule } from '@taiga-ui/legacy';
import { DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { tap } from 'rxjs';
import { BorrowDialogService } from '../../../../components/borrow-dialog/borrow-dialog.service';
import { AUTH_SERVICE_TOKEN } from '../../../../global.provider';
import { AuthService, UserInfo } from '../../../../services/auth.service';
import { ITEMS_SERVICE_TOKEN, LIBRARIES_SERVICE_TOKEN } from '../../community.provider';
import { BorrowItemCalendarComponent } from '../../components/borrow-item-calendar/borrow-item-calendar.component';
import { FilteredAndPaginatedBorrowRecordsComponent } from '../../components/filtered-and-paginated-borrow-records/filtered-and-paginated-borrow-records.component';
import { getBorrowRecordStatus, UIBorrowRecord, UIBorrowRecordStatus } from '../../models/UIBorrowRecord';
import { UIItem } from '../../models/UIItem';
import { isLibraryAdmin } from '../../models/UILibrary';
import { ItemsService } from '../../services/items.service';
import { LibrariesService } from '../../services/libraries.service';

@Component({
  standalone: true,
  imports: [
    TuiHint,
    TuiButton,
    TuiIcon,
    ReactiveFormsModule,
    TuiInputDateRangeModule,
    TuiNotification,
    TranslateModule,
    FilteredAndPaginatedBorrowRecordsComponent,
    BorrowItemCalendarComponent
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

  records: UIBorrowRecord[] = [];
  selectedDate: TuiDayRange | null | undefined;

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
  library: any;
  protected suggestedDates: TuiDayRangePeriod[] = [];


  constructor(
    @Inject(ITEMS_SERVICE_TOKEN) private itemsService: ItemsService,
    @Inject(LIBRARIES_SERVICE_TOKEN) private librariesService: LibrariesService,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router,
    private translate: TranslateService,
    private borrowDialogService: BorrowDialogService
  ) {
    this.currentUser = this.authService.getCurrentUserInfo();
  }

  isCssLoaded = false;


  ngOnInit() {
    this.itemsService.getItem(this.itemId()).subscribe((item) => {
      this.setItem(item);
      this.librariesService.getLibrary(item.libraryId).subscribe((library) => {
        this.library = library;
      });
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

  reserveItem() {
    this.borrowDialogService.reserveItemWithPreselectedDate(this.currentUser, this.selectedDate!, this.item!, this.itemsService, this.library).pipe(
      tap((item) => {
        this.item = item;
      })
    )
      .subscribe(() => {
        this.router.navigate(['/community/borrowed-items'], { queryParams: { selectedStatus: 'reserved' } });
      });

  }

  cancelReservation(borrowRecord: UIBorrowRecord) {
    this.borrowDialogService.cancelReservation(borrowRecord, this.item!, this.itemsService)
      .pipe(
        tap((item) => {
          this.item = item;
        })
      )
      .subscribe();
  }

  returnItem(borrowRecord: UIBorrowRecord) {
    this.borrowDialogService.returnItem(borrowRecord, this.item!, this.itemsService, this.library)
      .pipe(
        tap((item) => {
          this.setItem(item);
        })
      )
      .subscribe();
  }

  pickUpItem(borrowRecord: UIBorrowRecord) {
    this.borrowDialogService.pickUpItem(borrowRecord, this.item!, this.itemsService, this.library)
      .pipe(
        tap((item) => {
          this.setItem(item);
        })
      )
      .subscribe();
  }

  markAsFavorite() {
    this.itemsService.markAsFavorite(this.item!);
  }

  borrowNowDialog(): void {
    this.borrowDialogService.borrowNowDialog(this.currentUser, isLibraryAdmin(this.currentUser.user, this.library), this.item!, this.library, this.itemsService).pipe(
      tap((item) => {
        this.setItem(item);
      })
    )
      .subscribe(() => {
        this.router.navigate(['/community/borrowed-items'], { queryParams: { selectedStatus: 'reserved' } });
      });
  }

  reserveItemDialog(): void {
    this.borrowDialogService.borrowNowDialog(this.currentUser, isLibraryAdmin(this.currentUser.user, this.library), this.item!, this.library, this.itemsService).pipe(
      tap((item) => {
        this.setItem(item);
      })
    )
      .subscribe(() => {
        this.router.navigate(['/community/borrowed-items'], { queryParams: { selectedStatus: 'reserved' } });
      });
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
