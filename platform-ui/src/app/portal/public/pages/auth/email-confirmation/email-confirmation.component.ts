import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TuiButton, TuiLoader, TuiTextfield } from '@taiga-ui/core';
import { WelcomeComponent } from '../../../../../components/welcome/welcome.component';
import { AUTH_SERVICE_TOKEN, getGlobalProviders } from '../../../../../global.provider';
import { AuthService } from '../../../../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-email-confirmation',
  imports: [
    WelcomeComponent,
    TuiButton,
    TuiLoader,
    TuiTextfield,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
  ],
  templateUrl: './email-confirmation.component.html',
  styleUrl: './email-confirmation.component.scss',
  providers: [...getGlobalProviders()],
  changeDetection: ChangeDetectionStrategy.Default
})
export class EmailConfirmationComponent {

  isLoading = false;
  isSuccess = false;
  constructor(
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthService,
    public router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.isLoading = true;
    const token = this.route.snapshot.queryParams['token'];
    this.verifyEmail(token);
  }

  verifyEmail(token: string) {
    this.authService.verifyEmail(token).subscribe({
      next: (success: boolean) => {
        this.isSuccess = success;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isSuccess = false;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
