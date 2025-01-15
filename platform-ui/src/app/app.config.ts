import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig,
} from '@angular/router';
import { NG_EVENT_PLUGINS } from '@taiga-ui/event-plugins';

import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { environment } from '../environments/environment';
import { BASE_PATH } from './api-client';
import { routes } from './app.routes';
import { globalProviders } from './global.provider';
import { ConfigService } from './services/config.service';

export const appConfig: ApplicationConfig = {
  providers: [
    ...globalProviders,
    { provide: BASE_PATH, useValue: environment.API_BASE_PATH },
    provideAnimations(),
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({
        paramsInheritanceStrategy: 'always',
      }),
    ),
    NG_EVENT_PLUGINS,
    provideAnimationsAsync(),
    {
      provide: APP_INITIALIZER,
      useFactory: (configService: ConfigService) => {
        return () => configService.loadConfig();
      },
      deps: [ConfigService],
      multi: true,
    },
  ],
};
