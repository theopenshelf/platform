import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TuiDay, TuiDayRange, TuiLet, type TuiPopover } from '@taiga-ui/cdk';
import { TuiAutoColorPipe, TuiButton, TuiDataList, TuiDialogCloseService, TuiIcon, TuiInitialsPipe, TuiLoader } from '@taiga-ui/core';
import { TuiAvatar, TuiStepper } from '@taiga-ui/kit';
import { TuiDayRangePeriod } from '@taiga-ui/kit/components/calendar-range';
import { TuiComboBoxModule, TuiInputDateRangeModule, TuiInputModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import {
  injectContext
} from '@taiga-ui/polymorpheus';
import { BehaviorSubject, debounceTime, distinctUntilChanged, map, Observable, shareReplay, switchMap } from 'rxjs';
import { UIUser } from '../../models/UIUser';
import { BorrowItemCalendarComponent } from '../../portal/hub/components/borrow-item-calendar/borrow-item-calendar.component';
import { hubProviders, USERS_SERVICE_TOKEN } from '../../portal/hub/hub.provider';
import { UsersService } from '../../portal/hub/services/users.service';
import { TimelineComponent, TimelineItem } from '../timeline/timeline.component';
import { CallToActionType, PromptOptions, PromptResponse } from './prompt-options';



@Component({
  imports: [
    TuiButton,
    TuiInputDateRangeModule,
    TranslateModule,
    ReactiveFormsModule,
    NgForOf,
    TuiInputModule,
    TuiStepper,
    TimelineComponent,
    TuiIcon,
    BorrowItemCalendarComponent,
    TuiAvatar,
    TuiInitialsPipe,
    TuiAutoColorPipe,
    AsyncPipe,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    TuiAvatar,
    TuiComboBoxModule,
    TuiDataList,
    TuiInitialsPipe,
    TuiLet,
    TuiLoader,
    TuiTextfieldControllerModule,
  ],

  selector: 'borrow-dialog',
  templateUrl: './borrow-dialog.component.html',
  styleUrls: ['./borrow-dialog.component.scss'],
  providers: [...hubProviders, TuiDialogCloseService],
})
export class BorrowDialogComponent {
  protected readonly context = injectContext<TuiPopover<PromptOptions, PromptResponse>>();

  protected suggestedDates: TuiDayRangePeriod[] = [];
  private readonly today = TuiDay.currentLocal();
  public readonly dateControl = new FormControl();
  public readonly userSearchControl = new FormControl();
  protected readonly CallToActionType = CallToActionType;
  protected selectedDate: TuiDayRange | null | undefined;

  users: UIUser[] = [];

  private userMap: Map<string, UIUser> = new Map();

  private searchSubject = new BehaviorSubject<string>('');

  constructor(private translate: TranslateService,
    @Inject(USERS_SERVICE_TOKEN) private usersService: UsersService,
  ) {
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
    this.dateControl.setValue(new TuiDayRange(this.today, this.today));

    // Set up the search observable in constructor or ngOnInit
    this.searchUsers$ = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.usersService.findUser(term)),
      map(users => {
        this.userMap.clear();
        users.forEach(user => this.userMap.set(user.username, user));
        return users;
      }),
      shareReplay(1)
    );
  }

  // Create a property to hold the observable
  searchUsers$ = new Observable<UIUser[]>();

  // Update the search method to use the subject
  public searchUsers(): Observable<UIUser[]> {
    return this.searchUsers$;
  }

  // Handle search changes
  set search(value: string | null) {
    this.searchSubject.next(value || '');
  }

  get search(): string | null {
    return this.searchSubject.getValue();
  }

  protected timelineItems(): TimelineItem[] {
    let timelineItems: TimelineItem[] = [];

    let dotActive = true;
    let lineColorActive = this.context.type !== CallToActionType.Reserve;
    timelineItems.push(
      {
        label: "",
        position: 'left',
        dotColor: dotActive ? 'accent' : 'primary',
        lineColor: lineColorActive ? 'accent' : 'primary',
        active: this.context.type === CallToActionType.Reserve,
        lastItem: false,
        items: [
          {
            icon: '@tui.calendar',
            title: this.translate.instant('borrowDialog.title.reserve'),
          }
        ]
      },
    );

    dotActive = dotActive && this.context.type !== CallToActionType.Reserve;

    if (this.context.confirmationEnabled) {
      lineColorActive = lineColorActive && this.context.type !== CallToActionType.ReserveConfirm;
      timelineItems.push(
        {
          label: "",
          position: 'left',
          dotColor: dotActive ? 'accent' : 'primary',
          lineColor: lineColorActive ? 'accent' : 'primary',
          active: this.context.type === CallToActionType.ReserveConfirm,
          lastItem: false,
          items: [
            {
              icon: '@tui.stamp',
              title: this.translate.instant('borrowDialog.title.reserveConfirm'),
            }
          ]
        },
      );
      dotActive = dotActive && this.context.type !== CallToActionType.ReserveConfirm;
    }

    lineColorActive = lineColorActive && this.context.type !== CallToActionType.Pickup;
    timelineItems.push(
      {
        label: "",
        position: 'left',
        dotColor: dotActive ? 'accent' : 'primary',
        lineColor: lineColorActive ? 'accent' : 'primary',
        active: this.context.type === CallToActionType.Pickup,
        lastItem: false,
        items: [
          {
            icon: '/borrow.png',
            title: this.translate.instant('borrowDialog.title.pickup'),
          }
        ]
      },
    );
    dotActive = dotActive && this.context.type !== CallToActionType.Pickup;

    if (this.context.confirmationEnabled) {
      lineColorActive = lineColorActive && this.context.type !== CallToActionType.PickupConfirm;
      timelineItems.push(
        {
          label: "",
          position: 'left',
          dotColor: dotActive ? 'accent' : 'primary',
          lineColor: lineColorActive ? 'accent' : 'primary',
          active: this.context.type === CallToActionType.PickupConfirm,
          lastItem: false,
          items: [
            {
              icon: '@tui.stamp',
              title: this.translate.instant('borrowDialog.title.pickupConfirm'),
            }
          ]
        },
      );
      dotActive = dotActive && this.context.type !== CallToActionType.PickupConfirm;
    }

    lineColorActive = lineColorActive && this.context.type !== CallToActionType.Return;
    timelineItems.push(
      {
        label: "",
        position: 'left',
        dotColor: dotActive ? 'accent' : 'primary',
        lineColor: lineColorActive ? 'accent' : 'primary',
        active: this.context.type === CallToActionType.Return,
        lastItem: !this.context.confirmationEnabled,
        items: [
          {
            icon: '/returnItem.png',
            title: this.translate.instant('borrowDialog.title.return'),
          }
        ]
      },
    );
    dotActive = dotActive && this.context.type !== CallToActionType.Return;

    if (this.context.confirmationEnabled) {
      lineColorActive = lineColorActive && this.context.type !== CallToActionType.ReturnConfirm;
      timelineItems.push(
        {
          label: "",
          position: 'left',
          dotColor: dotActive ? 'accent' : 'primary',
          lineColor: lineColorActive ? 'accent' : 'primary',
          active: this.context.type === CallToActionType.ReturnConfirm,
          lastItem: true,
          items: [
            {
              icon: '@tui.stamp',
              title: this.translate.instant('borrowDialog.title.returnConfirm'),
            }
          ]
        },
      );
      dotActive = dotActive && this.context.type !== CallToActionType.ReturnConfirm;
    }
    return timelineItems;
  };

  protected confirm(): void {
    if (this.userSearchControl.value) {
      this.context.completeWith({
        action: 'confirm',
        selectedDate: this.selectedDate ?? this.dateControl.value,
        selectedUser: this.userMap.get(this.userSearchControl.value),
      });
    } else {
      this.context.completeWith({
        action: 'confirm',
        selectedDate: this.selectedDate ?? this.dateControl.value,
      });
    }
  }

  protected cancel(): void {
    this.context.completeWith({
      action: 'cancel',
      selectedDate: new TuiDayRange(this.today, this.today),
    });
  }
}
