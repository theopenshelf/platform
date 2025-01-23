import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { USERS_SERVICE_TOKEN } from '../../admin.providers';
import { UIUser, UsersService } from '../../services/users.service';

@Component({
  selector: 'user-activity',
  imports: [],
  templateUrl: './user-activity.component.html',
  styleUrl: './user-activity.component.scss'
})
export class UserActivityComponent {
  userId: string | null = null;
  user: UIUser = {} as UIUser;

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
      });
    }
  }
}
