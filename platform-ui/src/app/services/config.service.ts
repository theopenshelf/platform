// src/app/services/config.service.ts
import { Inject, Injectable } from '@angular/core';
import configJson from '../../assets/config.json';
import { environment } from '../../environments/environment';
import { PUBLIC_SETTINGS_SERVICE_TOKEN } from '../global.provider';
import { PublicSettingsService } from './settings.service';

export interface UISettings {
  isRegistrationEnabled: boolean;
}

export interface AppConfig {
  API_BASE_PATH: string;
  useMockApi: boolean;
  demoMode: boolean;
  defaultLocale: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor(
    @Inject(PUBLIC_SETTINGS_SERVICE_TOKEN)
    private publicSettingsService: PublicSettingsService,
  ) { }

  private settings: UISettings = { isRegistrationEnabled: true };
  private static config: AppConfig = {
    ...environment
  };

  static async initialize(): Promise<void> {
    console.log('ConfigService: Starting initialization...');

    // Start with environment values
    ConfigService.config = { ...environment };
    console.log('ConfigService: Loaded environment values:', ConfigService.config);

    try {
      // Override with config.json
      console.log('ConfigService: Attempting to load config.json...');
      ConfigService.config = { ...ConfigService.config, ...configJson };
      console.log('ConfigService: Successfully merged config.json:', ConfigService.config);
    } catch (e) {
      console.warn('ConfigService: No config.json found or error loading it:', e);
      console.log('ConfigService: Using environment defaults:', ConfigService.config);
    }

    console.log('ConfigService: Initialization complete');
  }

  static get configuration(): AppConfig {
    return ConfigService.config;
  }

  loadConfig() {
    this.publicSettingsService.getPublicSettings().subscribe((settings) => {
      if (settings) {
        this.settings = settings;
      }
    });
  }

  setSettings(config: UISettings) {
    this.settings = config;
  }

  getSettings(): UISettings {
    return this.settings;
  }

  isRegistrationEnabled(): boolean {
    return this.settings.isRegistrationEnabled;
  }
}
