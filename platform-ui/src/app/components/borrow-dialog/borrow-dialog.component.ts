import { NgForOf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TuiDay, TuiDayRange, type TuiPopover } from '@taiga-ui/cdk';
import { TuiButton, TuiDialogCloseService, TuiIcon } from '@taiga-ui/core';
import { TuiConnected, TuiStepper } from '@taiga-ui/kit';
import { TuiDayRangePeriod } from '@taiga-ui/kit/components/calendar-range';
import { TuiInputDateRangeModule } from '@taiga-ui/legacy';
import {
  injectContext,
  PolymorpheusOutlet,
  PolymorpheusTemplate,
} from '@taiga-ui/polymorpheus';
import { TimelineComponent, TimelineItem } from '../timeline/timeline.component';
import { CallToActionType, PromptOptions, PromptResponse } from './prompt-options';

@Component({
  imports: [
    PolymorpheusOutlet,
    PolymorpheusTemplate,
    TuiButton,
    TuiInputDateRangeModule,
    TranslateModule,
    ReactiveFormsModule,
    NgForOf,
    TuiConnected,
    TuiStepper,
    TimelineComponent,
    TuiIcon,
  ],

  selector: 'borrow-dialog',
  templateUrl: './borrow-dialog.component.html',
  styleUrls: ['./borrow-dialog.component.scss'],
  providers: [TuiDialogCloseService],
})
export class BorrowDialogComponent {
  protected readonly context = injectContext<TuiPopover<PromptOptions, PromptResponse>>();

  protected suggestedDates: TuiDayRangePeriod[] = [];
  private readonly today = TuiDay.currentLocal();
  public readonly control = new FormControl();


  // Here you get options + content + id + observer
  constructor(private translate: TranslateService) {
    // Close on click outside/Escape button
    inject(TuiDialogCloseService)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.context.$implicit.complete());


    this.suggestedDates = [
      new TuiDayRangePeriod(
        new TuiDayRange(this.today, this.today),
        this.translate.instant('item.dateRanges.today'),
        ({ $implicit }) => `${this.translate.instant('item.dateRanges.today')} (${$implicit.from})`,
      ),
      new TuiDayRangePeriod(
        new TuiDayRange(this.today, this.today.append({ day: 2 })),
        this.translate.instant('item.dateRanges.twoDays'),
        ({ $implicit }) => `${this.translate.instant('item.dateRanges.twoDays')} (${$implicit.from})`,
      ),
      new TuiDayRangePeriod(
        new TuiDayRange(this.today, this.today.append({ day: 3 })),
        this.translate.instant('item.dateRanges.threeDays'),
        ({ $implicit }) => `${this.translate.instant('item.dateRanges.threeDays')} (${$implicit.from})`,
      ),
      new TuiDayRangePeriod(
        new TuiDayRange(this.today, this.today.append({ day: 7 })),
        this.translate.instant('item.dateRanges.oneWeek'),
        ({ $implicit }) => `${this.translate.instant('item.dateRanges.oneWeek')} (${$implicit.from})`,
      ),
      new TuiDayRangePeriod(
        new TuiDayRange(this.today, this.today.append({ day: 14 })),
        this.translate.instant('item.dateRanges.twoWeeks'),
        ({ $implicit }) => `${this.translate.instant('item.dateRanges.twoWeeks')} (${$implicit.from})`,
      ),
    ]
    this.control.setValue(new TuiDayRange(this.today, this.today));
  }

  protected timelineItems(): TimelineItem[] {
    let timelineItems: TimelineItem[] = [];

    let lineColorActive = true;
    timelineItems.push(
      {
        label: "",
        position: 'left',
        dotColor: this.context.type === CallToActionType.Reserve ? 'accent' : 'primary',
        lineColor: lineColorActive ? 'accent' : 'primary',
        lastItem: false,
        items: [
          {
            icon: '@tui.calendar',
            title: this.translate.instant('borrowDialog.title.reserve'),
          }
        ]
      },
    );
    lineColorActive = lineColorActive && this.context.type !== CallToActionType.Reserve;

    if (this.context.confirmationEnabled) {
      timelineItems.push(
        {
          label: "",
          position: 'left',
          dotColor: this.context.type === CallToActionType.ReserveConfirm ? 'accent' : 'primary',
          lineColor: lineColorActive ? 'accent' : 'primary',
          lastItem: false,
          items: [
            {
              icon: '@tui.stamp',
              title: this.translate.instant('borrowDialog.title.reserveConfirm'),
            }
          ]
        },
      );
      lineColorActive = lineColorActive && this.context.type !== CallToActionType.Reserve;
    }

    timelineItems.push(
      {
        label: "",
        position: 'left',
        dotColor: this.context.type === CallToActionType.Pickup ? 'accent' : 'primary',
        lineColor: lineColorActive ? 'accent' : 'primary',
        lastItem: false,
        items: [
          {
            icon: '/borrow.png',
            title: this.translate.instant('borrowDialog.title.pickup'),
          }
        ]
      },
    );
    lineColorActive = lineColorActive && this.context.type !== CallToActionType.Pickup;

    if (this.context.confirmationEnabled) {
      timelineItems.push(
        {
          label: "",
          position: 'left',
          dotColor: this.context.type === CallToActionType.PickupConfirm ? 'accent' : 'primary',
          lineColor: lineColorActive ? 'accent' : 'primary',
          lastItem: false,
          items: [
            {
              icon: '/borrow.png',
              title: this.translate.instant('borrowDialog.title.pickup'),
            }
          ]
        },
      );
      lineColorActive = lineColorActive && this.context.type !== CallToActionType.Pickup;
    }

    timelineItems.push(
      {
        label: "",
        position: 'left',
        dotColor: this.context.type === CallToActionType.Return ? 'accent' : 'primary',
        lineColor: lineColorActive ? 'accent' : 'primary',
        lastItem: !this.context.confirmationEnabled,
        items: [
          {
            icon: '/returnItem.png',
            title: this.translate.instant('borrowDialog.title.return'),
          }
        ]
      },
    );
    lineColorActive = lineColorActive && this.context.type !== CallToActionType.Return;

    if (this.context.confirmationEnabled) {
      timelineItems.push(
        {
          label: "",
          position: 'left',
          dotColor: this.context.type === CallToActionType.ReturnConfirm ? 'accent' : 'primary',
          lineColor: lineColorActive ? 'accent' : 'primary',
          lastItem: true,
          items: [
            {
              icon: '/returnItem.png',
              title: this.translate.instant('borrowDialog.title.return'),
            }
          ]
        },
      );
      lineColorActive = lineColorActive && this.context.type !== CallToActionType.Return;
    }
    return timelineItems;
  };

  protected confirm(): void {
    this.context.completeWith({
      action: 'confirm',
      selectedDate: this.control.value,
    });
  }

  protected cancel(): void {
    this.context.completeWith({
      action: 'cancel',
      selectedDate: new TuiDayRange(this.today, this.today),
    });
  }
}
