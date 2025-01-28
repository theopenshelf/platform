import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  TuiAppearance,
  TuiButton,
  TuiHint,
  TuiIcon,
  TuiTextfield,
  TuiTitle,
} from '@taiga-ui/core';
import { BorrowRecordTimelineComponent } from "../../../../components/borrow-record-timeline/borrow-record-timeline.component";
import { getBorrowRecordStatus, UIBorrowRecordStatus } from '../../models/UIBorrowRecord';
import { UIBorrowRecordStandalone } from '../../models/UIBorrowRecordsPagination';
import { UILibrary } from '../../models/UILibrary';

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
    TuiTextfield,
    BorrowRecordTimelineComponent
  ],
  templateUrl: './borrow-item-card.component.html',
  styleUrl: './borrow-item-card.component.scss',
})
export class BorrowItemCardComponent {
  public borrowRecord = input.required<UIBorrowRecordStandalone>();
  public library = input<UILibrary>();
  protected readonly status = computed(() => {
    return getBorrowRecordStatus(this.borrowRecord());
  });
  protected readonly statusIcon = computed(() => {
    switch (this.status()) {
      case UIBorrowRecordStatus.Impossible:
        return '@tui.x';
      case UIBorrowRecordStatus.Reserved:
        return '@tui.clock';
      case UIBorrowRecordStatus.CurrentlyBorrowed:
        return '/gift.png';
      case UIBorrowRecordStatus.ReturnedEarly:
        return '@tui.calendar-check';
      case UIBorrowRecordStatus.Returned:
        return '@tui.calendar-check';
      case UIBorrowRecordStatus.DueToday:
        return '@tui.calendar-clock';
      case UIBorrowRecordStatus.Late:
        return '@tui.calendar-clock';
      case UIBorrowRecordStatus.ReturnedLate:
        return '@tui.calendar-x';
      default:
        return '@tui.x';
    }
  });
  protected readonly statusText = computed(() => {
    switch (this.status()) {
      case UIBorrowRecordStatus.Impossible:
        return 'Impossible';
      case UIBorrowRecordStatus.Reserved:
        return 'Reserved';
      case UIBorrowRecordStatus.CurrentlyBorrowed:
        return 'Currently Borrowed';
      case UIBorrowRecordStatus.ReturnedEarly:
        return 'Early';
      case UIBorrowRecordStatus.Returned:
        return 'On-time';
      case UIBorrowRecordStatus.DueToday:
        return 'Due Today';
      case UIBorrowRecordStatus.Late:
        return 'Late';
      case UIBorrowRecordStatus.ReturnedLate:
        return 'Late';
      default:
        return 'Unknown';
    }
  });
}
