import { Component } from '@angular/core';
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
import { Item, ItemsService, ItemWithRecords } from '../../services/items.service';
import { CategoriesService, Category } from '../../../admin/services/categories.service';

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
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent {

  // Categories for the filter
  categories: Category[] = [];
  // Selected categories
  selectedCategories: Set<string> = new Set();
  // Text input for search filtering
  searchText = '';
  items: ItemWithRecords[] = [];

  constructor(private itemsService: ItemsService, private categoriesService: CategoriesService) { }

  ngOnInit() {
    // Fetch the items from the service
    this.items = this.itemsService.getItemsWithRecords();
    this.categories = this.categoriesService.getCategories();
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

  markAsFavorite(item: Item) {
    this.itemsService.markAsFavorite(item);
  }
}