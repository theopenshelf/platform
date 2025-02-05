import { Injectable } from '@angular/core';
import { TuiDayRange, TuiPopoverService } from '@taiga-ui/cdk';
import { TUI_DIALOGS, TuiAlertService, TuiDialogService } from '@taiga-ui/core';

import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TUI_CONFIRM } from '@taiga-ui/kit';
import { PolymorpheusContent } from '@taiga-ui/polymorpheus';
import { EMPTY, switchMap, tap } from 'rxjs';
import { UIBorrowRecord } from '../../portal/community/models/UIBorrowRecord';
import { UIItem } from '../../portal/community/models/UIItem';
import { ItemsService } from '../../portal/community/services/items.service';
import { BorrowDialogComponent } from './borrow-dialog.component';
import type { PromptOptions } from './prompt-options';


@Injectable({
    providedIn: 'root'
})
export class BorrowDialogService extends TuiPopoverService<PromptOptions, boolean> {

    constructor(
        private alerts: TuiAlertService,
        private translate: TranslateService,
        private router: Router,
        private dialogs: TuiDialogService,
    ) {
        super(TUI_DIALOGS, BorrowDialogComponent, {
            heading: 'Are you sure?',
            buttons: ['Yes', 'No'],
        });
    }

    borrowNowDialog(
        choose: PolymorpheusContent,
        item: UIItem,
        itemsService: ItemsService
    ): void {
        this
            .open<any>(choose, {
                heading: this.translate.instant('item.borrowLabel', { itemName: item?.name }),
                buttons: ['Absolutely!', 'No way!'],
            })

            .subscribe((response: any) => {
                if (response.type === 'confirm') {
                    this.borrowItemConfirmation(item, response.value, itemsService);
                }
            });
    }

    public borrowItemConfirmation(item: UIItem, selectedDate: TuiDayRange, itemsService: ItemsService): void {
        itemsService
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
                    this.router.navigate(['/community/borrowed-items'], { queryParams: { selectedStatus: 'reserved' } });
                }),
            )
            .subscribe();
    }



    pickUpItem(borrowRecord: UIBorrowRecord, item: UIItem, itemsService: ItemsService) {
        const endDate = borrowRecord.endDate.toLocaleDateString(this.translate.currentLang, { day: 'numeric', month: 'short', year: 'numeric' });
        return this.dialogs
            .open<boolean>(TUI_CONFIRM, {
                label: this.translate.instant('item.pickUpLabel', { itemName: item.name }),
                size: 'm',
                data: {
                    content: this.translate.instant('item.pickUpContent', { itemName: item.name, endDate }),
                    yes: this.translate.instant('item.yesPickUp'),
                    no: this.translate.instant('item.noPickUp'),
                },
            })
            .pipe(
                switchMap((response) => {
                    if (response) {
                        return itemsService
                            .pickupItem(item, borrowRecord)
                            .pipe(
                                tap((returnedItem) => {
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

    returnItem(borrowRecord: UIBorrowRecord, item: UIItem, itemsService: ItemsService) {
        const endDate = borrowRecord.endDate.toLocaleDateString(this.translate.currentLang, { day: 'numeric', month: 'short', year: 'numeric' });
        return this.dialogs
            .open<boolean>(TUI_CONFIRM, {
                label: this.translate.instant('item.returnLabel', { itemName: item.name }),
                size: 'm',
                data: {
                    content: this.translate.instant('item.returnContent', { itemName: item.name, endDate }),
                    yes: this.translate.instant('item.yesReturn'),
                    no: this.translate.instant('item.noReturn'),
                },
            })
            .pipe(
                switchMap((response) => {
                    if (response) {
                        return itemsService.returnItem(item, borrowRecord).pipe(
                            tap((returnedItem) => {
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

    cancelReservation(borrowRecord: UIBorrowRecord, item: UIItem, itemsService: ItemsService) {
        if (borrowRecord) {
            const startDate = borrowRecord.startDate.toLocaleDateString(this.translate.currentLang, { day: 'numeric', month: 'short', year: 'numeric' });
            const endDate = borrowRecord.endDate.toLocaleDateString(this.translate.currentLang, { day: 'numeric', month: 'short', year: 'numeric' });

            return this.dialogs
                .open<boolean>(TUI_CONFIRM, {
                    label: this.translate.instant('item.cancelReservationLabel', { itemName: item.name }),
                    size: 'm',
                    data: {
                        content: this.translate.instant('item.cancelReservationContent', { itemName: item.name, startDate, endDate }),
                        yes: this.translate.instant('item.yesCancel'),
                        no: this.translate.instant('item.keepReservation'),
                    },
                })
                .pipe(
                    switchMap((response) => {
                        if (response) {
                            return itemsService
                                .cancelReservation(item, borrowRecord)
                                .pipe(
                                    tap((returnedItem) => {
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
