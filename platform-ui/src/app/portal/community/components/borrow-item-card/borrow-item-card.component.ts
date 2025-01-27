import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
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

}
