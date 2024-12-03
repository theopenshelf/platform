import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import AuthService from '../../../../../services/mock/auth.service';
import { WelcomeComponent } from '../../../../../components/welcome/welcome.component';

@Component({
  standalone: true, 
    selector: 'app-sign-up',
    imports: [WelcomeComponent, RouterLink, ReactiveFormsModule, FormsModule],
    templateUrl: './sign-up.component.html',
    styleUrl: './sign-up.component.scss'
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