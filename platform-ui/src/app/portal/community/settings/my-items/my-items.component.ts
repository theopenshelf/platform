import { NgForOf, NgIf, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiTitle } from '@taiga-ui/core';
import { Category, ItemsService } from '../../services/items.service';

@Component({
    standalone: true,
    selector: 'app-my-items',
    imports: [FormsModule, NgForOf, NgClass, TuiTable],
    templateUrl: './my-items.component.html',
    styleUrls: ['./my-items.component.css']
})
export class MyItemsComponent {
    protected readonly sizes = ['l', 'm', 's'] as const;
    protected size = this.sizes[0];

    // Sorting State
    protected sortColumn: string = 'name';
    protected sortDirection: 'asc' | 'desc' = 'asc';

    // Filters
    protected categoryFilter = '';

    categories: Category[] = [];

    constructor(private itemsService: ItemsService) { }

    ngOnInit() {
        // Fetch categories from the service
        this.categories = this.itemsService.getCaterogies();
    }

    // Get filtered and sorted data
    protected get filteredAndSortedData() {
        let result = this.itemsService.getMyOwnedItems();

        // Filter by category
        result = result.filter((item) => {
            return !this.categoryFilter || item.category === this.categoryFilter;
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