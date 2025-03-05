// src/app/services/config.service.ts
import { Inject, Injectable } from '@angular/core';
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
      // Load config.json from assets
      console.log('ConfigService: Attempting to fetch config.json from assets...');
      const response = await fetch('assets/config.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const configJson = await response.json();
      console.log('ConfigService: Successfully loaded config.json:', configJson);

      // Merge with environment values
      ConfigService.config = { ...ConfigService.config, ...configJson };
      console.log('ConfigService: Final configuration:', ConfigService.config);
    } catch (e) {
      console.warn('ConfigService: Error loading config.json:', e);
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
