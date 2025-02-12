import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, ContentChild, Inject, input, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiDay, TuiDayRange, TuiMonth } from '@taiga-ui/cdk';
import { TuiAppearance, TuiButton, TuiDataList, TuiDropdown, TuiHint, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiAccordion } from '@taiga-ui/experimental';
import { TuiCalendarRange, TuiCarousel, TuiDataListWrapper, TuiPagination, TuiTabs } from '@taiga-ui/kit';
import {
  TuiInputDateRangeModule,
  TuiSelectModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/legacy';
import { Observable } from 'rxjs';
import { AUTH_SERVICE_TOKEN } from '../../../../global.provider';
import { UIBorrowDetailedStatus } from '../../../../models/UIBorrowStatus';
import { UICategory } from '../../../../models/UICategory';
import { UILibrary } from '../../../../models/UILibrary';
import { UIPagination } from '../../../../models/UIPagination';
import { AuthService, UserInfo } from '../../../../services/auth.service';
import {
  CATEGORIES_SERVICE_TOKEN,
  ITEMS_SERVICE_TOKEN,
  LIBRARIES_SERVICE_TOKEN,
} from '../../community.provider';
import { CategoriesService } from '../../services/categories.service';
import { GetItemsParams, ItemsService } from '../../services/items.service';
import { LibrariesService } from '../../services/libraries.service';
import { ItemCardComponent } from '../item-card/item-card.component';

export enum StatusTab {
  Reserved = 'reserved',
  Reserved_ReadyToPickup = 'pickup',
  Borrowed_Active = 'borrowed-active',
  Borrowed_DueToReturn = 'due-to-return',

  Reserved_Unconfirmed = 'reserved-unconfirmed',
  Borrowed_Return_Unconfirmed = 'borrowed-return-unconfirmed',
  Reserved_Pickup_Unconfirmed = 'reserved-pickup-unconfirmed',

  Returned = 'returned'
}

export interface FetchItemsService {
  getItems(params: GetItemsParams): Observable<UIPagination<any>>;
}

@Component({
  standalone: true,
  selector: 'filtered-and-paginated',
  imports: [
    ItemCardComponent,
    CommonModule,
    TuiTextfieldControllerModule,
    FormsModule,
    TuiTable,
    TuiSelectModule,
    TuiTextfield,
    TuiIcon,
    FormsModule,
    ReactiveFormsModule,
    TuiAccordion,
    TuiPagination,
    TuiTabs,
    TuiHint,
    TuiAppearance,
    TuiDataList,
    TuiDataListWrapper,
    TuiInputDateRangeModule,
    TuiButton,
    TuiDataList,
    TuiDropdown,
    TuiCalendarRange,
    TuiCarousel,
    TranslateModule
  ],
  templateUrl: './filtered-and-paginated.component.html',
  styleUrl: './filtered-and-paginated.component.scss'
})
export class FilteredAndPaginatedComponent implements OnInit {


  // Sorting properties
  static readonly SORT_RECENTLY_ADDED = 'Recently added';
  static readonly SORT_MOST_BORROWED = 'Most borrowed';
  static readonly SORT_FAVORITES = 'Favorites';
  static readonly SORT_RESERVATION_DATE = 'Reservation date';
  static readonly SORT_START_DATE = 'Start date';
  static readonly SORT_END_DATE = 'End date';
  static readonly SORT_RETURN_DATE = 'Return date';

  static readonly defaultSortingOptions = [
    FilteredAndPaginatedComponent.SORT_RECENTLY_ADDED,
    FilteredAndPaginatedComponent.SORT_MOST_BORROWED,
    FilteredAndPaginatedComponent.SORT_FAVORITES,
  ];

  // Input properties
  public getItemsParams = input<GetItemsParams>({});
  public enableStatusFiltering = input<boolean>(false);
  public enableCategoriesFiltering = input<boolean>(true);
  public categoriesFilteringOpened = input<boolean>(true);
  public enableSearchBar = input<boolean>(false);
  public sortingOptions = input<string[]>(FilteredAndPaginatedComponent.defaultSortingOptions);
  public getItems = input.required<(getItemsParams: GetItemsParams) => Observable<UIPagination<any>>>();
  public library = input<UILibrary>();
  public approvalTab = input<boolean>(false);

  @ContentChild('sidebarTemplate', { read: TemplateRef })
  sidebarTemplate!: TemplateRef<any>;

  @ContentChild('itemTemplate', { read: TemplateRef })
  itemTemplate!: TemplateRef<any>;


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

  // User information
  currentUser: UserInfo;

  // Data properties
  items: any[] = [];
  categories: UICategory[] = [];
  libraries: UILibrary[] = [];

  // Pagination properties
  totalPages: number = 10;
  currentPage: number = 0;
  itemsPerPage: number = 12; // Default value

  // Filter properties
  selectedCategories: Set<string> = new Set();
  searchText = '';
  currentlyAvailable: boolean = false;
  selectedLibraries: { [key: string]: boolean } = {};
  selectedDate: TuiDayRange | null | undefined;

  protected selectedStatus: StatusTab | undefined = this.enableStatusFiltering() ? StatusTab.Returned : undefined;

  protected statuses = [
    {
      status: StatusTab.Reserved,
      name: 'Reserved',
      color: '#3498db',
      icon: '@tui.calendar-clock',
    },
    {
      status: StatusTab.Reserved_ReadyToPickup,
      name: 'Ready to pickup',
      color: '#3498db',
      icon: '/borrow.png',
    },
    {
      status: StatusTab.Borrowed_Active,
      name: 'Borrowed',
      color: '#95a5a6',
      icon: '@tui.home',
    }, // Gray
    {
      status: StatusTab.Borrowed_DueToReturn,
      name: 'Due to return',
      color: '#2ecc71',
      icon: '/returnItem.png',
    },
    {
      status: StatusTab.Returned,
      name: 'Returned',
      color: '#2ecc71',
      icon: '@tui.archive',
    } // Green
  ];

  protected activeStatusIndex = 0;


  // UI properties
  protected sortingSelected = new FormControl<string | null>(null);
  isMobile: boolean = false;
  requiresApproval: boolean = false;

  constructor(
    @Inject(ITEMS_SERVICE_TOKEN) protected itemsService: ItemsService,
    @Inject(CATEGORIES_SERVICE_TOKEN) protected categoriesService: CategoriesService,
    @Inject(LIBRARIES_SERVICE_TOKEN) protected librariesService: LibrariesService,
    @Inject(AUTH_SERVICE_TOKEN) protected authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
  ) {
    this.currentUser = this.authService.getCurrentUserInfo()
    this.sortingSelected.valueChanges.subscribe((value) => {
      this.resetItems();
      this.updateQueryParams();
    });
  }

  ngOnInit() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.route.queryParams.subscribe((params) => {
      this.searchText = params['searchText'] || '';
      this.selectedCategories = new Set(
        params['selectedCategories']
          ? params['selectedCategories'].split(',')
          : [],
      );
      this.selectedStatus = params['selectedStatus']
        ? params['selectedStatus']
        : StatusTab.Returned;
      this.currentPage = +params['page'] - 1 || 0;
      this.activeStatusIndex = this.statuses.findIndex(
        (status) => status!.status === this.selectedStatus,
      );
      if (params['sortingOption']) {
        this.sortingSelected.setValue(params['sortingOption']);
      }


      if (this.approvalTab()) {
        this.statuses = [
          {
            status: StatusTab.Reserved_Unconfirmed,
            name: 'Reserved (unconfirmed)',
            color: '#3498db',
            icon: '@tui.calendar-clock',
          },
          {
            status: StatusTab.Reserved_Pickup_Unconfirmed,
            name: 'Pickup (unconfirmed)',
            color: '#3498db',
            icon: '@tui.calendar-clock',
          },
          {
            status: StatusTab.Borrowed_Return_Unconfirmed,
            name: 'Returned (unconfirmed)',
            color: '#2ecc71',
            icon: '@tui.archive',
          }// Green
        ];
      }
      this.fetchItems();
    });


    this.route.queryParams.subscribe((params) => {
      this.searchText = params['searchText'] || '';
      this.selectedStatus = params['selectedStatus']
      this.selectedCategories = new Set(
        params['selectedCategories']
          ? params['selectedCategories'].split(',')
          : [],
      );
      this.selectedLibraries = params['selectedLibraries']
        ? JSON.parse(params['selectedLibraries'])
        : {};
      this.currentPage = +params['page'] - 1 || 0;
      if (params['startDate'] && params['endDate']) {
        const start = params['startDate'].split('.').map(Number) as [
          number,
          number,
          number,
        ];
        const end = params['endDate'].split('.').map(Number) as [
          number,
          number,
          number,
        ];
        this.selectedDate = new TuiDayRange(
          new TuiDay(start[2], start[1] - 1, start[0]),
          new TuiDay(end[2], end[1] - 1, end[0]),
        );
        this.fetchItems();
      }
    });

    this.categoriesService
      .getCategories()
      .subscribe((categories: UICategory[]) => {
        this.categories = categories;
      });
    this.librariesService.getLibraries().subscribe((libraries) => {
      this.libraries = libraries;
    });
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isMobile = result.matches;
      });
  }

  // Public methods
  goToPage(page: number) {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.fetchItems();
  }

  onTextFilterChange() {
    this.resetItems();
    this.updateQueryParams();
  }

  toggleCategorySelection(category: UICategory) {
    if (this.selectedCategories.has(category.name)) {
      this.selectedCategories.delete(category.name);
    } else {
      this.selectedCategories.add(category.name);
    }
    this.resetItems();
  }

  toggleLibrarySelection(library: UILibrary) {
    if (this.selectedLibraries[library.id]) {
      delete this.selectedLibraries[library.id];
    } else {
      this.selectedLibraries[library.id] = true;
    }
    this.resetItems();
  }

  selectedLibrariesCount(): number {
    return Object.keys(this.selectedLibraries).length;
  }

  public onRangeChange(range: TuiDayRange | null): void {
    if (range) {
      this.selectedDate = range;
      this.resetItems();
      this.updateQueryParams();
    }
  }

  // Helper methods
  isCategorySelected(category: any): boolean {
    return this.selectedCategories.has(category.name);
  }

  isLibrarySelected(library: UILibrary): boolean {
    return this.selectedLibraries[library.id] !== undefined;
  }

  isSortingSelected(sortingOption: string): boolean {
    return this.sortingSelected.value === sortingOption;
  }


  getSortBy(): 'favorite' | 'createdAt' | 'borrowCount' | 'reservationDate' | 'startDate' | 'endDate' | 'returnDate' | undefined {
    switch (this.sortingSelected.value) {
      case FilteredAndPaginatedComponent.SORT_RECENTLY_ADDED:
        return 'createdAt';
      case FilteredAndPaginatedComponent.SORT_MOST_BORROWED:
        return 'borrowCount';
      case FilteredAndPaginatedComponent.SORT_FAVORITES:
        return 'favorite';
      case FilteredAndPaginatedComponent.SORT_RESERVATION_DATE:
        return 'reservationDate';
      case FilteredAndPaginatedComponent.SORT_START_DATE:
        return 'startDate';
      case FilteredAndPaginatedComponent.SORT_END_DATE:
        return 'endDate';
      case FilteredAndPaginatedComponent.SORT_RETURN_DATE:
        return 'returnDate';
      default:
        return undefined;
    }
  }

  getSortOrder(): 'asc' | 'desc' | undefined {
    return 'desc';
  }

  // Private methods
  protected updatePagination(itemsPagination: UIPagination<any>) {
    this.totalPages = itemsPagination.totalPages;
    this.currentPage = itemsPagination.currentPage;
    this.itemsPerPage = itemsPagination.itemsPerPage;
    this.items = itemsPagination.items;
  }

  public resetItems() {
    this.currentPage = 0;
    this.fetchItems();
  }

  protected fetchItems(): void {

    let statuses: UIBorrowDetailedStatus[] = [];
    if (this.approvalTab()) {
      switch (this.selectedStatus) {
        case StatusTab.Reserved_Unconfirmed:
          statuses = [UIBorrowDetailedStatus.Borrowed_Return_Unconfirmed];
          break;
        case StatusTab.Reserved_Pickup_Unconfirmed:
          statuses = [UIBorrowDetailedStatus.Reserved_Pickup_Unconfirmed];
          break;
        case StatusTab.Reserved_Unconfirmed:
          statuses = [UIBorrowDetailedStatus.Reserved_Unconfirmed];
          break;
        default:
          statuses = []
          break;
      }
    } else {
      switch (this.selectedStatus) {
        case StatusTab.Returned:
          statuses = [UIBorrowDetailedStatus.Borrowed_Return_Unconfirmed, UIBorrowDetailedStatus.Returned_OnTime, UIBorrowDetailedStatus.Returned_Early, UIBorrowDetailedStatus.Returned_Late];
          break;
        case StatusTab.Borrowed_Active:
          statuses = [UIBorrowDetailedStatus.Borrowed_Active];
          break;
        case StatusTab.Borrowed_DueToReturn:
          statuses = [UIBorrowDetailedStatus.Borrowed_DueToday, UIBorrowDetailedStatus.Borrowed_Late];
          break;
        case StatusTab.Reserved_ReadyToPickup:
          statuses = [UIBorrowDetailedStatus.Reserved_Pickup_Unconfirmed, UIBorrowDetailedStatus.Reserved_ReadyToPickup];
          break;
        case StatusTab.Reserved:
          statuses = [UIBorrowDetailedStatus.Reserved_Confirmed, UIBorrowDetailedStatus.Reserved_Unconfirmed];
          break;
        default:
          statuses = []
          break;
      }
    }

    this.getItems()!(
      {
        ...this.getItemsParams(),
        statuses: statuses,
        libraryIds: this.getItemsParams().libraryIds ? this.getItemsParams().libraryIds : Object.keys(this.selectedLibraries),
        categories: Array.from(this.selectedCategories),
        searchText: this.searchText,
        currentlyAvailable: this.currentlyAvailable,
        sortBy: this.getSortBy(),
        sortOrder: this.getSortOrder(),
        page: this.currentPage,
        pageSize: this.itemsPerPage,
        startDate: this.selectedDate?.from.toLocalNativeDate(),
        endDate: this.selectedDate?.to.toLocalNativeDate(),
      }
    ).subscribe((itemsPagination) => {
      this.updatePagination(itemsPagination);
    });
  }

  protected selectStatus(status: StatusTab): void {
    this.selectedStatus = status;
    this.currentPage = 0;
    this.fetchItems();
    this.updateQueryParams();
  }

  toggleSortBy(sortingOption: string) {
    this.sortingSelected.setValue(sortingOption);
    this.resetItems();
    this.updateQueryParams();
  }

  protected openDropdownCategories = false;

  protected closeDropdownCategories(): void {
    this.openDropdownCategories = false;
  }

  protected openDropdownWhere = false;

  protected closeDropdownWhere(): void {
    this.openDropdownWhere = false;
  }


  protected openDropdownWhen = false;

  protected closeDropdownWhen(): void {
    this.openDropdownWhen = false;
  }

  protected openDropdownSort = false;

  protected closeDropdownSort(): void {
    this.openDropdownSort = false;
  }


  private updateQueryParams() {
    const queryParams: any = {};

    if (this.searchText) {
      queryParams.searchText = this.searchText;
    }
    if (this.currentlyAvailable) {
      queryParams.currentlyAvailable = this.currentlyAvailable;
    }
    if (this.selectedCategories.size > 0) {
      queryParams.selectedCategories = Array.from(this.selectedCategories).join(
        ',',
      );
    }
    if (Object.keys(this.selectedLibraries).length > 0) {
      queryParams.selectedLibraries = JSON.stringify(this.selectedLibraries);
    }
    if (this.selectedDate) {
      queryParams.startDate = this.selectedDate.from.toString();
      queryParams.endDate = this.selectedDate.to.toString();
    }
    if (this.selectedStatus) {
      queryParams.selectedStatus = this.selectedStatus;
    }

    queryParams.sortingOption = this.sortingSelected.value;
    queryParams.page = this.currentPage + 1;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });
  }
  public getStatusText(status: StatusTab): string {
    return this.translate.instant(`filteredAndPaginated.${status.toLowerCase()}`);
  };

}
