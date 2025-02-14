import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Inject, input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BorrowDialogService } from '../../../../components/borrow-dialog/borrow-dialog.service';
import { AUTH_SERVICE_TOKEN } from '../../../../global.provider';
import { UIBorrowRecord } from '../../../../models/UIBorrowRecord';
import { UIBorrowRecordStandalone } from '../../../../models/UIBorrowRecordsPagination';
import { UIBorrowDetailedStatus } from '../../../../models/UIBorrowStatus';
import { UIItem } from '../../../../models/UIItem';
import { UILibrary } from '../../../../models/UILibrary';
import { UIPagination } from '../../../../models/UIPagination';
import { UIUser } from '../../../../models/UIUser';
import { AuthService, UserInfo } from '../../../../services/auth.service';
import { CATEGORIES_SERVICE_TOKEN, ITEMS_SERVICE_TOKEN, LIBRARIES_SERVICE_TOKEN, USERS_SERVICE_TOKEN } from '../../community.provider';
import { CategoriesService } from '../../services/categories.service';
import { GetItemsParams, ItemsService } from '../../services/items.service';
import { LibrariesService } from '../../services/libraries.service';
import { UsersService } from '../../services/users.service';
import { BorrowRecordCardComponent } from '../borrow-record-card/borrow-record-card.component';
import { FilteredAndPaginatedComponent } from '../filtered-and-paginated/filtered-and-paginated.component';
@Component({
  standalone: true,
  selector: 'filtered-and-paginated-borrow-records',
  imports: [
    BorrowRecordCardComponent,
    FilteredAndPaginatedComponent,
  ],
  templateUrl: './filtered-and-paginated-borrow-records.component.html',
  styleUrl: './filtered-and-paginated-borrow-records.component.scss'
})
export class FilteredAndPaginatedBorrowRecordsComponent {
  // Sorting properties

  static readonly defaultSortingOptions = [
    FilteredAndPaginatedComponent.SORT_RESERVATION_DATE,
    FilteredAndPaginatedComponent.SORT_START_DATE,
    FilteredAndPaginatedComponent.SORT_END_DATE,
    FilteredAndPaginatedComponent.SORT_RETURN_DATE,
  ];


  currentUser: UserInfo;
  libraries: UILibrary[] = [];

  public getItemsParams = input<GetItemsParams>({
    borrowedByCurrentUser: true,
  });
  public enableStatusFiltering = input<boolean>(false);
  public showItem = input<boolean>(true);
  public enableCategoriesFiltering = input<boolean>(true);
  public categoriesFilteringOpened = input<boolean>(true);
  public enableSearchBar = input<boolean>(false);
  public sortingOptions = input<string[]>(FilteredAndPaginatedBorrowRecordsComponent.defaultSortingOptions);
  public library = input<UILibrary>();
  public approvalTab = input<boolean>(false);

  @ViewChild(FilteredAndPaginatedComponent) filteredAndPaginatedComponent!: FilteredAndPaginatedComponent;

  public usersById: Map<string, UIUser> = new Map();

  constructor(
    @Inject(ITEMS_SERVICE_TOKEN) protected itemsService: ItemsService,
    @Inject(CATEGORIES_SERVICE_TOKEN) protected categoriesService: CategoriesService,
    @Inject(LIBRARIES_SERVICE_TOKEN) protected librariesService: LibrariesService,
    @Inject(USERS_SERVICE_TOKEN) protected usersService: UsersService,
    @Inject(AUTH_SERVICE_TOKEN) protected authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router,
    private borrowDialogService: BorrowDialogService,
  ) {
    this.currentUser = this.authService.getCurrentUserInfo()

  }

  ngOnInit() {
    this.librariesService.getLibraries().subscribe((libraries) => {
      this.libraries = libraries;
    });

    if (!this.getItemsParams().borrowedByCurrentUser) {
      this.usersService.getUsers().subscribe((users) => {
        this.usersById = new Map(users.map(user => [user.id, user]));
      });
    }
  }


  getLibrary(libraryId: string): UILibrary | undefined {
    return this.libraries.find((library) => library.id === libraryId);
  }


  public fetchItems = (getItemsParams: GetItemsParams): Observable<UIPagination<UIBorrowRecordStandalone>> => {
    return this.itemsService.getBorrowRecords(getItemsParams);
  }

  public fetchItemsCountByStatus = (getItemsParams: GetItemsParams): Observable<Map<UIBorrowDetailedStatus, number>> => {

    if (this.approvalTab()) {
      return this.itemsService.getBorrowRecordsCountByStatus({
        ...getItemsParams,
        statuses: [
          UIBorrowDetailedStatus.Reserved_Unconfirmed,
          UIBorrowDetailedStatus.Borrowed_Return_Unconfirmed,
          UIBorrowDetailedStatus.Reserved_Pickup_Unconfirmed,
        ],
      });
    } else {
      return this.itemsService.getBorrowRecordsCountByStatus({
        ...getItemsParams,
        statuses: [
          UIBorrowDetailedStatus.Reserved_Confirmed,
          UIBorrowDetailedStatus.Reserved_Unconfirmed,
          UIBorrowDetailedStatus.Borrowed_Return_Unconfirmed,
          UIBorrowDetailedStatus.Reserved_Pickup_Unconfirmed,
          UIBorrowDetailedStatus.Reserved_ReadyToPickup,
          UIBorrowDetailedStatus.Borrowed_Active,
          UIBorrowDetailedStatus.Borrowed_DueToday,
          UIBorrowDetailedStatus.Returned_OnTime,
          UIBorrowDetailedStatus.Returned_Early,
          UIBorrowDetailedStatus.Returned_Late,
          UIBorrowDetailedStatus.Borrowed_Late,
        ],
      });
    }
  }


  public pickUpItem = (item: UIItem, borrowRecord: UIBorrowRecord) => {
    this.borrowDialogService.pickUpItem(borrowRecord, item, this.itemsService, this.getLibrary(item.libraryId)!).subscribe(i => {
      this.filteredAndPaginatedComponent.resetItems();
    });
  }

  public returnItem = (item: UIItem, borrowRecord: UIBorrowRecord) => {
    this.borrowDialogService.returnItem(borrowRecord, item, this.itemsService, this.getLibrary(item.libraryId)!).subscribe(i => {
      this.filteredAndPaginatedComponent.resetItems();
    });
  }

  public cancelReservation = (item: UIItem, borrowRecord: UIBorrowRecord) => {
    this.borrowDialogService.cancelReservation(borrowRecord, item, this.itemsService).subscribe(i => {
      this.filteredAndPaginatedComponent.resetItems();
    });
  }

  public reserveConfirmation = (item: UIItem, borrowRecord: UIBorrowRecord) => {
    this.borrowDialogService.approveReservation(borrowRecord, item, this.itemsService, this.getLibrary(item.libraryId)!).subscribe(i => {
      this.filteredAndPaginatedComponent.resetItems();
    });
  }

  public pickupConfirmation = (item: UIItem, borrowRecord: UIBorrowRecord) => {
    this.borrowDialogService.approvePickup(borrowRecord, item, this.itemsService, this.getLibrary(item.libraryId)!).subscribe(i => {
      this.filteredAndPaginatedComponent.resetItems();
    });
  }

  public returnConfirmation = (item: UIItem, borrowRecord: UIBorrowRecord) => {
    this.borrowDialogService.approveReturn(borrowRecord, item, this.itemsService, this.getLibrary(item.libraryId)!).subscribe(i => {
      this.filteredAndPaginatedComponent.resetItems();
    });
  }
}
