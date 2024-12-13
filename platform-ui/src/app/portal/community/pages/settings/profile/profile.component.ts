import { Component, Inject, InjectionToken, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { communityProviders } from '../../../community.provider';
import { PROFILE_SERVICE_TOKEN } from '../../../community.provider';
import { ProfileService } from '../../../services/profile.service';
import { AuthService } from '../../../../../services/auth.service';
import { AUTH_SERVICE_TOKEN, globalProviders } from '../../../../../global.provider';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss' ,
    providers: [
        ...globalProviders,
        ...communityProviders,
    ]
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

