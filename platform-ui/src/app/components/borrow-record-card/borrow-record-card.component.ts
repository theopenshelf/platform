import { CommonModule } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TuiHint } from '@taiga-ui/core';
import { getBorrowDurationInDays, getLateDurationInDays, UIBorrowRecord } from '../../models/UIBorrowRecord';
import { getStatusIcon, UIBorrowDetailedStatus } from '../../models/UIBorrowStatus';
import { UIItem } from '../../models/UIItem';
import { UILibrary } from '../../models/UILibrary';
import { UIUser } from '../../models/UIUser';
import { BorrowRecordTimelineComponent } from "../borrow-record-timeline/borrow-record-timeline.component";
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';

@Component({
  selector: 'borrow-record-card',
  imports: [
    TuiHint,
    TuiIcon,
    RouterLink,
    CommonModule,
    FormsModule,
    TuiTextfield,
    BorrowRecordTimelineComponent,
    TranslateModule,
    TuiButton,
    UserAvatarComponent,
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
  public reserveConfirmationCallback = input<(item: UIItem, borrowRecord: UIBorrowRecord) => void>();
  public pickupConfirmationCallback = input<(item: UIItem, borrowRecord: UIBorrowRecord) => void>();
  public returnConfirmationCallback = input<(item: UIItem, borrowRecord: UIBorrowRecord) => void>();
  protected UIBorrowDetailedStatus = UIBorrowDetailedStatus;

  constructor(
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.currentItem.set(this.item());
    this.currentBorrowRecord.set(this.borrowRecord());
  }

  protected readonly status = computed(() => {
    return this.currentBorrowRecord()!.status;
  });
  protected readonly statusIcon = computed(() => {
    return getStatusIcon(this.status());
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

  public reserveConfirmation() {
    if (this.reserveConfirmationCallback()) {
      this.reserveConfirmationCallback()!(this.currentItem()!, this.currentBorrowRecord()!);
    }
  }

  public pickupConfirmation() {
    if (this.pickupConfirmationCallback()) {
      this.pickupConfirmationCallback()!(this.currentItem()!, this.currentBorrowRecord()!);
    }
  }

  public returnConfirmation() {
    if (this.returnConfirmationCallback()) {
      this.returnConfirmationCallback()!(this.currentItem()!, this.currentBorrowRecord()!);
    }
  }

  public cancelReservation() {
    if (this.cancelReservationCallback()) {
      this.cancelReservationCallback()!(this.currentItem()!, this.currentBorrowRecord()!);
    }
  }
}
