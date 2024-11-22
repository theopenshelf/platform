import {NgForOf, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
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

@Component({
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        NgForOf,
        NgIf,
        TuiAutoColorPipe,
        TuiAvatar,
        TuiBadge,
        TuiButton,
        TuiCell,
        TuiCheckbox,
        TuiChip,
        TuiDropdown,
        TuiIcon,
        TuiInitialsPipe,
        TuiItemsWithMore,
        TuiLink,
        TuiProgressBar,
        TuiRadioList,
        TuiStatus,
        TuiTable,
        TuiTitle,
    ],
    selector: 'app-items',
    templateUrl: './items.component.html',
    styleUrls: ['./items.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemsComponent {
    protected readonly size = 'm'; // Default table size

    protected readonly items = [
        {
            id: 1,
            name: 'Harry Potter and the Philosopher\'s Stone',
            picture: 'assets/images/harry-potter.jpg',
            categories: ['Books', 'Fantasy'],
            borrows: 120,
            lateReturnPercentage: 5,
            averageDuration: 14,
            state: { label: 'Available', statusColor: 'positive' },
        },
        {
            id: 2,
            name: 'The Great Gatsby',
            picture: 'assets/images/great-gatsby.jpg',
            categories: ['Books', 'Classics'],
            borrows: 85,
            lateReturnPercentage: 10,
            averageDuration: 12,
            state: { label: 'Checked Out', statusColor: 'warning' },
        },
        {
            id: 3,
            name: 'MacBook Pro 16"',
            picture: 'assets/images/macbook-pro.jpg',
            categories: ['Electronics'],
            borrows: 15,
            lateReturnPercentage: 0,
            averageDuration: 30,
            state: { label: 'Under Maintenance', statusColor: 'negative' },
        },
    ];
}