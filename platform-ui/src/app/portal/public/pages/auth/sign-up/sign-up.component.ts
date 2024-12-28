import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiPassword } from '@taiga-ui/kit';
import { WelcomeComponent } from '../../../../../components/welcome/welcome.component';
import { AUTH_SERVICE_TOKEN, globalProviders } from '../../../../../global.provider';
import { AuthService } from '../../../../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-sign-up',
  imports: [
    WelcomeComponent,
    TuiButton,
    TuiTextfield,
    TuiIcon,
    TuiPassword,
    RouterLink,
    ReactiveFormsModule,
    FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  providers: [
    ...globalProviders,
  ]
})
export class SignUpComponent {
  signUpForm: FormGroup;

  constructor(private fb: FormBuilder,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthService
  ) {
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
      const { email, password, username, streetAddress, city, postalCode, country } = this.signUpForm.value;
      this.authService.signUp(email, username, password, streetAddress, city, postalCode, country);
      alert('Registration successful! Please check your email for confirmation.');
    }
  }
}