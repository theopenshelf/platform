import { Component, input } from '@angular/core';
import { TuiAutoColorPipe, TuiIcon, TuiInitialsPipe } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';

export interface TopData {
  name: string;
  icon?: string;
  avatar?: boolean;
  value: number;
  secondaryValue?: number;
}

@Component({
  selector: 'card-top',
  imports: [
    TuiAvatar,
    TuiIcon,
    TuiInitialsPipe,
    TuiAutoColorPipe,
  ],
  templateUrl: './card-top.component.html',
  styleUrl: './card-top.component.scss'
})
export class CardTopComponent {
  public title = input.required<string>();
  public columnName = input.required<string>();
  public columnValue = input.required<string>();
  public columnSecondaryValue = input<string>();
  public data = input.required<TopData[]>();
}
