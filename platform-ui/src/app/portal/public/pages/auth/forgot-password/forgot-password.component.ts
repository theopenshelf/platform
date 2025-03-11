import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TuiAlertService, TuiButton, TuiTextfield } from '@taiga-ui/core';
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
  forgotPasswordForm: FormGroup;
  config: any;

  constructor(
    private fb: FormBuilder,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthService,
    private configService: ConfigService,
    private router: Router,
    private alerts: TuiAlertService,
    private translate: TranslateService,
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.config = this.configService.getSettings();
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const { email } = this.forgotPasswordForm.value;
      this.authService.resetPassword(email).subscribe((response) => {
        this.alerts.open(this.translate.instant('forgotPassword.emailSent'), { appearance: 'positive' }).subscribe();
      });
    }
  }
}
