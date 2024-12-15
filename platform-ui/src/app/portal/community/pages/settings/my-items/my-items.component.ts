import { NgClass, NgForOf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiTable } from '@taiga-ui/addon-table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CategoryBadgeComponent } from '../../../../../components/category-badge/category-badge.component';
import { CATEGORIES_SERVICE_TOKEN, communityProviders, ITEMS_SERVICE_TOKEN } from '../../../community.provider';
import { UICategory } from '../../../models/UICategory';
import { CategoriesService } from '../../../services/categories.service';
import { ItemsService } from '../../../services/items.service';

@Component({
    standalone: true,
    selector: 'app-my-items',
    imports: [
        FormsModule,
        NgForOf,
        NgClass,
        TuiTable,
        CategoryBadgeComponent
    ],
    templateUrl: './my-items.component.html',
    styleUrls: ['./my-items.component.scss'],
    providers: [
        ...communityProviders,
    ]
})
export class MyItemsComponent {
    protected readonly sizes = ['l', 'm', 's'] as const;
    protected size = this.sizes[0];

    // Sorting State
    protected sortColumn: string = 'name';
    protected sortDirection: 'asc' | 'desc' = 'asc';

    // Filters
    protected categoryFilter = '';

    categories: UICategory[] = [];
    protected items: any[] = [];

    private destroy$ = new Subject<void>();

    constructor(
        @Inject(ITEMS_SERVICE_TOKEN) private itemsService: ItemsService,
        @Inject(CATEGORIES_SERVICE_TOKEN) private categoriesService: CategoriesService
    ) { }

    ngOnInit() {
        // Fetch categories from the service
        this.categoriesService.getCategories().pipe(
            takeUntil(this.destroy$)
        ).subscribe((categories) => {
            this.categories = categories;
        });

        // Add subscription to items
        this.itemsService.getMyOwnedItems().pipe(
            takeUntil(this.destroy$)
        ).subscribe(items => {
            this.items = items;
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    // Get filtered and sorted data
    protected get filteredAndSortedData() {
        let result = [...this.items];

        // Filter by category
        result = result.filter((item) => {
            return !this.categoryFilter || item.category.name === this.categoryFilter;
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
        return item[column];
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
}