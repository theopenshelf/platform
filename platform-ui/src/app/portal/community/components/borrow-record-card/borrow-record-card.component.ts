import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TuiAutoColorPipe, TuiIcon, TuiInitialsPipe, TuiTextfield } from '@taiga-ui/core';

import { TuiHint } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { BorrowRecordTimelineComponent } from "../../../../components/borrow-record-timeline/borrow-record-timeline.component";
import { UIUser } from '../../../admin/services/users.service';
import { getBorrowDurationInDays, getBorrowRecordStatus, getLateDurationInDays, UIBorrowRecord, UIBorrowRecordStatus } from '../../models/UIBorrowRecord';
import { UIItem } from '../../models/UIItem';
import { UILibrary } from '../../models/UILibrary';

@Component({
  selector: 'borrow-record-card',
  imports: [
    TuiHint,
    TuiIcon,
    RouterLink,
    CommonModule,
    FormsModule,
    TuiTextfield,
    TuiAvatar,
    BorrowRecordTimelineComponent,
    TuiInitialsPipe,
    TuiAutoColorPipe
  ],
  templateUrl: './borrow-record-card.component.html',
  styleUrl: './borrow-record-card.component.scss'
})
export class BorrowRecordCardComponent {
  public borrowRecord = input.required<UIBorrowRecord>();
  public user = input<UIUser>();
  public library = input<UILibrary>();
  public item = input<UIItem>();

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
  protected readonly borrowDuration = computed(() => {
    return getBorrowDurationInDays(this.borrowRecord());
  });
  protected readonly lateDuration = computed(() => {
    return getLateDurationInDays(this.borrowRecord());
  });
}
