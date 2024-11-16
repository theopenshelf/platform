import { NgForOf, NgIf, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiButton, TuiTitle } from '@taiga-ui/core';

@Component({
    standalone: true,
    selector: 'app-myborroweditems',
    imports: [FormsModule, NgForOf, NgIf, NgClass, TuiButton, TuiTable, TuiTitle],
    templateUrl: './myborroweditems.component.html',
    styleUrls: ['./myborroweditems.component.css'],
})
export class MyborroweditemsComponent {
  protected readonly sizes = ['l', 'm', 's'] as const;
  protected size = this.sizes[0];

  // Items in the grid
  protected data = [
    { name: 'Harry Potter Book', description: 'A magical adventure story', category: 'books', borrowedOn: '2024-11-01', dueDate: '2024-11-10' },
    { name: 'Laptop XYZ', description: 'High-performance laptop for work and play', category: 'electronics', borrowedOn: '2024-11-15', dueDate: '2024-11-25' },
    { name: 'Cotton T-Shirt', description: 'Comfortable cotton T-shirt', category: 'clothing', borrowedOn: '2024-11-20', dueDate: '2024-11-30' },
    { name: 'Wireless Mouse', description: 'Ergonomic wireless mouse for productivity', category: 'electronics', borrowedOn: '2024-10-28', dueDate: '2024-11-18' },
    { name: 'Blue Jeans', description: 'Stylish denim jeans', category: 'clothing', borrowedOn: '2024-11-25', dueDate: '2024-12-05' },
    { name: 'Smartphone Pro', description: 'Latest model with amazing features', category: 'electronics', borrowedOn: '2024-10-20', dueDate: '2024-10-30' },
    { name: 'The Great Gatsby', description: 'A novel set in the Jazz Age', category: 'books', borrowedOn: '2024-11-28', dueDate: '2024-12-15' },
    { name: 'Gaming Chair', description: 'Comfortable chair for long gaming sessions', category: 'electronics', borrowedOn: '2024-10-22', dueDate: '2024-11-22' },
  ];

  // Sorting State
  protected sortColumn: string = 'status';
  protected sortDirection: 'asc' | 'desc' = 'asc';

  // Filters
  protected categoryFilter = '';
  protected statusFilter = '';

  // Status mapping for sorting
  private statusPriority = {
    'Currently Borrowed': 1,
    'Reserved': 2,
    'Returned': 3,
  };

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
  protected formatDate(date: string, status: string): string {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInDays = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (status === 'Reserved') {
      return `in ${diffInDays} days`;
    } else if (status === 'Currently Borrowed') {
      return `due in ${diffInDays} days`;
    } else {
      return targetDate.toLocaleDateString(); // Default exact date for Returned
    }
  }

  // Get filtered and sorted data
  protected get filteredAndSortedData() {
    let result = this.data;

    // Filter by category and status
    result = result.filter((item) => {
      const status = this.computeStatus(item.borrowedOn, item.dueDate);
      return (
        (!this.categoryFilter || item.category === this.categoryFilter) &&
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
      case 'borrowedOn':
      case 'dueDate':
        return new Date(item[column]); // Sort by actual date
      case 'status':
        const status = this.computeStatus(item.borrowedOn, item.dueDate);
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
  protected readonly categories = ['books', 'electronics', 'clothing'];
  protected readonly statuses = ['Currently Borrowed', 'Reserved', 'Returned'];
}