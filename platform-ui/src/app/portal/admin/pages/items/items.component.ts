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
    columns = [
        { key: 'img', label: 'Image', custom: true, visible: true, sortable: false },
        { key: 'name', label: 'Name', custom: false, visible: true, sortable: true },
        { key: 'located', label: 'Located', custom: false, visible: true, sortable: true },
        { key: 'owner', label: 'Owner', custom: false, visible: true, sortable: true },
        { key: 'imageUrl', label: 'Image URL', custom: false, visible: false, sortable: false },
        { key: 'description', label: 'Description', custom: false, visible: false, sortable: false },
        { key: 'shortDescription', label: 'Short Description', custom: false, visible: false, sortable: false },
        { key: 'category', label: 'Category', custom: true, visible: true, sortable: true },
        { key: 'favorite', label: 'Favorite', custom: false, visible: false, sortable: false },
        { key: 'borrowCount', label: 'Borrow Count', custom: false, visible: true, sortable: true },
        { key: 'lateReturnPercentage', label: 'Late Return %', custom: false, visible: true, sortable: true },
        { key: 'averageDuration', label: 'Avg Duration', custom: false, visible: true, sortable: true },
        { key: 'state', label: 'State', custom: true, visible: true, sortable: true },
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