import { TuiDayRange } from "@taiga-ui/cdk";
import { UIBorrowRecord } from "../../portal/community/models/UIBorrowRecord";
import { UIItem } from "../../portal/community/models/UIItem";
import { UserInfo } from "../../services/auth.service";


export enum CallToActionType {
    Reserve = 'reserve',
    ReserveConfirm = 'reserve-confirm',
    Return = 'return',
    ReturnConfirm = 'return-confirm',
    Pickup = 'pickup',
    PickupConfirm = 'pickup-confirm',
    Cancel = 'cancel',
}

export interface ActionStep {
    type: CallToActionType;
    icon: string;
    title: string;
    description: string;
}

export interface PromptOptions {
    readonly type: CallToActionType;
    readonly borrowNow?: boolean;
    readonly alreadySelectedDate?: boolean;
    readonly confirmationEnabled?: boolean;
    readonly item?: UIItem;
    readonly currentUser?: UserInfo;
    readonly borrowRecord?: UIBorrowRecord;
    readonly description: string;
    readonly cancelButtonLabel: string;
    readonly confirmButtonLabel: string;
}

export interface PromptResponse {
    readonly action: 'confirm' | 'cancel';
    readonly selectedDate?: TuiDayRange;
}