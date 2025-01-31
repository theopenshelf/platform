import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, Inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  TuiAppearance,
  TuiButton,
  TuiHint,
  TuiIcon,
  TuiTextfield,
  TuiTitle,
} from '@taiga-ui/core';
import { ITEMS_SERVICE_TOKEN } from '../../community.provider';
import { UIBorrowRecord } from '../../models/UIBorrowRecord';
import { UIItem } from '../../models/UIItem';
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
    TuiTextfield,
    TranslateModule
  ],
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.scss',
  providers: [DatePipe],
})
export class ItemCardComponent {
  public item = input.required<UIItem>();
  public library = input<UILibrary>();
  public borrowRecords = input.required<UIBorrowRecord[]>();

  public isReserved = computed(
    () =>
      this.borrowRecords().filter((record) => record.endDate >= new Date())
        .length > 0,
  );
  public nextReservation = computed(() => {
    return this.borrowRecords()
      .filter((record) => record.endDate >= new Date())
      .sort((a, b) => a.endDate.getTime() - b.endDate.getTime())[0];
  });

  constructor(
    @Inject(ITEMS_SERVICE_TOKEN) private itemsService: ItemsService,
    private datePipe: DatePipe,
  ) { }

  markAsFavorite: (item: UIItem) => void = (item) => {
    this.itemsService.markAsFavorite(item).subscribe({
      next: () => console.log(`Item ${item.id} marked as favorite.`),
      error: (err) => console.error('Error marking item as favorite:', err),
    });
  };

  formatReservationDate(date: Date): string | null {
    return this.datePipe.transform(date, 'EEE d MMM');
  }
}
