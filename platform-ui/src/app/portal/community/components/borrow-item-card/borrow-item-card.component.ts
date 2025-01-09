import { CommonModule } from '@angular/common';
import { Component, computed, Inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TuiDay } from '@taiga-ui/cdk';
import { TuiAppearance, TuiButton, TuiHint, TuiIcon, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import { ITEMS_SERVICE_TOKEN } from '../../community.provider';
import { UIItem } from '../../models/UIItem';
import { UILibrary } from '../../models/UILibrary';
import { ItemsService } from '../../services/items.service';

@Component({
  selector: 'borrow-item-card',
  standalone: true,
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

  public item = input.required<UIItem>();
  public library = input<UILibrary>();

  public currentBorrowRecord = computed(() => {
    const now = TuiDay.fromLocalNativeDate(new Date());

    const record = this.item().borrowRecords.filter(record => {
      return new Date() >= record.endDate;
    }).sort((a, b) => {
      return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
    })[0];

    return record;
  });

  constructor(
    @Inject(ITEMS_SERVICE_TOKEN) private itemsService: ItemsService
  ) { }

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

  protected computeStatus(): 'Reserved' | 'Currently Borrowed' | 'Returned' {
    const now = new Date();

    if (!this.currentBorrowRecord()) {
      return 'Returned';
    }

    const borrowedOn = this.currentBorrowRecord().startDate;
    const dueDate = this.currentBorrowRecord().endDate;

    if (now < borrowedOn) {
      return 'Reserved';
    } else if (now >= borrowedOn && now <= dueDate) {
      return 'Currently Borrowed';
    } else {
      return 'Returned';
    }
  }
}
