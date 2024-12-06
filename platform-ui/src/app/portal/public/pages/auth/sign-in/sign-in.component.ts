import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {RouterLink, RouterLinkActive} from '@angular/router';
import { WelcomeComponent } from '../../../../../components/welcome/welcome.component';
import { AuthService } from '../../../../../services/auth.service';
import { AUTH_SERVICE_TOKEN, globalProviders } from '../../../../../global.provider';

@Component({
  standalone: true, 
    selector: 'app-sign-in',
    imports: [WelcomeComponent, RouterLink, ReactiveFormsModule, FormsModule],
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.scss',
    providers: [
      ...globalProviders,
  ]})
export class SignInComponent {
  signInForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthService, 
    private router: Router
  ) {
    this.signInForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
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