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
    standalone: true,
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
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
    protected readonly size = 'm'; // Default table size

    protected readonly users = [
        {
            username: 'johndoe',
            email: 'johndoe@example.com',
            flatNumber: '12A',
            address: '123 Main St, Cityville',
            borrowedItems: 5,
            returnedLate: 1,
            successRate: 80,
            satisfactionRate: 95,
        },
        {
            username: 'janedoe',
            email: 'janedoe@example.com',
            flatNumber: '3B',
            address: '456 Elm St, Townsville',
            borrowedItems: 10,
            returnedLate: 0,
            successRate: 100,
            satisfactionRate: 98,
        },
    ];
}