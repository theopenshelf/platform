import { NG_EVENT_PLUGINS } from "@taiga-ui/event-plugins";
import { provideAnimations } from "@angular/platform-browser/animations";
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BASE_PATH } from "./api-client";
import { environment } from "../environments/environment";
import { provideHttpClient } from "@angular/common/http";
import { globalProviders } from "./global.provider";

export const appConfig: ApplicationConfig = {
  providers: [
      ...globalProviders,
    { provide: BASE_PATH, useValue: environment.API_BASE_PATH },
    provideAnimations(), 
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    NG_EVENT_PLUGINS, 
    provideAnimationsAsync()]
};
