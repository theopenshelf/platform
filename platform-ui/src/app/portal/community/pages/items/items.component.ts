import { Component } from '@angular/core';
import { TuiAppearance } from '@taiga-ui/core/directives/appearance';
import { TuiAvatar } from '@taiga-ui/kit';
import { TuiCardLarge } from '@taiga-ui/layout/components/card';
import { TuiHeader } from '@taiga-ui/layout/components/header';
import { TuiTextfield } from "@taiga-ui/core";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  TuiButton,
  TuiTitle,
} from '@taiga-ui/core';
import { Category, Item, ItemsService } from '../../services/items.service';

@Component({
  standalone: true,
  selector: 'app-items',
  imports: [
    RouterLink,
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
  styleUrls: ['./items.component.css']
})
export class ItemsComponent {

  // Categories for the filter
  categories: Category[] = [];
  // Selected categories
  selectedCategories: Set<string> = new Set();
  // Text input for search filtering
  searchText = '';
  items: Item[] = [];

  constructor(private itemsService: ItemsService) { }

  ngOnInit() {
    // Fetch the items from the service
    this.items = this.itemsService.getItems();
    this.categories = this.itemsService.getCaterogies();
  }

  // Filtered items for the grid
  get filteredItems() {
    return this.items.filter(item => {
      const categoryMatch = this.selectedCategories.size === 0 || this.selectedCategories.has(item.category);
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
}