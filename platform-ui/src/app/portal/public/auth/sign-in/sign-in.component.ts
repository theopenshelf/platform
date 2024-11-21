import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  signInForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.signInForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    debugger;
    if (this.signInForm.valid) {
      const { username, password } = this.signInForm.value;
      if (this.authService.signIn(username, password)) {
        if (this.authService.hasRole('admin')) {
          this.router.navigate(['/admin']);
        } else if (this.authService.hasRole('community')) {
          this.router.navigate(['/community']);
        } else {
          this.router.navigate(['/']);
        }
      } else {
        alert('Invalid credentials');
      }
    }
  }
}