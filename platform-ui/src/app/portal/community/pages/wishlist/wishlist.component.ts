import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
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
import { UICategory } from '../../models/UICategory';
import { UIItem } from '../../models/UIItem';
import { UIItemsPagination } from '../../models/UIItemsPagination';
import { UILibrary } from '../../models/UILibrary';
import { CategoriesService } from '../../services/categories.service';
import { ItemsService } from '../../services/items.service';
import { LibrariesService } from '../../services/libraries.service';

@Component({
  standalone: true,
  selector: 'app-wishlist',
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
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss',
})
export class WishlistComponent implements OnInit {
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
  // Sorting properties
  static readonly SORT_RECENTLY_ADDED = 'Recently added';
  static readonly SORT_MOST_BORROWED = 'Most borrowed';
  protected sortingOptions = [
    WishlistComponent.SORT_RECENTLY_ADDED,
    WishlistComponent.SORT_MOST_BORROWED,
  ];
  protected currentSortingOption: string | null = null;
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
    this.categoriesService
      .getCategories()
      .subscribe((categories: UICategory[]) => {
        this.categories = categories;
      });
    this.fetchItems();
    this.librariesService.getLibraries().subscribe((libraries) => {
      this.libraries = libraries;
    });
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isMobile = result.matches;
      });
  }

  isCategorySelected(category: any): boolean {
    // Implement your logic to determine if the category is selected
    return this.selectedCategories.has(category.name);
  }

  getSortBy(): 'favorite' | 'createdAt' | 'borrowCount' | undefined {
    switch (this.currentSortingOption) {
      case WishlistComponent.SORT_RECENTLY_ADDED:
        return 'createdAt';
      case WishlistComponent.SORT_MOST_BORROWED:
        return 'borrowCount';
      default:
        return undefined;
    }
  }

  getSortOrder(): 'asc' | 'desc' | undefined {
    // Assuming default sort order is descending
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

  fetchItems() {
    this.itemsService
      .getItems({
        libraryIds: Object.keys(this.selectedLibraries),
        categories: Array.from(this.selectedCategories),
        searchText: this.searchText,
        currentlyAvailable: this.currentlyAvailable,
        sortBy: this.getSortBy(),
        sortOrder: this.getSortOrder(),
        page: this.currentPage,
        pageSize: this.itemsPerPage,
        favorite: true,
      })
      .subscribe((itemsPagination) => {
        this.updatePagination(itemsPagination);
      });
  }
}
