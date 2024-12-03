import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  profileForm: FormGroup;

  constructor(private fb: FormBuilder) {
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
    const mockProfileData = {
      username: 'Quentin Castel',
      email: 'quentin@example.com',
      password: '', // Leave blank for security reasons
      streetAddress: '123 Library St.',
      city: 'Bookville',
      postalCode: '12345',
      country: 'France'
    };
    this.profileForm.patchValue(mockProfileData);
  }

  onSave(): void {
    if (this.profileForm.valid) {
      console.log('Profile data saved:', this.profileForm.value);
      // Add your save logic here, e.g., API call
    } else {
      console.error('Form is invalid');
    }
  }
}
