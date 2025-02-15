import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
import { map } from 'rxjs';
import { UIUser } from '../../../../models/UIUser';
import { USERS_SERVICE_TOKEN } from '../../admin.providers';
import {
  Column,
  TosTableComponent,
} from '../../components/tos-table/tos-table.component';
import { UsersService } from '../../services/users.service';



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
    TosTableComponent,
    TranslateModule
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
  columns: Column[] = [];
  passwordForm = new FormGroup({
    userPasswordControl: new FormControl(''),
  });

  protected openPasswordDialog = false;
  isMobile: boolean = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private dialogs: TuiResponsiveDialogService,
    private alerts: TuiAlertService,
    @Inject(USERS_SERVICE_TOKEN) private usersService: UsersService,
    private translate: TranslateService
  ) {
    this.columns = [
      {
        key: 'username',
        label: this.translate.instant('users.columns.username'),
        custom: true,
        visible: true,
        sortable: true,
        size: 'm',
      },
      {
        key: 'email',
        label: this.translate.instant('users.columns.email'),
        visible: true,
        sortable: true,
        size: 'm',
      },
      {
        key: 'flatNumber',
        label: this.translate.instant('users.columns.flatNumber'),
        visible: true,
        sortable: true,
        size: 'm',
      },
      {
        key: 'streetAddress',
        label: this.translate.instant('users.columns.address'),
        visible: false,
        sortable: false,
        size: 'l',
      },
      {
        key: 'borrowedItems',
        label: this.translate.instant('users.columns.borrowedItems'),
        visible: true,
        sortable: true,
        size: 's',
      },
      {
        key: 'returnedLate',
        label: this.translate.instant('users.columns.returnedLate'),
        visible: true,
        sortable: true,
        size: 's',
      },
      {
        key: 'successRate',
        label: this.translate.instant('users.columns.successRate'),
        visible: true,
        sortable: true,
        size: 's',
      },
    ];
    this.usersService.getUsers().subscribe((users) => (this.users = users));

    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isMobile = result.matches;
      });
  }

  deleteUser(user: UIUser): void {
    const data: TuiConfirmData = {
      content: this.translate.instant('users.confirmDeleteContent'),
      yes: this.translate.instant('users.confirmDeleteYes'),
      no: this.translate.instant('users.confirmDeleteNo'),
    };

    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: this.translate.instant('users.confirmDeleteLabel', { username: user.username }),
        size: 'm',
        data,
      })
      .subscribe(response => {
        if (response) {
          this.alerts.open(
            this.translate.instant('users.deleteSuccess', { username: user.username }),
            { appearance: 'positive' },
          ).subscribe();
        }
      });
  }

  disableUser(user: UIUser): void {
    const data: TuiConfirmData = {
      content: this.translate.instant('users.confirmDisableContent'),
      yes: this.translate.instant('users.confirmDisableYes'),
      no: this.translate.instant('users.confirmDisableNo'),
    };

    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: this.translate.instant('users.confirmDisableLabel', { username: user.username }),
        size: 'm',
        data,
      })
      .subscribe((response) => {
        if (response) {
          this.alerts.open(
            this.translate.instant('users.disableSuccess', { username: user.username }),
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
                this.translate.instant('users.passwordSetSuccess', { username: this.currentUser?.username }),
                { appearance: 'positive' },
              )
              .subscribe();
          });
      }
    }
  }
}
