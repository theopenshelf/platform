import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { AUTH_SERVICE_TOKEN } from '../../../../../global.provider';
import { AuthService } from '../../../../../services/auth.service';
import { PROFILE_SERVICE_TOKEN } from '../../../community.provider';
import { ProfileService } from '../../../services/profile.service';
import { TuiPassword } from '@taiga-ui/kit';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule,
    TuiButton,
    TuiPassword,
    TuiTextfield,
    TuiIcon,

  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',

})
export class ProfileComponent {
  profileForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject(PROFILE_SERVICE_TOKEN) private profileService: ProfileService,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthService

  ) {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      streetAddress: [''],
      city: [''],
      postalCode: [''],
      country: ['']
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
      this.profileService.updateProfile(this.profileForm.value).subscribe(profile => {
        console.log('Profile data saved:', profile);
      });
    } else {
      console.error('Form is invalid');
    }
  }
}

