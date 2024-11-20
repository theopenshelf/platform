import { Routes } from '@angular/router';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignOutComponent } from './auth/sign-out/sign-out.component';
import { PublicLandingPageComponent } from './public-landing-page/public-landing-page.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { EmailConfirmationComponent } from './auth/email-confirmation/email-confirmation.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    component: PublicLandingPageComponent,
    children: [
      { path: '', component: SignInComponent },
      { path: 'login', component: SignInComponent },
        { path: 'sign-out', component: SignOutComponent },
        { path: 'sign-up', component: SignUpComponent },
        { path: 'forgot-password', component: ForgotPasswordComponent },
        { path: 'reset-password', component: ResetPasswordComponent },
        { path: 'email-confirmation', component: EmailConfirmationComponent },
      ],
  },
];