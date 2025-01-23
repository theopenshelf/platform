import { Component, input } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'card-counter',
  imports: [
    TuiIcon
  ],
  templateUrl: './card-counter.component.html',
  styleUrl: './card-counter.component.scss'
})
export class CardCounterComponent {

  public icon = input.required<string>();
  public label = input.required<string>();
  public counter = input<string | number>();
}
