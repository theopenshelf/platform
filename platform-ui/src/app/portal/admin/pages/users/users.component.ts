import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiTable } from '@taiga-ui/addon-table';
import {
    TuiAutoColorPipe,
    TuiButton,
    TuiDialog,
    TuiDropdown,
    TuiIcon,
    TuiInitialsPipe,
    TuiLink,
    TuiTitle,
} from '@taiga-ui/core';
import { NgForOf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TuiAvatar, TuiCheckbox, TuiConfirmData } from '@taiga-ui/kit';
import {TuiResponsiveDialogService} from '@taiga-ui/addon-mobile';
import {TuiAlertService} from '@taiga-ui/core';
import {TUI_CONFIRM} from '@taiga-ui/kit';
import {switchMap} from 'rxjs';
import { User, UsersService } from '../../services/users.service';
import {TuiAutoFocus} from '@taiga-ui/cdk';
import { TuiHint} from '@taiga-ui/core';
import {TuiInputModule} from '@taiga-ui/legacy';
import { adminProviders, USERS_SERVICE_TOKEN } from '../../admin.providers';
 

export type User1 = {
    id: string;
    username: string;
    email: string;
    flatNumber: string;
    address: string;
    borrowedItems: number;
    returnedLate: number;
    successRate: number;
} & Record<string, any>;

@Component({
    standalone: true,
    imports: [
        TuiAutoFocus,
        TuiButton,
        TuiDialog,
        TuiHint,
        TuiInputModule,
        ReactiveFormsModule,

        TuiCheckbox,
        TuiDialog,
        TuiButton,
        TuiAutoColorPipe,
        TuiInitialsPipe,
        TuiAvatar,
        RouterModule,
        FormsModule,
        NgForOf,
        TuiDropdown,
        TuiTable,
        TuiTitle,
        TuiIcon,
        TuiLink
    ],
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        ...adminProviders
    ]
})
export class UsersComponent {
    // Default Table Size
    protected readonly size = 'm';
    protected users: User[] = [];
    protected sortedUsers: User[] = [];
    currentUser: User | undefined;

    constructor(
        private dialogs: TuiResponsiveDialogService,
        private alerts: TuiAlertService,
        @Inject(USERS_SERVICE_TOKEN) private usersService: UsersService
    ) {
        this.users = usersService.getUsers();
    }
    // Mock Users Data
   

    // Available Columns for Display
    availableColumns = [
        { key: 'email', label: 'Email', visible: true },
        { key: 'flatNumber', label: 'Flat Number', visible: true },
        { key: 'address', label: 'Address', visible: false },
        { key: 'borrowedItems', label: 'Borrowed Items', visible: true },
        { key: 'returnedLate', label: 'Returned Late', visible: true },
        { key: 'successRate', label: '% of Late', visible: true },
    ];

        // Default Visible Columns
    visibleColumns = [...this.availableColumns];

    // Current Sorting Column
    currentSort: string = '';
    sortOrder: { [key: string]: boolean } = {};  // True for ascending, false for descending

     passwordForm = new FormGroup({
        userPasswordControl: new FormControl(''),
    });
 
    protected openPasswordDialog = false;
    
    updateVisibleColumns(): void {
        this.visibleColumns = this.availableColumns.filter((column) => column.visible);
    }
    ngOnInit(): void {
        this.updateVisibleColumns();
        this.users = this.usersService.getUsers();
            // Current Sorting Column
        this.sortedUsers = [...this.users];
    }

    // Sort function with toggle for ascending/descending
    sort(column: string): void {
        // Toggle sort order
        if (this.currentSort === column) {
            this.sortOrder[column] = !this.sortOrder[column];
        } else {
            this.currentSort = column;
            this.sortOrder[column] = true; // Default to ascending for new column
        }

        // Sort users based on the current column and order
        this.sortedUsers = [...this.users].sort((a, b) => {
            const aValue = a[column as keyof User];
            const bValue = b[column as keyof User];

            if (this.sortOrder[column]) {
                return aValue > bValue ? 1 : (aValue < bValue ? -1 : 0);
            } else {
                return aValue < bValue ? 1 : (aValue > bValue ? -1 : 0);
            }
        });
    }

    // Get the sorting icon (up or down)
    getSortIcon(column: string): string {
        return this.sortOrder[column] ? '↑' : '↓';
    }

    deleteUser(user: User): void {
        const data: TuiConfirmData = {
            content: 'Are you sure you want to delete this user?',  // Simple content
            yes: 'Yes, Delete',
            no: 'Cancel',
        };
 
        this.dialogs
            .open<boolean>(TUI_CONFIRM, {
                label: "Delete user '" +user.username + "'",
                size: 'm',
                data,
            })
            .pipe(switchMap((response) => this.alerts.open('User <strong>' + user.username + '</strong> deleted successfully', {appearance: 'positive'})))
            .subscribe();
    }

    disableUser(user: User): void {
        const data: TuiConfirmData = {
            content: 'Are you sure you want to disable this user?',  // Simple content
            yes: 'Yes, Disable',
            no: 'Cancel',
        };
 
        this.dialogs
            .open<boolean>(TUI_CONFIRM, {
                label: "Disable user '" + user.username + "'",
                size: 'm',
                data,
            })
            .pipe(switchMap((response) => this.alerts.open('User <strong>' + user.username + '</strong> Disable successfully', {appearance: 'positive'})))
            .subscribe();
    }

    getUserProperty(user: any, key: string): any {
        return user[key];
    }
 
    protected setPassword(user: User): void {
        this.openPasswordDialog = true;
        this.currentUser = user;
    }

    setUserPassword() {
        if (this.passwordForm.valid) {
            const newPassword = this.passwordForm.get('userPasswordControl')?.value;
            if (typeof newPassword === 'string') {
                this.usersService.setUserPassword(this.currentUser?.id, newPassword);
                this.openPasswordDialog = false;
                this.alerts.open('User <strong>' + this.currentUser?.username + '</strong> password set successfully', {appearance: 'positive'}).subscribe();
            }
        }
    }

}