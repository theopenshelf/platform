import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TuiDay, TuiDayRange, type TuiPopover } from '@taiga-ui/cdk';
import { TuiButton, TuiDialogCloseService } from '@taiga-ui/core';
import { TuiDayRangePeriod } from '@taiga-ui/kit/components/calendar-range';
import { TuiInputDateRangeModule } from '@taiga-ui/legacy';
import {
  injectContext,
  PolymorpheusOutlet,
  PolymorpheusTemplate,
} from '@taiga-ui/polymorpheus';
import { PromptOptions } from './prompt-options';

@Component({
  imports: [
    PolymorpheusOutlet,
    PolymorpheusTemplate,
    TuiButton,
    TuiInputDateRangeModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  selector: 'borrow-dialog',
  templateUrl: './borrow-dialog.component.html',
  styleUrls: ['./borrow-dialog.component.scss'],
  providers: [TuiDialogCloseService],
})
export class BorrowDialogComponent {
  protected readonly context = injectContext<TuiPopover<PromptOptions, boolean>>();

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

  protected onClick(response: any): void {
    this.context.completeWith(response);
  }
}