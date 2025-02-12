import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TuiAutoColorPipe, TuiIcon, TuiInitialsPipe } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { UIUser } from '../../../../models/UIUser';
import { communityProviders } from '../../../community/community.provider';
import { FilteredAndPaginatedBorrowRecordsComponent } from '../../../community/components/filtered-and-paginated-borrow-records/filtered-and-paginated-borrow-records.component';
import { GetItemsParams } from '../../../community/services/items.service';
import { USERS_SERVICE_TOKEN } from '../../admin.providers';
import { CardCounterComponent } from '../../components/dashboards/card-counter/card-counter.component';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'user-activity',
  imports: [
    TuiAvatar,
    TuiInitialsPipe,
    TuiAutoColorPipe,
    TuiIcon,
    CardCounterComponent,
    FilteredAndPaginatedBorrowRecordsComponent,
    TranslateModule
  ],
  templateUrl: './user-activity.component.html',
  styleUrl: './user-activity.component.scss',
  providers: [
    ...communityProviders,
  ],
})
export class UserActivityComponent {
  userId: string | null = null;
  user: UIUser = {} as UIUser;
  public getItemsParams: GetItemsParams = {};

  constructor(
    private route: ActivatedRoute,
    @Inject(USERS_SERVICE_TOKEN) private usersService: UsersService,
  ) {
  }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.usersService.getUser(this.userId).subscribe((user) => {
        this.user = user;
        this.getItemsParams = {
          borrowedBy: this.user.id,
        }
      });
    }
  }
}
