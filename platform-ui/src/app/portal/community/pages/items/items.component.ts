import { Component, Inject } from '@angular/core';
import { TuiAppearance } from '@taiga-ui/core/directives/appearance';
import { TuiAvatar } from '@taiga-ui/kit';
import { TuiCardLarge } from '@taiga-ui/layout/components/card';
import { TuiHeader } from '@taiga-ui/layout/components/header';
import { TuiHint, TuiIcon, TuiTextfield } from "@taiga-ui/core";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  TuiButton,
  TuiTitle,
} from '@taiga-ui/core';
import { UIItem, ItemsService, ItemWithRecords } from '../../services/items.service';
import { CategoriesService, UICategory } from '../../services/categories.service';
import { communityProviders, ITEMS_SERVICE_TOKEN, CATEGORIES_SERVICE_TOKEN } from '../../community.provider';

@Component({
  standalone: true,
  selector: 'app-items',
  imports: [
    TuiHint,
    RouterLink,
    TuiIcon,
    CommonModule,
    TuiAppearance,
    TuiCardLarge,
    TuiButton,
    TuiCardLarge,
    TuiTitle,
    FormsModule,
    TuiTextfield
  ],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
  providers: [
    ...communityProviders,
  ]
})
export class ItemsComponent {

  // Categories for the filter
  categories: UICategory[] = [];
  // Selected categories
  selectedCategories: Set<string> = new Set();
  // Text input for search filtering
  searchText = '';
  items: ItemWithRecords[] = [];

  constructor(
    @Inject(ITEMS_SERVICE_TOKEN) private itemsService: ItemsService, 
    @Inject(CATEGORIES_SERVICE_TOKEN) private categoriesService: CategoriesService
  ) { }

  ngOnInit() {
    // Fetch the items from the service
    this.itemsService.getItemsWithRecords().subscribe(items => {
      this.items = items;
    });
    this.categoriesService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  // Filtered items for the grid
  get filteredItems() {
    return this.items.filter(item => {
      const categoryMatch = this.selectedCategories.size === 0 || this.selectedCategories.has(item.category.name);
      const textMatch = item.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.description.toLowerCase().includes(this.searchText.toLowerCase());
      return categoryMatch && textMatch;
    });
  }

  // Handle category checkbox changes
  onCategoryChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedCategories.add(checkbox.value);
    } else {
      this.selectedCategories.delete(checkbox.value);
    }
  }

  // Handle text filter change
  onTextFilterChange() {
    // The filtering is handled in the getter `filteredItems`
  }

  markAsFavorite(item: UIItem) {
    this.itemsService.markAsFavorite(item);
  }
}