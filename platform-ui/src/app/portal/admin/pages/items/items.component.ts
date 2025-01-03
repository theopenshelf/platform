import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TuiTable, TuiTablePagination } from '@taiga-ui/addon-table';
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
import { Column, TosTableComponent } from '../../components/tos-table/tos-table.component';
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
    columns: Column[] = [
        { key: 'img', label: 'Image', custom: true, visible: true, sortable: false, size: 's' },
        { key: 'name', label: 'Name', custom: false, visible: true, sortable: true, size: 'l' },
        { key: 'located', label: 'Located', custom: false, visible: true, sortable: true, size: 'm' },
        { key: 'owner', label: 'Owner', custom: false, visible: true, sortable: true, size: 'm' },
        { key: 'imageUrl', label: 'Image URL', custom: false, visible: false, sortable: false, size: 'm' },
        { key: 'description', label: 'Description', custom: false, visible: false, sortable: false, size: 'l' },
        { key: 'shortDescription', label: 'Short Description', custom: false, visible: false, sortable: false, size: 'l' },
        { key: 'category', label: 'Category', custom: true, visible: true, sortable: true, size: 'm' },
        { key: 'favorite', label: 'Favorite', custom: false, visible: false, sortable: false, size: 's' },
        { key: 'borrowCount', label: 'Borrow Count', custom: false, visible: true, sortable: true, size: 's' },
        { key: 'lateReturnPercentage', label: 'Late Return %', custom: false, visible: true, sortable: true, size: 's' },
        { key: 'averageDuration', label: 'Avg Duration', custom: false, visible: true, sortable: true, size: 's' },
        { key: 'state', label: 'State', custom: true, visible: true, sortable: true, size: 's' },
    ];


    public constructor(
        @Inject(ITEMS_SERVICE_TOKEN) private itemsService: ItemsService
    ) {
    }

    ngOnInit() {
        // Fetch the items from the service
        this.itemsService.getItems().subscribe(items => {
            this.items = items
        });
    }
}