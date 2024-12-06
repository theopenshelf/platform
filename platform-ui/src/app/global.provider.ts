// global-providers.ts
import { InjectionToken, Provider } from '@angular/core';
import { environment } from '../environments/environment';
import { NotificationsService } from './services/notifications.service';
import { MockNotificationsService } from './services/mock/notifications.service';
import { AuthService } from './services/auth.service';
import { MockAuthService } from './services/mock/auth.service';


export const NOTIFICATIONS_SERVICE_TOKEN = new InjectionToken<NotificationsService>('NotificationsService');
export const AUTH_SERVICE_TOKEN = new InjectionToken<AuthService>('AuthService');

export const globalProviders: Provider[] = [
    {
        provide: AUTH_SERVICE_TOKEN,
        useExisting: MockAuthService,
    },
    {
        provide: NOTIFICATIONS_SERVICE_TOKEN,
        useExisting: MockNotificationsService,
    }
];