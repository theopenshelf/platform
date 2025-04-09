import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TuiAlertService, TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiPassword } from '@taiga-ui/kit';
import { AUTH_SERVICE_TOKEN } from '../../../../../global.provider';
import { AuthService } from '../../../../../services/auth.service';
import { USERS_SERVICE_TOKEN } from '../../../hub.provider';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-profile',
  imports: [
    ReactiveFormsModule,
    TuiButton,
    TuiPassword,
    TuiTextfield,
    TuiIcon,
    TranslateModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  profileForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private alerts: TuiAlertService,
    private translate: TranslateService,
    @Inject(USERS_SERVICE_TOKEN) private usersService: UsersService,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthService,
  ) {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      streetAddress: [''],
      city: [''],
      postalCode: [''],
      country: [''],
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  // Load initial profile data
  loadProfile(): void {
    this.profileForm.patchValue(this.authService.getCurrentUserInfo().user);
  }

  onSave(): void {
    if (this.profileForm.valid) {
      this.usersService
        .updateUser(this.profileForm.value)
        .subscribe((user) => {
          this.alerts.open(this.translate.instant('profile.saveSuccess'), {
            appearance: 'success',
          }).subscribe();
        });
    } else {
      this.alerts.open(this.translate.instant('profile.saveError'), {
        appearance: 'error',
      }).subscribe();
    }
  }
}
