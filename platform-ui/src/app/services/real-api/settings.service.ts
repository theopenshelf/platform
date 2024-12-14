import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SettingsPublicApiService } from '../../api-client';
import { PublicSettingsService, UIPublicSettings } from '../settings.service';


@Injectable({
  providedIn: 'root',
})
export class APIPublicSettingsService implements PublicSettingsService {

  constructor(private settingsPublicApiService: SettingsPublicApiService) {

  }

  getPublicSettings(): Observable<UIPublicSettings> {
    return this.settingsPublicApiService.getPublicSettings().pipe(
      map(response => {
        return {
          ...response,
          isRegistrationEnabled: response.isRegistrationEnabled ?? false
        } as UIPublicSettings;
      })
    );
  }
}