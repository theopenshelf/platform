import { CommonModule } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TuiAutoColorPipe, TuiButton, TuiIcon, TuiInitialsPipe, TuiTextfield } from '@taiga-ui/core';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
    TuiAutoColorPipe,
    TranslateModule,
    TuiButton
  ],
  templateUrl: './borrow-record-card.component.html',
  styleUrl: './borrow-record-card.component.scss'
})
export class BorrowRecordCardComponent {
  public borrowRecord = input.required<UIBorrowRecord>();
  public user = input<UIUser>();
  public library = input<UILibrary>();
  public item = input<UIItem>();

  private currentItem = signal<UIItem | undefined>(undefined);
  private currentBorrowRecord = signal<UIBorrowRecord | undefined>(undefined);
  public pickUpItemCallback = input<(item: UIItem, borrowRecord: UIBorrowRecord) => void>();
  public returnItemCallback = input<(item: UIItem, borrowRecord: UIBorrowRecord) => void>();
  public cancelReservationCallback = input<(item: UIItem, borrowRecord: UIBorrowRecord) => void>();

  protected UIBorrowRecordStatus = UIBorrowRecordStatus;

  constructor(
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.currentItem.set(this.item());
    this.currentBorrowRecord.set(this.borrowRecord());
  }

  protected readonly status = computed(() => {
    return getBorrowRecordStatus(this.currentBorrowRecord()!);
  });
  protected readonly statusIcon = computed(() => {
    switch (this.status()) {
      case UIBorrowRecordStatus.Impossible:
        return '@tui.x';
      case UIBorrowRecordStatus.Reserved:
        return '@tui.clock';
      case UIBorrowRecordStatus.ReadyToPickup:
        return '/borrow.png';
      case UIBorrowRecordStatus.CurrentlyBorrowed:
        return '/borrow.png';
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
    const status = this.status();
    return this.translate.instant(`borrowRecordCard.status.${status.toLowerCase()}`);
  });
  protected readonly borrowDuration = computed(() => {
    return getBorrowDurationInDays(this.currentBorrowRecord()!);
  });
  protected readonly lateDuration = computed(() => {
    return getLateDurationInDays(this.currentBorrowRecord()!);
  });

  public pickUpItem() {
    if (this.pickUpItemCallback()) {
      this.pickUpItemCallback()!(this.currentItem()!, this.currentBorrowRecord()!);
    }
  }

  public returnItem() {
    if (this.returnItemCallback()) {
      this.returnItemCallback()!(this.currentItem()!, this.currentBorrowRecord()!);
    }
  }

  public cancelReservation() {
    if (this.cancelReservationCallback()) {
      this.cancelReservationCallback()!(this.currentItem()!, this.currentBorrowRecord()!);
    }
  }
}
