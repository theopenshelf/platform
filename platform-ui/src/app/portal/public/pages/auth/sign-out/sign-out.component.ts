import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { getGlobalProviders } from '../../../../../global.provider';

@Component({
  standalone: true,
  selector: 'app-sign-out',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './sign-out.component.html',
  styleUrl: './sign-out.component.scss',
  providers: [...getGlobalProviders()],
})
export class SignOutComponent { }
