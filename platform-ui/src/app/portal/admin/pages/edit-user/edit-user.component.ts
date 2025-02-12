import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  TuiAlertService,
  TuiButton,
  TuiIcon,
  TuiTextfield,
} from '@taiga-ui/core';
import { TuiPassword } from '@taiga-ui/kit';
import { UIUser } from '../../../../models/UIUser';
import { USERS_SERVICE_TOKEN } from '../../admin.providers';
import { UsersService } from '../../services/users.service';
@Component({
  standalone: true,
  selector: 'app-edit-user',
  imports: [
    RouterLink,
    TuiButton,
    FormsModule,
    ReactiveFormsModule,
    TuiButton,
    TuiTextfield,
    TuiIcon,
    TuiPassword,
    TranslateModule
  ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss',
})
export class EditUserComponent implements OnInit {
  user: UIUser = {} as UIUser;
  editUserForm: FormGroup;
  userId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    @Inject(USERS_SERVICE_TOKEN) private usersService: UsersService,
    private fb: FormBuilder,
    private alerts: TuiAlertService,
    private router: Router,
  ) {
    this.editUserForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      flatNumber: [''],
      address: [''],
    });
  }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.usersService.getUser(this.userId).subscribe((user) => {
        this.user = user;
        this.editUserForm.patchValue(this.user);
      });
    } else {
      this.editUserForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        flatNumber: [''],
        address: [''],
      });
    }
  }

  onSubmit() {
    if (this.editUserForm.valid) {
      const updatedUser = this.editUserForm.value;
      updatedUser.id = this.user.id;
      this.user.username = updatedUser.username;
      this.user.email = updatedUser.email;
      this.usersService.saveUser(this.user);
      this.alerts
        .open(`Successfully saved ${this.user.username}`, {
          appearance: 'positive',
        })
        .subscribe();
      this.router.navigate(['/admin/users']);
    }
  }
}
