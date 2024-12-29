import { CommonModule } from '@angular/common';
import { Component, Inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TuiAppearance, TuiButton, TuiHint, TuiIcon, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import { ITEMS_SERVICE_TOKEN } from '../../community.provider';
import { UIItemWithRecords } from '../../models/UIItemWithRecords';
import { UILibrary } from '../../models/UILibrary';
import { ItemsService } from '../../services/items.service';

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

  public item = input.required<UIItemWithRecords>();
  public library = input<UILibrary>();

  constructor(
    @Inject(ITEMS_SERVICE_TOKEN) private itemsService: ItemsService
  ) { }

  markAsFavorite: (item: UIItemWithRecords) => void = (item) => {
    this.itemsService.markAsFavorite(item).subscribe({
      next: () => console.log(`Item ${item.id} marked as favorite.`),
      error: (err) => console.error('Error marking item as favorite:', err)
    });
  };
}
