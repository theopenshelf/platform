import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { globalProviders } from '../../../../../global.provider';

@Component({
  standalone: true,
  selector: 'app-sign-out',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './sign-out.component.html',
  styleUrl: './sign-out.component.scss',
  providers: [...globalProviders],
})
export class SignOutComponent {}
