import { Observable } from 'rxjs';

export interface UIPublicSettings {
  isRegistrationEnabled: boolean;
}

export interface PublicSettingsService {
  getPublicSettings(): Observable<UIPublicSettings>;
}
