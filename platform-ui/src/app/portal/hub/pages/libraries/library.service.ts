import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UILibrary } from '../../../../models/UILibrary';

@Injectable({
    providedIn: 'root'
})
export class LibraryStateService {
    private librarySubject = new BehaviorSubject<UILibrary | null>(null);
    library$ = this.librarySubject.asObservable();

    setLibrary(library: UILibrary) {
        this.librarySubject.next(library);
    }
} 