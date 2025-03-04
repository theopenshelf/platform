/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { ConfigService } from './app/services/config.service';

async function bootstrap() {
  await ConfigService.initialize();
  await bootstrapApplication(AppComponent, appConfig).catch((err) =>
    console.error(err),
  );
}

bootstrap();