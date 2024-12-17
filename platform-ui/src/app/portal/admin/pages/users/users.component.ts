import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TuiResponsiveDialogService } from '@taiga-ui/addon-mobile';
import { TuiTable, TuiTablePagination, TuiTablePaginationEvent } from '@taiga-ui/addon-table';
import { TuiAutoFocus } from '@taiga-ui/cdk';
import {
    TuiAlertService,
    TuiAutoColorPipe,
    TuiButton,
    TuiDialog,
    TuiDialogContext,
    TuiDropdown,
    TuiHint,
    TuiIcon,
    TuiInitialsPipe,
    TuiLink,
    TuiSizeL,
    TuiSizeS,
    TuiTitle
} from '@taiga-ui/core';
import { TUI_CONFIRM, TuiAvatar, TuiCheckbox, TuiConfirmData } from '@taiga-ui/kit';
import { TuiInputModule } from '@taiga-ui/legacy';
import type { PolymorpheusContent } from '@taiga-ui/polymorpheus';
import { switchMap } from 'rxjs';
import { adminProviders, USERS_SERVICE_TOKEN } from '../../admin.providers';
import { UIUser, UsersService } from '../../services/users.service';


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
        TuiDropdown,
        TuiTable,
        TuiTitle,
        TuiIcon,
        TuiLink,
        TuiTablePagination
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
    protected users: UIUser[] = [];
    protected sortedUsers: UIUser[] = [];
    currentUser: UIUser | undefined;
    protected page = 0;
    protected size = 10;
    protected totalUsers = 0;
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

    filterUser: string = '';

    constructor(
        private dialogs: TuiResponsiveDialogService,
        private alerts: TuiAlertService,
        @Inject(USERS_SERVICE_TOKEN) private usersService: UsersService
    ) {
        this.usersService.getUsers().subscribe(users => this.users = users);
    }

    updateVisibleColumns(): void {
        this.visibleColumns = this.availableColumns.filter((column) => column.visible);
    }
    ngOnInit(): void {
        this.updateVisibleColumns();
        this.usersService.getUsers().subscribe(users => {
            this.users = users;
            this.totalUsers = users.length;
            this.applyFilter();  // Apply filter initially
        });
        // Current Sorting Column
        this.sortedUsers = [...this.users];
    }

    applyFilter(): void {
        const filterValue = this.filterUser.toLowerCase();
        this.sortedUsers = this.users.filter(user =>
            user.username.toLowerCase().includes(filterValue) ||
            user.email.toLowerCase().includes(filterValue)
        );
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
            const aValue = a[column as keyof UIUser];
            const bValue = b[column as keyof UIUser];

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

    deleteUser(user: UIUser): void {
        const data: TuiConfirmData = {
            content: 'Are you sure you want to delete this user?',  // Simple content
            yes: 'Yes, Delete',
            no: 'Cancel',
        };

        this.dialogs
            .open<boolean>(TUI_CONFIRM, {
                label: "Delete user '" + user.username + "'",
                size: 'm',
                data,
            })
            .pipe(switchMap((response) => this.alerts.open('User <strong>' + user.username + '</strong> deleted successfully', { appearance: 'positive' })))
            .subscribe();
    }

    disableUser(user: UIUser): void {
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
            .pipe(switchMap((response) => this.alerts.open('User <strong>' + user.username + '</strong> Disable successfully', { appearance: 'positive' })))
            .subscribe();
    }

    getUserProperty(user: any, key: string): any {
        return user[key];
    }

    protected setPassword(user: UIUser): void {
        this.openPasswordDialog = true;
        this.currentUser = user;
    }

    setUserPassword() {
        if (this.passwordForm.valid) {
            const newPassword = this.passwordForm.get('userPasswordControl')?.value;
            if (typeof newPassword === 'string' && this.currentUser?.id) {
                this.usersService.setUserPassword(this.currentUser.id, newPassword).subscribe(() => {
                    this.openPasswordDialog = false;
                    this.alerts.open('User <strong>' + this.currentUser?.username + '</strong> password set successfully', { appearance: 'positive' }).subscribe();
                });
            }
        }
    }

    protected onPagination({ page, size }: TuiTablePaginationEvent): void {
        this.page = page;
        this.size = size;
    }

    protected selectColumnsDialog(
        content: PolymorpheusContent<TuiDialogContext>,
        textFieldSize: TuiSizeL | TuiSizeS,
    ): void {
        this.dialogs.open(content, { data: { textFieldSize } }).subscribe(() => {
            this.updateVisibleColumns();
        });
    }

}