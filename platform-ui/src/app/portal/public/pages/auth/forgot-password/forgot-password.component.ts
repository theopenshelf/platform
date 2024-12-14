import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {RouterLink, RouterLinkActive} from '@angular/router';
import { WelcomeComponent } from '../../../../../components/welcome/welcome.component';
import { globalProviders, AUTH_SERVICE_TOKEN } from '../../../../../global.provider';
import { AuthService } from '../../../../../services/auth.service';
import { ConfigService } from '../../../../../services/config.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true, 
    selector: 'app-forgot-password',
    imports: [WelcomeComponent, RouterLink, ReactiveFormsModule, FormsModule, CommonModule],
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.scss',
    providers: [
      ...globalProviders,
  ]})
export class ForgotPasswordComponent {
  signInForm: FormGroup;
  config: any;

  constructor(
    private fb: FormBuilder, 
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthService, 
    private configService: ConfigService,
    private router: Router
  ) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.config = this.configService.getSettings();
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
