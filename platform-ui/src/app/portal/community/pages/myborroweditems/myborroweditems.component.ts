import { CommonModule, NgClass } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiSelectModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { CategoryBadgeComponent } from '../../../../components/category-badge/category-badge.component';
import { CATEGORIES_SERVICE_TOKEN, ITEMS_SERVICE_TOKEN } from '../../community.provider';
import { BorrowItemCardComponent } from '../../components/borrow-item-card/borrow-item-card.component';
import { UIBorrowItem } from '../../models/UIBorrowItem';
import { UICategory } from '../../models/UICategory';
import { CategoriesService } from '../../services/categories.service';
import { ItemsService } from '../../services/items.service';

@Component({
  standalone: true,
  selector: 'app-myborroweditems',
  imports: [
    CommonModule,
    RouterLink,
    TuiTextfieldControllerModule,
    FormsModule,
    NgClass,
    TuiTable,
    CategoryBadgeComponent,
    BorrowItemCardComponent,
    TuiSelectModule,
    TuiTextfield,
    TuiIcon,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './myborroweditems.component.html',
  styleUrls: ['./myborroweditems.component.scss']
})
export class MyborroweditemsComponent {
  protected readonly sizes = ['l', 'm', 's'] as const;
  protected size = this.sizes[0];
  protected searchText = '';

  // Sorting State
  protected sortColumn: string = 'status';
  protected sortDirection: 'asc' | 'desc' = 'asc';

  // Filters
  private categoryFilterSubject = new BehaviorSubject<string>('');
  private statusFilterSubject = new BehaviorSubject<string>('');
  selectedCategories: Set<string> = new Set();

  // Define static readonly variables for sorting options
  static readonly SORT_RECENTLY_RESERVED = 'Recently reserved';
  static readonly SORT_MOST_BORROWED = 'Most borrowed';
  static readonly SORT_FAVORITES = 'Favorites';

  protected sortingOptions = [
    MyborroweditemsComponent.SORT_RECENTLY_RESERVED,
    MyborroweditemsComponent.SORT_MOST_BORROWED,
    MyborroweditemsComponent.SORT_FAVORITES,
  ];

  protected selectedStatuses: Set<string> = new Set();
  protected statuses = [
    { name: 'Reserved', color: '#3498db' }, // Light Blue
    { name: 'Currently Borrowed', color: '#2ecc71' }, // Green
    { name: 'Returned', color: '#95a5a6' } // Gray
  ];

  protected testValue = new FormControl<string | null>(null);

  // Create getters and setters for the filters
  protected get categoryFilter(): string {
    return this.categoryFilterSubject.value;
  }
  protected set categoryFilter(value: string) {
    this.categoryFilterSubject.next(value);
  }

  protected get statusFilter(): string {
    return this.statusFilterSubject.value;
  }
  protected set statusFilter(value: string) {
    this.statusFilterSubject.next(value);
  }

  protected items: UIBorrowItem[] = [];
  categories: UICategory[] = [];

  // Status mapping for sorting
  private statusPriority = {
    'Currently Borrowed': 1,
    'Reserved': 2,
    'Returned': 3,
  };

  constructor(
    @Inject(ITEMS_SERVICE_TOKEN) private itemsService: ItemsService,
    @Inject(CATEGORIES_SERVICE_TOKEN) private categoriesService: CategoriesService
  ) { }

  ngOnInit() {
    this.categoriesService.getCategories().subscribe((categories: UICategory[]) => {
      this.categories = categories;
    });
    this.getFilteredAndSortedData().subscribe((items) => {
      this.items = items;
    });
  }
  onTextFilterChange() {
    // The filtering is handled in the getter `filteredItems`
  }

  // Helper function to calculate item status
  protected computeStatus(borrowedOn: string, dueDate: string): 'Reserved' | 'Currently Borrowed' | 'Returned' {
    const now = new Date();
    const borrowed = new Date(borrowedOn);
    const due = new Date(dueDate);

    if (now < borrowed) {
      return 'Reserved';
    } else if (now >= borrowed && now <= due) {
      return 'Currently Borrowed';
    } else {
      return 'Returned';
    }
  }

  // Format Borrowed On and Due Date dynamically
  protected formatDate(date: string, column: 'startDate' | 'endDate', status: string): string {
    const now = new Date();
    const [day, month, year] = date.split('/'); // Split into parts
    const targetDate = new Date(`${year}-${month}-${day}`);

    // Normalize dates to midnight for consistent day difference calculation
    const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetMidnight = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

    const diffInDays = Math.round((targetMidnight.getTime() - nowMidnight.getTime()) / (1000 * 60 * 60 * 24));

    if (column === 'startDate') {
      // Handle messages for the start date
      if (status === 'Reserved') {
        return diffInDays === 0 ? `Reserved today` : `Reserved in ${Math.abs(diffInDays)} day(s)`;
      } else if (status === 'Currently Borrowed') {
        if (diffInDays === 0) {
          return `Borrowed today`;
        } else if (diffInDays > 0) {
          return `Will be borrowed in ${diffInDays} day(s)`; // Future borrow start
        } else {
          return `Borrowed ${Math.abs(diffInDays)} day(s) ago`; // Past borrow start
        }
      } else {
        return `Returned on ${targetDate.toLocaleDateString()}`;
      }
    } else if (column === 'endDate') {
      // Handle messages for the end date
      if (status === 'Reserved') {
        if (diffInDays === 0) {
          return `Ends today`;
        } else if (diffInDays > 0) {
          return `Ends in ${diffInDays} day(s)`; // Future reservation end
        } else {
          return `Ended ${Math.abs(diffInDays)} day(s) ago`; // Past reservation end
        }
      } else if (status === 'Currently Borrowed') {
        if (diffInDays === 0) {
          return `Due today`;
        } else if (diffInDays > 0) {
          return `Due in ${diffInDays} day(s)`; // Future due date
        } else {
          return `Overdue by ${Math.abs(diffInDays)} day(s)`; // Past due date
        }
      } else {
        return `Ended on ${targetDate.toLocaleDateString()}`;
      }
    } else {
      // Default case: just return the date
      return targetDate.toLocaleDateString();
    }
  }

  // Update getFilteredAndSortedData to use combineLatest
  private getFilteredAndSortedData(): Observable<UIBorrowItem[]> {
    return combineLatest([
      this.itemsService.getMyBorrowItems(),
      this.categoryFilterSubject,
      this.statusFilterSubject
    ]).pipe(
      map(([items, categoryFilter, statusFilter]) => {
        let result = items.filter((item: UIBorrowItem) => {
          const status = this.computeStatus(item.record.startDate, item.record.endDate);
          return (
            (!categoryFilter || item.category.name === categoryFilter) &&
            (!statusFilter || status === statusFilter)
          );
        });

        // Sort by the selected column
        if (this.sortColumn) {
          result = [...result].sort((a, b) => {
            const aValue = this.getSortableValue(a, this.sortColumn!);
            const bValue = this.getSortableValue(b, this.sortColumn!);

            if (this.sortDirection === 'asc') {
              return aValue > bValue ? 1 : -1;
            } else {
              return aValue < bValue ? 1 : -1;
            }
          });
        }

        return result;
      })
    );
  }

  // Get sortable value for a column
  private getSortableValue(item: any, column: string): any {
    switch (column) {
      case 'startDate':
      case 'endDate':
        return new Date(item["record"][column]); // Sort by actual date
      case 'status':
        const status = this.computeStatus(item.record.startDate, item.record.endDate);
        return this.statusPriority[status]; // Sort by status priority
      default:
        return item[column]; // Default sorting
    }
  }

  // Update sort method to refresh the Observable
  protected sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.getFilteredAndSortedData().subscribe((items) => {
      this.items = items;
    });
  }

  protected getSortIndicator(column: string): string {
    if (this.sortColumn === column) {
      return this.sortDirection === 'asc' ? '↑' : '↓';
    }
    return '';
  }

  protected getBadgeClass(status: 'Reserved' | 'Currently Borrowed' | 'Returned'): string {
    switch (status) {
      case 'Reserved':
        return 'badge badge-reserved';
      case 'Currently Borrowed':
        return 'badge badge-borrowed';
      case 'Returned':
        return 'badge badge-returned';
      default:
        return '';
    }
  }

  protected getCategoryBadgeClass(category: string): string {
    switch (category) {
      case 'books':
        return 'badge badge-books';
      case 'electronics':
        return 'badge badge-electronics';
      case 'clothing':
        return 'badge badge-clothing';
      default:
        return '';
    }
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
  toggleStatusSelection(status: string) {
    if (this.selectedStatuses.has(status)) {
      this.selectedStatuses.delete(status);
    } else {
      this.selectedStatuses.add(status);
    }
  }

  isStatusSelected(status: string): boolean {
    return this.selectedStatuses.has(status);
  }
}
