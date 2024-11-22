import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  standalone: true, 
    selector: 'app-forgot-password',
    imports: [RouterLink, ReactiveFormsModule, FormsModule],
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  signInForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    debugger;
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
