import { Component, Inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiDataList, TuiHint, TuiIcon, TuiTextfield, TuiTitle } from "@taiga-ui/core";
import { TuiAppearance } from '@taiga-ui/core/directives/appearance';
import { TuiCheckbox, TuiDataListWrapper, TuiSwitch } from '@taiga-ui/kit';
import { CATEGORIES_SERVICE_TOKEN, ITEMS_SERVICE_TOKEN, LIBRARIES_SERVICE_TOKEN } from '../../community.provider';
import { ItemCardComponent } from '../../components/item-card/item-card.component';
import { UICategory } from '../../models/UICategory';
import { UIItem } from '../../models/UIItem';
import { UIItemWithRecords } from '../../models/UIItemWithRecords';
import { CategoriesService } from '../../services/categories.service';
import { ItemsService } from '../../services/items.service';

import { TuiSelectModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { CategoryBadgeComponent } from "../../../../components/category-badge/category-badge.component";
import { UILibrary } from '../../models/UILibrary';
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
    TuiSwitch
  ],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent {


  // Categories for the filter
  categories: UICategory[] = [];
  // Selected categories
  selectedCategories: Set<string> = new Set();
  // Text input for search filtering
  searchText = '';
  items: UIItemWithRecords[] = [];
  currentlyAvailable: boolean = false;
  libraries: UILibrary[] = [];

  // Selected libraries
  selectedLibraries: { [key: string]: boolean } = {};

  // Define static readonly variables for sorting options
  static readonly SORT_RECENTLY_ADDED = 'Recently added';
  static readonly SORT_MOST_BORROWED = 'Most borrowed';
  static readonly SORT_FAVORITES = 'Favorites';

  protected sortingOptions = [
    ItemsComponent.SORT_RECENTLY_ADDED,
    ItemsComponent.SORT_MOST_BORROWED,
    ItemsComponent.SORT_FAVORITES,
  ];

  protected testValue = new FormControl<string | null>(null);

  constructor(
    @Inject(ITEMS_SERVICE_TOKEN) private itemsService: ItemsService,
    @Inject(CATEGORIES_SERVICE_TOKEN) private categoriesService: CategoriesService,
    @Inject(LIBRARIES_SERVICE_TOKEN) private librariesService: LibrariesService
  ) { }

  ngOnInit() {
    // Fetch the items from the service
    this.itemsService.getItemsWithRecords().subscribe(items => {
      this.items = items;
    });
    this.categoriesService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
    this.librariesService.getLibraries().subscribe(libraries => {
      this.libraries = libraries;
    });
  }
  getLibrary(libraryId: string): UILibrary | undefined {
    return this.libraries.find(library => library.id === libraryId);
  }

  // Filtered items for the grid
  get filteredItems() {
    return this.items.filter(item => {
      const categoryMatch = this.selectedCategories.size === 0 || this.selectedCategories.has(item.category.name);
      const textMatch = item.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.description.toLowerCase().includes(this.searchText.toLowerCase());
      const availabilityMatch = !this.currentlyAvailable || !item.isBookedToday;
      const libraryMatch = Object.keys(this.selectedLibraries).length === 0 || this.selectedLibraries[item.libraryId];
      return categoryMatch && textMatch && availabilityMatch && libraryMatch;
    });
  }

  get filteredAndSortedItems() {
    const filtered = this.items.filter(item => {
      const categoryMatch = this.selectedCategories.size === 0 || this.selectedCategories.has(item.category.name);
      const textMatch = item.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.description.toLowerCase().includes(this.searchText.toLowerCase());
      const availabilityMatch = !this.currentlyAvailable || !item.isBookedToday;
      const libraryMatch = Object.keys(this.selectedLibraries).length === 0 || this.selectedLibraries[item.libraryId];
      return categoryMatch && textMatch && availabilityMatch && libraryMatch;
    });

    return filtered.sort((a, b) => {
      switch (this.testValue.value) {
        case ItemsComponent.SORT_RECENTLY_ADDED:
          return b.createdAt.getTime() - a.createdAt.getTime();
        case ItemsComponent.SORT_MOST_BORROWED:
          return (b.borrowCount || 0) - (a.borrowCount || 0);
        case ItemsComponent.SORT_FAVORITES:
          return (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0);
        default:
          return 0;
      }
    });
  }

  // Handle text filter change
  onTextFilterChange() {
    // The filtering is handled in the getter `filteredItems`
  }

  markAsFavorite(item: UIItem) {
    this.itemsService.markAsFavorite(item);
  }

  toggleCategorySelection(category: UICategory) {
    if (this.selectedCategories.has(category.name)) {
      this.selectedCategories.delete(category.name);
    } else {
      this.selectedCategories.add(category.name);
    }
  }

  isCategorySelected(category: any): boolean {
    // Implement your logic to determine if the category is selected
    return this.selectedCategories.has(category.name);
  }

  toggleLibrarySelection(library: UILibrary) {
    if (this.selectedLibraries[library.id]) {
      delete this.selectedLibraries[library.id];
    } else {
      this.selectedLibraries[library.id] = true;
    }
  }
}