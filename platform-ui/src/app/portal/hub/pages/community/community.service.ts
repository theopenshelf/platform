import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UICommunity } from '../../../../models/UICommunity';

@Injectable({
    providedIn: 'root'
})
export class CommunityStateService {
    private communitySubject = new BehaviorSubject<UICommunity | null>(null);
    community$ = this.communitySubject.asObservable();

    setCommunity(community: UICommunity) {
        this.communitySubject.next(community);
    }
} 