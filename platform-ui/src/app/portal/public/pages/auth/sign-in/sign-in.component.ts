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
import { TuiAlertService, TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiPassword } from '@taiga-ui/kit';
import { WelcomeComponent } from '../../../../../components/welcome/welcome.component';
import {
  AUTH_SERVICE_TOKEN,
  getGlobalProviders,
} from '../../../../../global.provider';
import { AuthService } from '../../../../../services/auth.service';
import {
  ConfigService,
  UISettings,
} from '../../../../../services/config.service';

@Component({
  standalone: true,
  selector: 'app-sign-in',
  imports: [
    WelcomeComponent,
    TuiButton,
    TuiTextfield,
    TuiIcon,
    TuiPassword,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  providers: [...getGlobalProviders()],
})
export class SignInComponent {
  signInForm: FormGroup;
  config: UISettings;

  constructor(
    private fb: FormBuilder,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthService,
    private configService: ConfigService,
    private router: Router,
    private alerts: TuiAlertService,
  ) {
    this.signInForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });
    this.config = this.configService.getSettings();
    if (ConfigService.configuration.demoMode) {
      this.signInForm.patchValue({
        username: 'demo',
        password: 'password',
      });
    }
  }

  onSubmit() {
    if (this.signInForm.valid) {
      const { username, password } = this.signInForm.value;
      this.authService
        .signIn(username, password)
        .subscribe((isAuthenticated: boolean) => {
          if (isAuthenticated) {
            if (this.authService.hasRole('hub')) {
              this.router.navigate(['/hub']);
            } else {
              this.router.navigate(['/']);
            }
          } else {
            this.alerts.open(
              'Invalid credentials',
              { appearance: 'negative' }
            ).subscribe();
            return;
          }
        });
    }
  }
}
