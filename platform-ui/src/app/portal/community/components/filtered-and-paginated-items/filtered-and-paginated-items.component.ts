import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, ContentChild, Inject, input, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiAccordion, TuiPagination, TuiTabs } from '@taiga-ui/kit';
import {
  TuiSelectModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/legacy';
import { AUTH_SERVICE_TOKEN } from '../../../../global.provider';
import { AuthService, UserInfo } from '../../../../services/auth.service';
import {
  CATEGORIES_SERVICE_TOKEN,
  ITEMS_SERVICE_TOKEN,
  LIBRARIES_SERVICE_TOKEN,
} from '../../community.provider';
import { ItemCardComponent } from '../../components/item-card/item-card.component';
import { UIBorrowRecord } from '../../models/UIBorrowRecord';
import { UIBorrowStatus } from '../../models/UIBorrowStatus';
import { UICategory } from '../../models/UICategory';
import { UIItem } from '../../models/UIItem';
import { UIItemsPagination } from '../../models/UIItemsPagination';
import { UILibrary } from '../../models/UILibrary';
import { CategoriesService } from '../../services/categories.service';
import { GetItemsParams, ItemsService } from '../../services/items.service';
import { LibrariesService } from '../../services/libraries.service';



@Component({
  standalone: true,
  selector: 'filtered-and-paginated-items',
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
  ],
  templateUrl: './filtered-and-paginated-items.component.html',
  styleUrl: './filtered-and-paginated-items.component.scss'
})
export class FilteredAndPaginatedItemsComponent implements OnInit {


  // Sorting properties
  static readonly SORT_RECENTLY_ADDED = 'Recently added';
  static readonly SORT_MOST_BORROWED = 'Most borrowed';
  static readonly SORT_FAVORITES = 'Favorites';

  static readonly defaultSortingOptions = [
    FilteredAndPaginatedItemsComponent.SORT_RECENTLY_ADDED,
    FilteredAndPaginatedItemsComponent.SORT_MOST_BORROWED,
    FilteredAndPaginatedItemsComponent.SORT_FAVORITES,
  ];

  // Input properties
  public getItemsParams = input.required<GetItemsParams>();
  public enableStatusFiltering = input<boolean>(false);
  public enableCategoriesFiltering = input<boolean>(true);
  public categoriesFilteringOpened = input<boolean>(true);
  public sortingOptions = input<string[]>(FilteredAndPaginatedItemsComponent.defaultSortingOptions);
  @ContentChild('sidebarTemplate', { read: TemplateRef })
  sidebarTemplate!: TemplateRef<any>;
  @ContentChild('itemTemplate', { read: TemplateRef })
  itemTemplate!: TemplateRef<any>;


  // User information
  currentUser: UserInfo;

  // Data properties
  items: UIItem[] = [];
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

  protected currentSortingOption: string | null = null;
  protected selectedStatus: UIBorrowStatus | undefined = this.enableStatusFiltering() ? UIBorrowStatus.Returned : undefined;

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
      icon: '/gift.png',
    }, // Green
    {
      status: UIBorrowStatus.Reserved,
      name: 'Reserved',
      color: '#3498db',
      icon: '@tui.calendar-clock',
    }, // Light Blue
  ];

  protected activeStatusIndex = 0;


  // UI properties
  protected testValue = new FormControl<string | null>(null);
  isMobile: boolean = false;

  constructor(
    @Inject(ITEMS_SERVICE_TOKEN) private itemsService: ItemsService,
    @Inject(CATEGORIES_SERVICE_TOKEN)
    private categoriesService: CategoriesService,
    @Inject(LIBRARIES_SERVICE_TOKEN) private librariesService: LibrariesService,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.currentUser = this.authService.getCurrentUserInfo()
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
        : UIBorrowStatus.Returned;
      this.currentPage = +params['page'] - 1 || 0;
      this.activeStatusIndex = this.statuses.findIndex(
        (status) => status.status === this.selectedStatus,
      );
      this.fetchItems();
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

  toggleSortBy(sortingOption: string) {
    this.currentSortingOption = sortingOption;
    this.resetItems();
  }

  // Helper methods
  isCategorySelected(category: any): boolean {
    return this.selectedCategories.has(category.name);
  }

  isLibrarySelected(library: UILibrary): boolean {
    return this.selectedLibraries[library.id] !== undefined;
  }

  isSortingSelected(sortingOption: string): boolean {
    return this.currentSortingOption === sortingOption;
  }

  getSortBy(): 'favorite' | 'createdAt' | 'borrowCount' | undefined {
    switch (this.currentSortingOption) {
      case FilteredAndPaginatedItemsComponent.SORT_RECENTLY_ADDED:
        return 'createdAt';
      case FilteredAndPaginatedItemsComponent.SORT_MOST_BORROWED:
        return 'borrowCount';
      default:
        return undefined;
    }
  }

  getSortOrder(): 'asc' | 'desc' | undefined {
    return 'desc';
  }

  getLibrary(libraryId: string): UILibrary | undefined {
    return this.libraries.find((library) => library.id === libraryId);
  }

  getBorrowRecords(itemId: string): UIBorrowRecord[] {
    return (
      this.items
        .find((item) => item.id === itemId)
        ?.borrowRecords.filter(
          (record) =>
            record.endDate >= new Date() &&
            record.borrowedBy === this.currentUser.email,
        ) || []
    );
  }

  // Private methods
  private updatePagination(itemsPagination: UIItemsPagination) {
    this.totalPages = itemsPagination.totalPages;
    this.currentPage = itemsPagination.currentPage;
    this.itemsPerPage = itemsPagination.itemsPerPage;
    this.items = itemsPagination.items;
  }

  private resetItems() {
    this.currentPage = 0;
    this.fetchItems();
  }

  private fetchItems() {
    this.itemsService
      .getItems({
        ...this.getItemsParams(),
        status: this.selectedStatus,
        libraryIds: Object.keys(this.selectedLibraries),
        categories: Array.from(this.selectedCategories),
        searchText: this.searchText,
        currentlyAvailable: this.currentlyAvailable,
        sortBy: this.getSortBy(),
        sortOrder: this.getSortOrder(),
        page: this.currentPage,
        pageSize: this.itemsPerPage,
      })
      .subscribe((itemsPagination) => {
        this.updatePagination(itemsPagination);
      });
  }

  protected selectStatus(status: UIBorrowStatus): void {
    this.selectedStatus = status;
    this.fetchItems();
    this.updateQueryParams();
  }

  private updateQueryParams() {
    const queryParams: any = {};

    if (this.searchText) {
      queryParams.searchText = this.searchText;
    }
    if (this.selectedCategories.size > 0) {
      queryParams.selectedCategories = Array.from(this.selectedCategories).join(
        ',',
      );
    } else {
      queryParams.selectedCategories = undefined;
    }
    if (this.selectedStatus) {
      queryParams.selectedStatus = this.selectedStatus;
    }
    queryParams.page = this.currentPage + 1;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });
  }
}
