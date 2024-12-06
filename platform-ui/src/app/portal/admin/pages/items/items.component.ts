import {NgForOf, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TuiTable} from '@taiga-ui/addon-table';
import {
    TuiAutoColorPipe,
    TuiButton,
    TuiDropdown,
    TuiIcon,
    TuiInitialsPipe,
    TuiLink,
    TuiTitle,
} from '@taiga-ui/core';
import {
    TuiAvatar,
    TuiBadge,
    TuiCheckbox,
    TuiChip,
    TuiItemsWithMore,
    TuiProgressBar,
    TuiRadioList,
    TuiStatus,
} from '@taiga-ui/kit';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {TuiCell} from '@taiga-ui/layout';
import { Item, ItemsService } from '../../services/items.service';
import { CategoryBadgeComponent } from '../../../../components/category-badge/category-badge.component';
import { adminProviders, ITEMS_SERVICE_TOKEN } from '../../admin.providers';

@Component({
    standalone: true, 
    imports: [
        CategoryBadgeComponent,
        RouterModule,
        CommonModule,
        FormsModule,
        NgForOf,
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
    ],
    selector: 'app-items',
    templateUrl: './items.component.html',
    styleUrls: ['./items.component.scss'],
    providers: [
        ...adminProviders
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemsComponent {
    protected readonly size = 'm'; // Default table size

    items: Item[] = [];

    public constructor(
        @Inject(ITEMS_SERVICE_TOKEN) private itemsService: ItemsService
    ) {
    }

    ngOnInit() {
        // Fetch the items from the service
        this.items = this.itemsService.getItems();
    }
}