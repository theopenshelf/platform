import { Component } from '@angular/core';
import { TuiRepeatTimes } from '@taiga-ui/cdk/directives/repeat-times';
import { TuiAppearance } from '@taiga-ui/core/directives/appearance';
import { TuiAvatar } from '@taiga-ui/kit';
import { TuiCardLarge } from '@taiga-ui/layout/components/card';
import { TuiHeader } from '@taiga-ui/layout/components/header';
import { TuiRoot } from "@taiga-ui/core";
import { RouterOutlet } from '@angular/router';
import {CommonModule, KeyValuePipe, NgForOf} from '@angular/common';
import {ChangeDetectionStrategy} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {tuiAsPortal, TuiPlatform, TuiPortals} from '@taiga-ui/cdk';
import {
    TuiButton,
    TuiDataList,
    TuiDropdown,
    TuiDropdownService,
    TuiIcon,
    TuiTitle,
} from '@taiga-ui/core';
import {
    TuiBadge,
    TuiBadgeNotification,
    TuiChevron,
    TuiDataListDropdownManager,
    TuiFade,
    TuiSwitch,
    TuiTabs,
} from '@taiga-ui/kit';
import { TuiNavigation} from '@taiga-ui/layout';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [
    CommonModule,
    TuiRepeatTimes,
    TuiAppearance,
    TuiCardLarge,
    TuiAvatar,

    TuiButton,
    TuiCardLarge,
    TuiHeader,
    TuiTitle,
    TuiPlatform
  ],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css'
})
export class ItemsComponent {

    // Categories for the filter
    categories = [
      { value: 'books', label: 'Books' },
      { value: 'electronics', label: 'Electronics' },
      { value: 'clothing', label: 'Clothing' },
    ];
  
    // Items in the grid
    items = [
        { name: 'Harry Potter Book', description: 'A magical adventure story', category: 'books' },
        { name: 'Laptop XYZ', description: 'High-performance laptop for work and play', category: 'electronics' },
        { name: 'Cotton T-Shirt', description: 'Comfortable cotton T-shirt', category: 'clothing' },
        { name: 'Wireless Mouse', description: 'Ergonomic wireless mouse for productivity', category: 'electronics' },
        { name: 'Blue Jeans', description: 'Stylish denim jeans', category: 'clothing' },
        { name: 'Smartphone Pro', description: 'Latest model with amazing features', category: 'electronics' },
        { name: 'The Great Gatsby', description: 'A novel set in the Jazz Age', category: 'books' },
        { name: 'Gaming Chair', description: 'Comfortable chair for long gaming sessions', category: 'electronics' },
        { name: 'Leather Wallet', description: 'A sleek leather wallet', category: 'clothing' },
        { name: 'LED Desk Lamp', description: 'Adjustable LED desk lamp', category: 'electronics' },
        { name: 'Winter Jacket', description: 'Warm jacket for cold weather', category: 'clothing' },
        { name: 'Cookbook Essentials', description: 'Recipes for home chefs', category: 'books' }
      ];
    // Selected categories
    selectedCategories: Set<string> = new Set();
  
    // Filtered items for the grid
    get filteredItems() {
      if (this.selectedCategories.size === 0) {
        return this.items; // Show all items if no category is selected
      }
      return this.items.filter(item =>
        this.selectedCategories.has(item.category)
      );
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

}
