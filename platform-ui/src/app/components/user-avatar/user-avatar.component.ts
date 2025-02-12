import { Component, input } from '@angular/core';
import { TuiAutoColorPipe, TuiInitialsPipe } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { UIUser } from '../../models/UIUser';

@Component({
  selector: 'user-avatar',
  imports: [
    TuiAvatar,
    TuiInitialsPipe,
    TuiAutoColorPipe,
  ],

  templateUrl: './user-avatar.component.html',
  styleUrl: './user-avatar.component.scss'
})
export class UserAvatarComponent {

  user = input.required<UIUser>();
  size = input<"m" | "s" | "xs" | "l" | "xl" | "xxl">('s');
}
