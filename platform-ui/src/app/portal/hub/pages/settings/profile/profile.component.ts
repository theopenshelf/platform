import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
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
    @Inject(USERS_SERVICE_TOKEN) private usersService: UsersService,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthService,
  ) {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
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
    this.profileForm.patchValue(this.authService.getCurrentUserInfo());
  }

  onSave(): void {
    if (this.profileForm.valid) {
      this.usersService
        .updateUser(this.profileForm.value)
        .subscribe((user) => {
          console.log('Profile data saved:', user);
        });
    } else {
      console.error('Form is invalid');
    }
  }
}
