import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig,
} from '@angular/router';
import { NG_EVENT_PLUGINS } from '@taiga-ui/event-plugins';

import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BASE_PATH, Configuration } from './api-client';
import { routes } from './app.routes';
import { AUTH_SERVICE_TOKEN, getGlobalProviders } from './global.provider';
import { errorInterceptor } from './interceptors/error.interceptor';
import { xhrInterceptor } from './interceptors/xhr.interceptor';
import { AuthService } from './services/auth.service';
import { ConfigService } from './services/config.service';

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, './i18n/', '.json');

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: () => async () => {
        console.log('APP_INITIALIZER: Starting ConfigService initialization...');
        await ConfigService.initialize();
        console.log('APP_INITIALIZER: ConfigService initialization complete');
      },
      multi: true,
      deps: []
    },
    {
      provide: Configuration,
      useValue: new Configuration({
        withCredentials: true
      })
    },
    {
      provide: BASE_PATH,
      useFactory: () => {
        console.log('BASE_PATH: Getting API path from config:', ConfigService.configuration.API_BASE_PATH);
        return ConfigService.configuration.API_BASE_PATH;
      },
      deps: []
    },
    ...getGlobalProviders(),
    {
      provide: APP_INITIALIZER,
      useFactory: (initializer: AuthService) => () => initializer.initializeSession(),
      deps: [AUTH_SERVICE_TOKEN],  // Use the injection token instead of the interface
      multi: true
    },
    provideAnimations(),
    provideHttpClient(
      withInterceptors([errorInterceptor, xhrInterceptor])
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({
        paramsInheritanceStrategy: 'always',
      }),
    ),
    importProvidersFrom([TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    })]),
    NG_EVENT_PLUGINS,
    provideAnimationsAsync(),
  ],
};
