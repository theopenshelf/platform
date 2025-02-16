import { Component, Inject } from '@angular/core';
import { FilteredAndPaginatedBorrowRecordsComponent } from '../../../../components/filtered-and-paginated-borrow-records/filtered-and-paginated-borrow-records.component';
import { BreadcrumbService } from '../../../../components/tos-breadcrumbs/tos-breadcrumbs.service';
import { AUTH_SERVICE_TOKEN } from '../../../../global.provider';
import { GetItemsParams } from '../../../../models/GetItemsParams';
import { AuthService } from '../../../../services/auth.service';
import { USERS_SERVICE_TOKEN } from '../../community.provider';
import { UsersService } from '../../services/users.service';
@Component({
  selector: 'app-approval-dashboard',
  imports: [FilteredAndPaginatedBorrowRecordsComponent],
  templateUrl: './approval-dashboard.component.html',
  styleUrl: './approval-dashboard.component.scss'
})
export class ApprovalDashboardComponent {
  public getItemsParams: GetItemsParams = {
    borrowedByCurrentUser: false
  };

  constructor(
    @Inject(USERS_SERVICE_TOKEN) private userService: UsersService,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthService,
    private breadcrumbService: BreadcrumbService
  ) {
    this.breadcrumbService.setBreadcrumbs([
      { caption: 'breadcrumb.approval', routerLink: '/community/approval-dashboard' }
    ]);
  }

  ngOnInit() {
  }
}
