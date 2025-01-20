import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TuiResponsiveDialogService } from '@taiga-ui/addon-mobile';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiAutoFocus } from '@taiga-ui/cdk';
import {
  TuiAlertService,
  TuiAutoColorPipe,
  TuiButton,
  TuiDialog,
  TuiDropdown,
  TuiHint,
  TuiIcon,
  TuiInitialsPipe
} from '@taiga-ui/core';
import {
  TUI_CONFIRM,
  TuiAvatar,
  TuiConfirmData
} from '@taiga-ui/kit';
import { TuiInputModule } from '@taiga-ui/legacy';
import { USERS_SERVICE_TOKEN } from '../../admin.providers';
import {
  Column,
  TosTableComponent,
} from '../../components/tos-table/tos-table.component';
import { UIUser, UsersService } from '../../services/users.service';
import { map } from 'rxjs';

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
    TuiDialog,
    TuiButton,
    TuiAutoColorPipe,
    TuiInitialsPipe,
    TuiAvatar,
    RouterModule,
    FormsModule,
    TuiDropdown,
    TuiTable,
    TuiIcon,
    TosTableComponent
  ],
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
  // Default Table Size
  protected users: UIUser[] = [];
  currentUser: UIUser | undefined;

  // Available Columns for Display
  columns: Column[] = [
    {
      key: 'username',
      label: 'Username',
      custom: true,
      visible: true,
      sortable: true,
      size: 'm',
    },
    { key: 'email', label: 'Email', visible: true, sortable: true, size: 'm' },
    {
      key: 'flatNumber',
      label: 'Flat Number',
      visible: true,
      sortable: true,
      size: 'm',
    },
    {
      key: 'address',
      label: 'Address',
      visible: false,
      sortable: false,
      size: 'l',
    },
    {
      key: 'borrowedItems',
      label: 'Borrowed Items',
      visible: true,
      sortable: true,
      size: 's',
    },
    {
      key: 'returnedLate',
      label: 'Returned Late',
      visible: true,
      sortable: true,
      size: 's',
    },
    {
      key: 'successRate',
      label: '% of Late',
      visible: true,
      sortable: true,
      size: 's',
    },
  ];
  passwordForm = new FormGroup({
    userPasswordControl: new FormControl(''),
  });

  protected openPasswordDialog = false;

  constructor(
    private dialogs: TuiResponsiveDialogService,
    private alerts: TuiAlertService,
    @Inject(USERS_SERVICE_TOKEN) private usersService: UsersService,
  ) {
    this.usersService.getUsers().subscribe((users) => (this.users = users));
  }

  deleteUser(user: UIUser): void {
    const data: TuiConfirmData = {
      content: 'Are you sure you want to delete this user?', // Simple content
      yes: 'Yes, Delete',
      no: 'Cancel',
    };

    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: "Delete user '" + user.username + "'",
        size: 'm',
        data,
      })
      .subscribe(response => {
        if (response) {
          this.alerts.open(
            'User <strong>' + user.username + '</strong> deleted successfully',
            { appearance: 'positive' },
          ).subscribe();
        }
      });
  }

  disableUser(user: UIUser): void {
    const data: TuiConfirmData = {
      content: 'Are you sure you want to disable this user?', // Simple content
      yes: 'Yes, Disable',
      no: 'Cancel',
    };

    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: "Disable user '" + user.username + "'",
        size: 'm',
        data,
      })
      .subscribe((response) => {
        if (response) {
          this.alerts.open(
            'User <strong>' + user.username + '</strong> Disable successfully',
            { appearance: 'positive' },
          ).subscribe();
        }
      });
  }

  protected setPassword(user: UIUser): void {
    this.openPasswordDialog = true;
    this.currentUser = user;
  }

  getDataFunction = (
    searchText?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    page?: number,
    pageSize?: number
  ) => {
    return this.usersService.getUsers().pipe(
      map((users) => {
        return {
          totalPages: 1,
          totalItems: users.length,
          currentPage: 0,
          itemsPerPage: users.length,
          items: users
        }
      })
    );
  }

  setUserPassword() {
    if (this.passwordForm.valid) {
      const newPassword = this.passwordForm.get('userPasswordControl')?.value;
      if (typeof newPassword === 'string' && this.currentUser?.id) {
        this.usersService
          .setUserPassword(this.currentUser.id, newPassword)
          .subscribe(() => {
            this.openPasswordDialog = false;
            this.alerts
              .open(
                'User <strong>' +
                this.currentUser?.username +
                '</strong> password set successfully',
                { appearance: 'positive' },
              )
              .subscribe();
          });
      }
    }
  }
}
