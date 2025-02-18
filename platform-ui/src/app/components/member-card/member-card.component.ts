import { Component, input } from '@angular/core';
import { TuiAutoColorPipe, TuiInitialsPipe } from '@taiga-ui/core';
import { TuiAvatar, TuiBadge } from '@taiga-ui/kit';
import { UIMember } from '../../models/UILibrary';

@Component({
  selector: 'member-card',
  imports: [
    TuiAvatar,
    TuiInitialsPipe,
    TuiAutoColorPipe,
    TuiBadge,
  ],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.scss'
})
export class MemberCardComponent {
  public member = input.required<UIMember>();
}
