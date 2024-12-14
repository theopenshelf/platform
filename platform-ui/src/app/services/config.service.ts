// src/app/services/config.service.ts
import { Inject, Injectable } from '@angular/core';
import { PUBLIC_SETTINGS_SERVICE_TOKEN } from '../global.provider';
import { PublicSettingsService } from './settings.service';

export interface UISettings {
    isRegistrationEnabled: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class ConfigService {
    constructor(
        @Inject(PUBLIC_SETTINGS_SERVICE_TOKEN) private publicSettingsService: PublicSettingsService
    ) { }

    private settings: UISettings = { isRegistrationEnabled: true };

    loadConfig() {
        this.publicSettingsService.getPublicSettings()
            .subscribe((settings) => {
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