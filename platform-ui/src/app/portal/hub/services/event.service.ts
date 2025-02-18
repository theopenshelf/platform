import { Injectable, signal } from '@angular/core';

export enum TosEventType {
    BorrowRecordsChanged = 'borrowRecordsChanged',
    NotificationsChanged = 'notificationsChanged'
}

@Injectable({
    providedIn: 'root'
})
export class EventService {
    private eventSignal = signal<TosEventType | null>(null); // Replace `string` with your actual event type

    publishEvent(event: TosEventType) {
        this.eventSignal.set(event);
    }

    get event() {
        return this.eventSignal;
    }

    clearEvent() {
        this.eventSignal.set(null);
    }
}