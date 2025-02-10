import { Injectable } from '@angular/core';
import { TuiDayRange } from '@taiga-ui/cdk';
import { TuiAlertService, TuiDialogService } from '@taiga-ui/core';

import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, switchMap, tap } from 'rxjs';
import { UIBorrowRecord } from '../../portal/community/models/UIBorrowRecord';
import { UIItem } from '../../portal/community/models/UIItem';
import { UILibrary } from '../../portal/community/models/UILibrary';
import { UIUser } from '../../portal/community/models/UIUser';
import { EventService, TosEventType } from '../../portal/community/services/event.service';
import { ItemsService } from '../../portal/community/services/items.service';
import { UserInfo } from '../../services/auth.service';
import { BorrowDialogPopoverService } from './borrow-dialog-popover.service';
import { CallToActionType } from './prompt-options';


@Injectable({
    providedIn: 'root'
})
export class BorrowDialogService {

    constructor(
        private alerts: TuiAlertService,
        private translate: TranslateService,
        private router: Router,
        private dialogs: TuiDialogService,
        private eventService: EventService,
        private popoverService: BorrowDialogPopoverService
    ) { }

    borrowNowDialog(
        user: UserInfo,
        isItemAdmin: boolean,
        item: UIItem,
        library: UILibrary,
        itemsService: ItemsService
    ) {
        return this.popoverService
            .open<any>(null, {
                type: CallToActionType.Reserve,
                borrowNow: true,
                item: item,
                currentUser: user,
                confirmationEnabled: library.requiresApproval,
                description: this.translate.instant('borrowDialog.description.reserve'),
                cancelButtonLabel: 'borrowDialog.cancel.reserve',
                confirmButtonLabel: 'borrowDialog.confirm.reserve',
                isItemAdmin: isItemAdmin,
            })
            .pipe(
                switchMap((response) => {
                    if (response.action === 'confirm') {
                        return this.borrowItemConfirmation(item, response.selectedDate!, response.selectedUser, itemsService);
                    }
                    return EMPTY;
                })
            );
    }

    public borrowItemConfirmation(
        item: UIItem,
        selectedDate: TuiDayRange,
        selectedUser: UIUser | undefined,
        itemsService: ItemsService,
    ) {
        return itemsService
            .borrowItem(
                item,
                selectedDate.from
                    .toLocalNativeDate()
                    .toISOString()
                    .split('T')[0] ?? '',
                selectedDate.to
                    .toLocalNativeDate()
                    .toISOString()
                    .split('T')[0] ?? '',
                selectedUser
            )
            .pipe(
                tap((item) => {
                    this.alerts
                        .open(
                            this.translate.instant('item.borrowSuccess', {
                                itemName: item.name,
                                startDate: selectedDate.from.toLocalNativeDate().toLocaleDateString(this.translate.currentLang, { day: 'numeric', month: 'short', year: 'numeric' }),
                                endDate: selectedDate.to.toLocalNativeDate().toLocaleDateString(this.translate.currentLang, { day: 'numeric', month: 'short', year: 'numeric' }),
                            }),
                            { appearance: 'positive' },
                        )
                        .subscribe();
                }),
            )
    }

    public reserveItemWithPreselectedDate(
        user: UserInfo,
        selectedDate: TuiDayRange,
        item: UIItem,
        itemsService: ItemsService,
        library: UILibrary
    ) {

        return this.popoverService
            .open<any>(null, {
                type: CallToActionType.Reserve,
                borrowNow: false,
                currentUser: user,
                alreadySelectedDate: true,
                confirmationEnabled: library.requiresApproval,
                item: item,
                description: this.translate.instant('item.confirmBorrowContent', {
                    itemName: item.name,
                    startDate: selectedDate.from.toLocalNativeDate().toLocaleDateString(this.translate.currentLang, { day: 'numeric', month: 'short', year: 'numeric' }),
                    endDate: selectedDate.to.toLocalNativeDate().toLocaleDateString(this.translate.currentLang, { day: 'numeric', month: 'short', year: 'numeric' }),
                }),
                cancelButtonLabel: 'borrowDialog.cancel.reserve',
                confirmButtonLabel: 'borrowDialog.confirm.reserve',
            })
            .pipe(
                switchMap((response) => {
                    if (response.action === 'confirm') {
                        return this.borrowItemConfirmation(item, response.selectedDate!, response.selectedUser, itemsService);
                    }
                    return EMPTY;
                }));
    }


    public reserveItem(
        user: UserInfo,

        isItemAdmin: boolean,
        item: UIItem,
        itemsService: ItemsService,
        library: UILibrary
    ) {

        return this.popoverService
            .open<any>(null, {
                type: CallToActionType.Reserve,
                borrowNow: false,
                currentUser: user,
                confirmationEnabled: library.requiresApproval,
                item: item,
                description: this.translate.instant('item.confirmBorrowContent', {
                    itemName: item.name,
                }),
                cancelButtonLabel: 'borrowDialog.cancel.reserve',
                confirmButtonLabel: 'borrowDialog.confirm.reserve',
                isItemAdmin: isItemAdmin,
            })
            .pipe(
                switchMap((response) => {
                    if (response.action === 'confirm') {
                        return this.borrowItemConfirmation(item, response.selectedDate!, response.selectedUser, itemsService);
                    }
                    return EMPTY;
                }));
    }


    public pickUpItem(
        borrowRecord: UIBorrowRecord,
        item: UIItem,
        itemsService: ItemsService,
        library: UILibrary
    ) {
        const endDate = borrowRecord.endDate.toLocaleDateString(this.translate.currentLang, { day: 'numeric', month: 'short', year: 'numeric' });
        return this.popoverService
            .open<any>(null, {
                type: CallToActionType.Pickup,
                item: item,
                confirmationEnabled: library.requiresApproval,
                description: this.translate.instant('item.pickUpContent', { itemName: item.name, endDate }),
                cancelButtonLabel: 'borrowDialog.cancel.pickup',
                confirmButtonLabel: 'borrowDialog.confirm.pickup',
            })
            .pipe(
                switchMap((response) => {
                    if (response.action === 'confirm') {
                        return itemsService
                            .pickupItem(item, borrowRecord)
                            .pipe(
                                tap((returnedItem) => {
                                    this.eventService.publishEvent(TosEventType.BorrowRecordsChanged);
                                    this.alerts.open(this.translate.instant('item.pickUpSuccess'), {
                                        appearance: 'success',
                                    }).subscribe();
                                })
                            );
                    }
                    return EMPTY;
                }),
            );
    }

    public returnItem(
        borrowRecord: UIBorrowRecord,
        item: UIItem,
        itemsService: ItemsService,
        library: UILibrary
    ) {
        const endDate = borrowRecord.endDate.toLocaleDateString(this.translate.currentLang, { day: 'numeric', month: 'short', year: 'numeric' });
        return this.popoverService
            .open<any>(null, {
                type: CallToActionType.Return,
                item: item,
                confirmationEnabled: library.requiresApproval,
                description: this.translate.instant('item.returnContent', { itemName: item.name, endDate }),
                cancelButtonLabel: 'borrowDialog.cancel.return',
                confirmButtonLabel: 'borrowDialog.confirm.return',
            })
            .pipe(
                switchMap((response) => {
                    if (response.action === 'confirm') {
                        return itemsService.returnItem(item, borrowRecord).pipe(
                            tap((returnedItem) => {
                                this.eventService.publishEvent(TosEventType.BorrowRecordsChanged);
                                this.alerts.open(this.translate.instant('item.returnSuccess'), {
                                    appearance: 'success',
                                }).subscribe();
                            })
                        );
                    }
                    return EMPTY;
                }),
            );
    }

    public cancelReservation(borrowRecord: UIBorrowRecord, item: UIItem, itemsService: ItemsService) {
        if (borrowRecord) {
            const startDate = borrowRecord.startDate.toLocaleDateString(this.translate.currentLang, { day: 'numeric', month: 'short', year: 'numeric' });
            const endDate = borrowRecord.endDate.toLocaleDateString(this.translate.currentLang, { day: 'numeric', month: 'short', year: 'numeric' });

            return this.popoverService
                .open<any>(null, {
                    type: CallToActionType.Cancel,
                    item: item,
                    description: this.translate.instant('item.cancelReservationContent', { itemName: item.name, startDate, endDate }),
                    cancelButtonLabel: 'borrowDialog.cancel.cancel',
                    confirmButtonLabel: 'borrowDialog.confirm.cancel',
                })
                .pipe(
                    switchMap((response) => {
                        if (response.action === 'confirm') {
                            return itemsService
                                .cancelReservation(item, borrowRecord)
                                .pipe(
                                    tap((returnedItem) => {
                                        this.eventService.publishEvent(TosEventType.BorrowRecordsChanged);
                                        this.alerts.open(this.translate.instant('item.reservationCancelled'), {
                                            appearance: 'success',
                                        }).subscribe();
                                    })
                                );
                        }
                        return EMPTY;
                    }),
                );
        }
        return EMPTY;
    }


}
