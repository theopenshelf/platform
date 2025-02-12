import { CommonModule } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TuiAutoColorPipe, TuiButton, TuiIcon, TuiInitialsPipe, TuiTextfield } from '@taiga-ui/core';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TuiHint } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { BorrowRecordTimelineComponent } from "../../../../components/borrow-record-timeline/borrow-record-timeline.component";
import { UserAvatarComponent } from '../../../../components/user-avatar/user-avatar.component';
import { getBorrowDurationInDays, getLateDurationInDays, UIBorrowRecord } from '../../../../models/UIBorrowRecord';
import { getStatusIcon, UIBorrowDetailedStatus } from '../../../../models/UIBorrowStatus';
import { UIItem } from '../../../../models/UIItem';
import { UILibrary } from '../../../../models/UILibrary';
import { UIUser } from '../../../../models/UIUser';

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

  public cancelReservation() {
    if (this.cancelReservationCallback()) {
      this.cancelReservationCallback()!(this.currentItem()!, this.currentBorrowRecord()!);
    }
  }
}
