import { NgForOf, NgIf, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiButton, TuiTitle } from '@taiga-ui/core';
import { ItemsService } from '../../services/items.service';
import { RouterLink } from '@angular/router';
import { CategoriesService, Category } from '../../../admin/services/categories.service';
import { CategoryBadgeComponent } from '../../../../components/category-badge/category-badge.component';

@Component({
  standalone: true, 
    selector: 'app-myborroweditems',
    imports: [RouterLink, FormsModule, NgForOf, NgClass, TuiTable, CategoryBadgeComponent],
    templateUrl: './myborroweditems.component.html',
    styleUrls: ['./myborroweditems.component.scss']
})
export class MyborroweditemsComponent {
  protected readonly sizes = ['l', 'm', 's'] as const;
  protected size = this.sizes[0];

  // Sorting State
  protected sortColumn: string = 'status';
  protected sortDirection: 'asc' | 'desc' = 'asc';

  // Filters
  protected categoryFilter = '';
  protected statusFilter = '';
  
  categories: Category[] = [];

  // Status mapping for sorting
  private statusPriority = {
    'Currently Borrowed': 1,
    'Reserved': 2,
    'Returned': 3,
  };

  constructor(private itemsService: ItemsService, private categoriesService: CategoriesService) { }

  ngOnInit() {
    // Fetch the items from the service
    this.categories = this.categoriesService.getCategories();
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

  // Get filtered and sorted data
  protected get filteredAndSortedData() {
    let result = this.itemsService.getMyBorrowItems();

    // Filter by category and status
    result = result.filter((item) => {
      const status = this.computeStatus(item.record.startDate, item.record.endDate);
      return (
        (!this.categoryFilter || item.category.name === this.categoryFilter) &&
        (!this.statusFilter || status === this.statusFilter)
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

  // Handle column sorting
  protected sort(column: string): void {
    if (this.sortColumn === column) {
      // Toggle sort direction if the same column is clicked
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Set new column and reset to ascending order
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
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

  // Dynamic options for filters
  protected readonly statuses = ['Currently Borrowed', 'Reserved', 'Returned'];
}