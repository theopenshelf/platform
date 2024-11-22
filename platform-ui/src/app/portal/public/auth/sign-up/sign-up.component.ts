import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
    selector: 'app-sign-up',
    imports: [RouterLink, ReactiveFormsModule, FormsModule],
    templateUrl: './sign-up.component.html',
    styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  signUpForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      username: ['', Validators.required],
      streetAddress: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      const { email, password } = this.signUpForm.value;
      this.authService.signUp(email, password);
      alert('Registration successful! Please check your email for confirmation.');
    }
  }
}