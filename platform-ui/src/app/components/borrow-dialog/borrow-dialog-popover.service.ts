import { Injectable } from '@angular/core';
import { TuiPopoverService } from '@taiga-ui/cdk';

import { TUI_DIALOGS } from '@taiga-ui/core';
import { BorrowDialogComponent } from './borrow-dialog.component';
import { CallToActionType, PromptResponse, type PromptOptions } from './prompt-options';


@Injectable({
    providedIn: 'root',
    useFactory: () =>
        new BorrowDialogPopoverService(TUI_DIALOGS, BorrowDialogComponent, {
            type: CallToActionType.Reserve,
            description: "",
            cancelButtonLabel: "borrowDialog.cancelButtonLabel",
            confirmButtonLabel: "borrowDialog.confirmButtonLabel",
        }),
})
export class BorrowDialogPopoverService extends TuiPopoverService<PromptOptions, PromptResponse> {
}