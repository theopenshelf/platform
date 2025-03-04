import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TuiButton, TuiTextfield } from '@taiga-ui/core';
import { WelcomeComponent } from '../../../../../components/welcome/welcome.component';
import {
  AUTH_SERVICE_TOKEN,
  getGlobalProviders,
} from '../../../../../global.provider';
import { AuthService } from '../../../../../services/auth.service';
import { ConfigService } from '../../../../../services/config.service';

@Component({
  standalone: true,
  selector: 'app-forgot-password',
  imports: [
    WelcomeComponent,
    TuiButton,
    TuiTextfield,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  providers: [...getGlobalProviders()],
})
export class ForgotPasswordComponent {
  signInForm: FormGroup;
  config: any;

  constructor(
    private fb: FormBuilder,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthService,
    private configService: ConfigService,
    private router: Router,
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
