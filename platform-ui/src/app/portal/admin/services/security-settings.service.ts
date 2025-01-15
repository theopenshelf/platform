import { Observable } from 'rxjs';

export interface UISecuritySettings {
  isRegistrationEnabled: boolean;
}

export interface SecuritySettingsService {
  getSecuritySettings(): Observable<UISecuritySettings>;
  saveSecuritySettings(
    settings: UISecuritySettings,
  ): Observable<UISecuritySettings>;
}
