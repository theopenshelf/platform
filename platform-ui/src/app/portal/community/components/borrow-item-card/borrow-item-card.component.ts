import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TuiAppearance, TuiButton, TuiHint, TuiIcon, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import { ITEMS_SERVICE_TOKEN } from '../../community.provider';
import { UIBorrowItem } from '../../models/UIBorrowItem';
import { ItemsService } from '../../services/items.service';

@Component({
  selector: 'borrow-item-card',
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
  templateUrl: './borrow-item-card.component.html',
  styleUrl: './borrow-item-card.component.scss'
})
export class BorrowItemCardComponent {

  @Input() item: UIBorrowItem = {} as UIBorrowItem;

  constructor(
    @Inject(ITEMS_SERVICE_TOKEN) private itemsService: ItemsService
  ) { }

  @Input() markAsFavorite: (item: UIBorrowItem) => void = (item) => {
    this.itemsService.markAsFavorite(item).subscribe({
      next: () => console.log(`Item ${item.id} marked as favorite.`),
      error: (err) => console.error('Error marking item as favorite:', err)
    });
  };

  protected getBadgeClass(status: 'Reserved' | 'Currently Borrowed' | 'Returned'): string {
    switch (status) {
      case 'Reserved':
        return 'badge badge-reserved';
      case 'Currently Borrowed':
        return 'badge badge-borrowed';
      case 'Returned':
        return 'badge badge-returned';
      default:
        return '';
    }
  }

  protected computeStatus(borrowedOn: string, dueDate: string): 'Reserved' | 'Currently Borrowed' | 'Returned' {
    const now = new Date();
    const borrowed = new Date(borrowedOn);
    const due = new Date(dueDate);

    if (now < borrowed) {
      return 'Reserved';
    } else if (now >= borrowed && now <= due) {
      return 'Currently Borrowed';
    } else {
      return 'Returned';
    }
  }

}
