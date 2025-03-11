import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TuiAlertService, TuiButton, TuiTextfield } from '@taiga-ui/core';
import { WelcomeComponent } from '../../../../../components/welcome/welcome.component';
import { AUTH_SERVICE_TOKEN, getGlobalProviders } from '../../../../../global.provider';
import { AuthService } from '../../../../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-reset-password',
  imports: [
    WelcomeComponent,
    TuiButton,
    TuiTextfield,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  providers: [...getGlobalProviders()],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private alerts: TuiAlertService,
    private translate: TranslateService,
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.router.navigate(['/sign-in']);
    }
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    if (this.resetPasswordForm.valid && this.token) {
      const { newPassword } = this.resetPasswordForm.value;
      this.authService.confirmResetPassword(this.token, newPassword).subscribe({
        next: (success) => {
          if (success) {
            this.alerts.open(this.translate.instant('resetPassword.success'),
              { appearance: 'positive' }).subscribe();
            this.router.navigate(['/sign-in']);
          } else {
            this.alerts.open(this.translate.instant('resetPassword.error'),
              { appearance: 'error' }).subscribe();
          }
        },
        error: () => {
          this.alerts.open(this.translate.instant('resetPassword.unexpected'),
            { appearance: 'error' }).subscribe();
        }
      });
    }
  }
}
