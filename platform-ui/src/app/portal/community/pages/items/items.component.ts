import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiDay } from '@taiga-ui/cdk';
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

  // Data properties
  items: UIItem[] = [];
  categories: UICategory[] = [];
  libraries: UILibrary[] = [];

  // Filter properties
  selectedCategories: Set<string> = new Set();
  searchText = '';
  currentlyAvailable: boolean = false;
  selectedLibraries: { [key: string]: boolean } = {};

  protected readonly min = TuiDay.currentLocal();
  protected readonly max = this.min.append({ year: 1 });

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
  itemsPerPage: number = 8; // Adjust this number as needed

  // Responsive design
  isMobile: boolean = false;
  currentUser: any = "me@example.com"; //TODO: get current user from auth service

  constructor(
    @Inject(ITEMS_SERVICE_TOKEN) private itemsService: ItemsService,
    @Inject(CATEGORIES_SERVICE_TOKEN) private categoriesService: CategoriesService,
    @Inject(LIBRARIES_SERVICE_TOKEN) private librariesService: LibrariesService,
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit() {
    this.observeBreakpoints();
    this.initializeData();
  }

  private observeBreakpoints() {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });
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
      this.itemsPerPage
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
  }

  toggleCategorySelection(category: UICategory) {
    if (this.selectedCategories.has(category.name)) {
      this.selectedCategories.delete(category.name);
    } else {
      this.selectedCategories.add(category.name);
    }
    this.resetItems();
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
  }

  isSortingSelected(sortingOption: string): boolean {
    return this.currentSortingOption === sortingOption;
  }

  toggleSortBy(sortingOption: string) {
    this.currentSortingOption = sortingOption;
    this.resetItems();
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
    this.fetchItems();
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
}
