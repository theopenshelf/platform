import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiDataList, TuiHint, TuiIcon, TuiTextfield, TuiTitle } from "@taiga-ui/core";
import { TuiAppearance } from '@taiga-ui/core/directives/appearance';
import { TuiAccordion, TuiCheckbox, TuiDataListWrapper, TuiPagination, TuiSwitch } from '@taiga-ui/kit';
import { TuiSelectModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { CategoryBadgeComponent } from "../../../../components/category-badge/category-badge.component";
import { CATEGORIES_SERVICE_TOKEN, ITEMS_SERVICE_TOKEN, LIBRARIES_SERVICE_TOKEN } from '../../community.provider';
import { ItemCardComponent } from '../../components/item-card/item-card.component';
import { UICategory } from '../../models/UICategory';
import { UIItemWithRecords } from '../../models/UIItemWithRecords';
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
    RouterLink,
    TuiIcon,
    TuiAppearance,
    TuiButton,
    TuiTitle,
    TuiCheckbox,
    FormsModule,
    TuiTextfield,
    ReactiveFormsModule,
    TuiDataList,
    TuiDataListWrapper,
    TuiSelectModule,
    TuiTextfieldControllerModule,
    CategoryBadgeComponent,
    TuiSwitch,
    TuiPagination,
    TuiAccordion
  ],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {
  totalPages: number = 10;

  goToPage(page: number) {
    this.currentPage = page;
    this.fetchItems(false);
  }

  categories: UICategory[] = [];
  selectedCategories: Set<string> = new Set();
  searchText = '';
  items: UIItemWithRecords[] = [];
  currentlyAvailable: boolean = false;
  libraries: UILibrary[] = [];
  selectedLibraries: { [key: string]: boolean } = {};
  static readonly SORT_RECENTLY_ADDED = 'Recently added';
  static readonly SORT_MOST_BORROWED = 'Most borrowed';
  static readonly SORT_FAVORITES = 'Favorites';
  protected sortingOptions = [
    ItemsComponent.SORT_RECENTLY_ADDED,
    ItemsComponent.SORT_MOST_BORROWED,
    ItemsComponent.SORT_FAVORITES,
  ];
  protected sortControl = new FormControl<string | null>(null);
  currentPage: number = 1;
  itemsPerPage: number = 8; // Adjust this number as needed
  isMobile: boolean = false;

  constructor(
    @Inject(ITEMS_SERVICE_TOKEN) private itemsService: ItemsService,
    @Inject(CATEGORIES_SERVICE_TOKEN) private categoriesService: CategoriesService,
    @Inject(LIBRARIES_SERVICE_TOKEN) private librariesService: LibrariesService,
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });


    this.fetchItems(false);
    this.categoriesService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
    this.librariesService.getLibraries().subscribe(libraries => {
      this.libraries = libraries;
    });

    this.sortControl.valueChanges.subscribe(() => {
      this.resetItems();
    });
  }

  fetchItems(append: boolean) {
    this.itemsService.getItemsWithRecords(
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
    ).subscribe(items => {
      if (append) {
        this.items = [...this.items, ...items];
      } else {
        this.items = items;
      }
    });
  }


  resetItems() {
    this.currentPage = 1;
    this.fetchItems(false);
  }

  getSortBy(): string | undefined {
    switch (this.sortControl.value) {
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

  toggleLibrarySelection(library: UILibrary) {
    if (this.selectedLibraries[library.id]) {
      delete this.selectedLibraries[library.id];
    } else {
      this.selectedLibraries[library.id] = true;
    }
    this.resetItems();
  }

  markAsFavorite(item: UIItemWithRecords) {
    this.itemsService.markAsFavorite(item).subscribe();
  }

  isCategorySelected(category: UICategory): boolean {
    return this.selectedCategories.has(category.name);
  }

  getLibrary(libraryId: string): UILibrary | undefined {
    return this.libraries.find(library => library.id === libraryId);
  }
}