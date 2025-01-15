import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PublicSettingsService, UIPublicSettings } from '../settings.service';

@Injectable({
  providedIn: 'root',
})
export class MockPublicSettingsService implements PublicSettingsService {
  getPublicSettings(): Observable<UIPublicSettings> {
    return of({ isRegistrationEnabled: true });
  }
}
