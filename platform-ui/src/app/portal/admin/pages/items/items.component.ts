
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TuiTable, TuiTablePagination, TuiTablePaginationEvent } from '@taiga-ui/addon-table';
import {
    TuiButton,
    TuiDropdown,
    TuiIcon,
    TuiLink,
    TuiTitle
} from '@taiga-ui/core';
import {
    TuiAvatar,
    TuiBadge,
    TuiItemsWithMore,
    TuiStatus
} from '@taiga-ui/kit';

import { TuiCell } from '@taiga-ui/layout';
import { CategoryBadgeComponent } from '../../../../components/category-badge/category-badge.component';
import { ITEMS_SERVICE_TOKEN } from '../../admin.providers';
import { TosTableComponent } from '../../components/tos-table/tos-table.component';
import { ItemsService, UIItem } from '../../services/items.service';

@Component({
    standalone: true,
    imports: [
        CategoryBadgeComponent,
        RouterModule,
        FormsModule,
        TuiAvatar,
        TuiBadge,
        TuiCell,
        TuiDropdown,
        TuiItemsWithMore,
        TuiLink,
        TuiStatus,
        TuiTable,
        TuiTitle,
        TuiButton,
        TuiIcon,
        TosTableComponent,
        TuiTablePagination,

    ],
    selector: 'app-items',
    templateUrl: './items.component.html',
    styleUrls: ['./items.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemsComponent {
    items: UIItem[] = [];
    protected page = 0;
    protected size = 10;
    protected totalItems = 0;

    public constructor(
        @Inject(ITEMS_SERVICE_TOKEN) private itemsService: ItemsService
    ) {
    }

    ngOnInit() {
        // Fetch the items from the service
        this.itemsService.getItems().subscribe(items => {
            this.items = items
            this.totalItems = items.length;
        });
    }

    protected onPagination({ page, size }: TuiTablePaginationEvent): void {
        this.page = page;
        this.size = size;
    }
}