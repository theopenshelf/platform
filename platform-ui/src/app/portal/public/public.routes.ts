import { Routes } from '@angular/router';
import { SignInComponent } from './pages/auth/sign-in/sign-in.component';
import { SignOutComponent } from './pages/auth/sign-out/sign-out.component';
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { EmailConfirmationComponent } from './pages/auth/email-confirmation/email-confirmation.component';
import { SignUpComponent } from './pages/auth/sign-up/sign-up.component';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirect to 'profile'
      { path: 'login', component: SignInComponent },
        { path: 'sign-out', component: SignOutComponent },
        { path: 'sign-up', component: SignUpComponent },
        { path: 'forgot-password', component: ForgotPasswordComponent },
        { path: 'reset-password', component: ResetPasswordComponent },
        { path: 'email-confirmation', component: EmailConfirmationComponent },
      ],
  },
];