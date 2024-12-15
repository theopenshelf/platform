import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TuiAppearance, TuiButton, TuiHint, TuiIcon, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import { UIItemWithRecords } from '../../models/UIItemWithRecords';

@Component({
  selector: 'item-card',
  imports: [
    TuiHint,
    RouterLink,
    TuiIcon,
    CommonModule,
    TuiAppearance,
    TuiButton,
    TuiTitle,
    FormsModule,
    TuiTextfield
  ],
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.scss'
})
export class ItemCardComponent {

  @Input() item: UIItemWithRecords = {} as UIItemWithRecords;
  @Input() markAsFavorite: (item: UIItemWithRecords) => void = (item) => {
    console.log(`Item ${item.id} marked as favorite.`);
  };
}
