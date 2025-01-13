import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiDay, TuiDayRange, TuiMonth } from '@taiga-ui/cdk';
import { TuiButton, TuiDataList, TuiDropdown, TuiHint, TuiIcon, TuiTextfield } from "@taiga-ui/core";
import { TuiAppearance } from '@taiga-ui/core/directives/appearance';
import { TuiAccordion, TuiCalendarRange, TuiCarousel, TuiCheckbox, TuiDataListWrapper, TuiPagination, TuiSwitch } from '@taiga-ui/kit';
import { TuiInputDateRangeModule, TuiSelectModule, TuiTextfieldControllerModule, TuiUnfinishedValidator } from '@taiga-ui/legacy';
import { CATEGORIES_SERVICE_TOKEN, ITEMS_SERVICE_TOKEN, LIBRARIES_SERVICE_TOKEN } from '../../community.provider';
import { ItemCardComponent } from '../../components/item-card/item-card.component';
import { UIBorrowRecord } from '../../models/UIBorrowRecord';
import { UICategory } from '../../models/UICategory';
import { UIItem } from '../../models/UIItem';
import { UIItemsPagination } from '../../models/UIItemsPagination';
import { UILibrary } from '../../models/UILibrary';
import { CategoriesService } from '../../services/categories.service';
import { ItemsService } from '../../services/items.service';
import { LibrariesService } from '../../services/libraries.service';



@Component({
  standalone: true,
  selector: 'app-items',
  imports: [
    ItemCardComponent,
    TuiHint,
    TuiIcon,
    TuiAppearance,
    TuiCheckbox,
    FormsModule,
    TuiTextfield,
    ReactiveFormsModule,
    TuiDataList,
    TuiDataListWrapper,
    TuiSelectModule,
    TuiTextfieldControllerModule,
    TuiSwitch,
    TuiPagination,
    TuiAccordion,
    TuiInputDateRangeModule,
    TuiUnfinishedValidator,
    TuiButton,
    TuiDataList,
    TuiDropdown,
    TuiCalendarRange,
    TuiCarousel
  ],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {

  private readonly today = new Date();
  protected readonly defaultViewedMonth = new TuiMonth(this.today.getFullYear(), this.today.getMonth());
  protected readonly min: TuiDay = TuiDay.fromLocalNativeDate(this.today);
  protected readonly max: TuiDay = new TuiDay(this.today.getFullYear() + 1, this.today.getMonth(), this.today.getDate());


  // Data properties
  items: UIItem[] = [];
  categories: UICategory[] = [];
  libraries: UILibrary[] = [];

  // Filter properties
  selectedCategories: Set<string> = new Set();
  searchText = '';
  currentlyAvailable: boolean = false;
  selectedLibraries: { [key: string]: boolean } = {};
  selectedDate: TuiDayRange | null | undefined;

  // Sorting properties
  static readonly SORT_RECENTLY_ADDED = 'Recently added';
  static readonly SORT_MOST_BORROWED = 'Most borrowed';
  static readonly SORT_FAVORITES = 'Favorites';
  protected sortingOptions = [
    ItemsComponent.SORT_RECENTLY_ADDED,
    ItemsComponent.SORT_MOST_BORROWED,
    ItemsComponent.SORT_FAVORITES,
  ];
  protected currentSortingOption: string | null = null;

  // Pagination properties
  totalPages: number = 10;
  currentPage: number = 0;
  itemsPerPage: number = 12; // Default value

  // Responsive design
  isMobile: boolean = false;
  currentUser: any = "me@example.com"; //TODO: get current user from auth service

  constructor(
    @Inject(ITEMS_SERVICE_TOKEN) private itemsService: ItemsService,
    @Inject(CATEGORIES_SERVICE_TOKEN) private categoriesService: CategoriesService,
    @Inject(LIBRARIES_SERVICE_TOKEN) private librariesService: LibrariesService,
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchText = params['searchText'] || '';
      this.currentlyAvailable = params['currentlyAvailable'] === 'true';
      this.selectedCategories = new Set(params['selectedCategories'] ? params['selectedCategories'].split(',') : []);
      this.selectedLibraries = params['selectedLibraries'] ? JSON.parse(params['selectedLibraries']) : {};
      this.currentPage = +params['page'] - 1 || 0;
      if (params['startDate'] && params['endDate']) {
        const start = params['startDate'].split('.').map(Number) as [number, number, number];
        const end = params['endDate'].split('.').map(Number) as [number, number, number];
        this.selectedDate = new TuiDayRange(new TuiDay(start[2], start[1] - 1, start[0]), new TuiDay(end[2], end[1] - 1, end[0]));
      }
    });
    this.initializeData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private initializeData() {
    this.fetchItems();
    this.categoriesService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
    this.librariesService.getLibraries().subscribe(libraries => {
      this.libraries = libraries;
    });
  }


  fetchItems() {
    this.itemsService.getItems(
      false,
      false,
      Object.keys(this.selectedLibraries),
      Array.from(this.selectedCategories),
      this.searchText,
      this.currentlyAvailable,
      this.getSortBy(),
      this.getSortOrder(),
      this.currentPage,
      this.itemsPerPage,
      this.selectedDate?.from.toLocalNativeDate(),
      this.selectedDate?.to.toLocalNativeDate()
    ).subscribe(itemsPagination => {
      this.updatePagination(itemsPagination);
    });
  }

  private updatePagination(itemsPagination: UIItemsPagination) {
    this.totalPages = itemsPagination.totalPages;
    this.currentPage = itemsPagination.currentPage;
    this.itemsPerPage = itemsPagination.itemsPerPage;
    this.items = itemsPagination.items;
  }

  resetItems() {
    this.currentPage = 0;
    this.fetchItems();
  }

  getSortBy(): string | undefined {
    switch (this.currentSortingOption) {
      case ItemsComponent.SORT_RECENTLY_ADDED:
        return 'createdAt';
      case ItemsComponent.SORT_MOST_BORROWED:
        return 'borrowCount';
      case ItemsComponent.SORT_FAVORITES:
        return 'favorite';
      default:
        return undefined;
    }
  }

  getSortOrder(): string | undefined {
    // Assuming default sort order is descending
    return 'desc';
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
    this.updateQueryParams();
  }

  isLibrarySelected(library: UILibrary): boolean {
    return this.selectedLibraries[library.id] !== undefined;
  }

  toggleLibrarySelection(library: UILibrary) {
    if (this.selectedLibraries[library.id]) {
      delete this.selectedLibraries[library.id];
    } else {
      this.selectedLibraries[library.id] = true;
    }
    this.resetItems();
    this.updateQueryParams();
  }

  isSortingSelected(sortingOption: string): boolean {
    return this.currentSortingOption === sortingOption;
  }

  toggleSortBy(sortingOption: string) {
    this.currentSortingOption = sortingOption;
    this.resetItems();
  }

  public onRangeChange(range: TuiDayRange | null): void {
    if (range) {
      this.selectedDate = range;
      this.resetItems();
      this.updateQueryParams();
    }
  }

  markAsFavorite(item: UIItem) {
    this.itemsService.markAsFavorite(item).subscribe();
  }

  isCategorySelected(category: UICategory): boolean {
    return this.selectedCategories.has(category.name);
  }

  getLibrary(libraryId: string): UILibrary | undefined {
    return this.libraries.find(library => library.id === libraryId);
  }

  getBorrowRecords(itemId: string): UIBorrowRecord[] {
    return this.items.find(item => item.id === itemId)?.borrowRecords.filter(record => record.endDate >= new Date() && record.borrowedBy === this.currentUser) || [];
  }

  goToPage(page: number) {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.fetchItems();
    this.updateQueryParams();
  }

  protected openDropdownWhen = false;

  protected closeDropdownWhen(): void {
    this.openDropdownWhen = false;
  }


  protected openDropdownSort = false;

  protected closeDropdownSort(): void {
    this.openDropdownSort = false;
  }

  protected categoriesIndex = 0;


  protected openDropdownCategories = false;

  protected closeDropdownCategories(): void {
    this.openDropdownCategories = false;
  }

  protected openDropdownWhere = false;

  protected closeDropdownWhere(): void {
    this.openDropdownWhere = false;
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
      queryParams.selectedCategories = Array.from(this.selectedCategories).join(',');
    }
    if (Object.keys(this.selectedLibraries).length > 0) {
      queryParams.selectedLibraries = JSON.stringify(this.selectedLibraries);
    }
    if (this.selectedDate) {
      queryParams.startDate = this.selectedDate.from.toString();
      queryParams.endDate = this.selectedDate.to.toString();
    }
    queryParams.page = this.currentPage + 1;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }
}
