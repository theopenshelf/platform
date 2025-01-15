import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiPassword } from '@taiga-ui/kit';
import { WelcomeComponent } from '../../../../../components/welcome/welcome.component';
import {
  AUTH_SERVICE_TOKEN,
  globalProviders,
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
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  providers: [...globalProviders],
})
export class SignInComponent {
  signInForm: FormGroup;
  config: UISettings;

  constructor(
    private fb: FormBuilder,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthService,
    private configService: ConfigService,
    private router: Router,
  ) {
    this.signInForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });
    this.config = this.configService.getSettings();
  }

  onSubmit() {
    if (this.signInForm.valid) {
      const { username, password } = this.signInForm.value;
      this.authService
        .signIn(username, password)
        .subscribe((isAuthenticated: boolean) => {
          if (isAuthenticated) {
            if (this.authService.hasRole('admin')) {
              this.router.navigate(['/admin']);
            } else if (this.authService.hasRole('community')) {
              this.router.navigate(['/community']);
            } else {
              this.router.navigate(['/']);
            }
          } else {
            alert('Invalid credentials');
            return;
          }
        });
    }
  }
}
