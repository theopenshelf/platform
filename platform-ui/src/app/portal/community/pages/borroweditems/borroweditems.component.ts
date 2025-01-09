import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiAccordion, TuiPagination } from '@taiga-ui/kit';
import { TuiSelectModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { BehaviorSubject } from 'rxjs';
import { CATEGORIES_SERVICE_TOKEN, ITEMS_SERVICE_TOKEN, LIBRARIES_SERVICE_TOKEN } from '../../community.provider';
import { BorrowItemCardComponent } from '../../components/borrow-item-card/borrow-item-card.component';
import { UICategory } from '../../models/UICategory';
import { UIItem } from '../../models/UIItem';
import { UILibrary } from '../../models/UILibrary';
import { CategoriesService } from '../../services/categories.service';
import { ItemsService } from '../../services/items.service';
import { LibrariesService } from '../../services/libraries.service';

@Component({
  standalone: true,
  selector: 'app-myborroweditems',
  imports: [
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
    BorrowItemCardComponent
  ],
  templateUrl: './borroweditems.component.html',
  styleUrls: ['./borroweditems.component.scss']
})
export class BorrowedItemsComponent implements OnInit {

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
    BorrowedItemsComponent.SORT_RECENTLY_RESERVED,
    BorrowedItemsComponent.SORT_MOST_BORROWED,
    BorrowedItemsComponent.SORT_FAVORITES,
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

  protected items: UIItem[] = [];
  categories: UICategory[] = [];
  libraries: UILibrary[] = [];

  // Status mapping for sorting
  private statusPriority = {
    'Currently Borrowed': 1,
    'Reserved': 2,
    'Returned': 3,
  };

  isMobile: boolean = false;

  currentPage: number = 0;
  totalPages: number = 1;
  itemsPerPage: number = 8; // Adjust this number as needed

  constructor(
    @Inject(ITEMS_SERVICE_TOKEN) private itemsService: ItemsService,
    @Inject(CATEGORIES_SERVICE_TOKEN) private categoriesService: CategoriesService,
    @Inject(LIBRARIES_SERVICE_TOKEN) private librariesService: LibrariesService,
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit() {
    this.categoriesService.getCategories().subscribe((categories: UICategory[]) => {
      this.categories = categories;
    });
    this.itemsService.getItems(
      undefined,
      true,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      this.currentPage,
      this.itemsPerPage
    ).subscribe((itemsPagination) => {
      this.totalPages = itemsPagination.totalPages;
      this.currentPage = itemsPagination.currentPage;
      this.itemsPerPage = itemsPagination.itemsPerPage;
      this.items = itemsPagination.items;
    });
    this.librariesService.getLibraries().subscribe(libraries => {
      this.libraries = libraries;
    });

    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }

  getLibrary(libraryId: string): UILibrary | undefined {
    return this.libraries.find(library => library.id === libraryId);
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

    this.itemsService.getItems(
      undefined,
      true,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      this.currentPage,
      this.itemsPerPage
    ).subscribe((itemsPagination) => {
      this.totalPages = itemsPagination.totalPages;
      this.currentPage = itemsPagination.currentPage;
      this.itemsPerPage = itemsPagination.itemsPerPage;
      this.items = itemsPagination.items;
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

  goToPage(page: number) {
    this.currentPage = page;
    this.itemsService.getItems(
      undefined,
      true,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      this.currentPage,
      this.itemsPerPage
    ).subscribe((itemsPagination) => {
      this.totalPages = itemsPagination.totalPages;
      this.currentPage = itemsPagination.currentPage;
      this.itemsPerPage = itemsPagination.itemsPerPage;
      this.items = itemsPagination.items;
    });
  }
}
