import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { globalProviders, AUTH_SERVICE_TOKEN } from '../../../../../global.provider';
import { AuthService } from '../../../../../services/auth.service';

@Component({
  standalone: true, 
    selector: 'app-sign-out',
    imports: [ReactiveFormsModule, FormsModule],
    templateUrl: './sign-out.component.html',
    styleUrl: './sign-out.component.scss',
    providers: [
      ...globalProviders,
  ]   
})
export class SignOutComponent {
  signInForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthService, 
    private router: Router
  ) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.signInForm.valid) {
      const { email, password } = this.signInForm.value;
      if (this.authService.signIn(email, password)) {
        this.router.navigate(['/dashboard']);
      } else {
        alert('Invalid credentials');
      }
    }
  }
}