import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiPlatform } from '@taiga-ui/cdk';
import { TuiButton } from '@taiga-ui/core';
import { TuiSwitch } from '@taiga-ui/kit';
import { SECURITY_SETTINGS_SERVICE_TOKEN } from '../../admin.providers';
import {
  SecuritySettingsService,
  UISecuritySettings,
} from '../../services/security-settings.service';

@Component({
  standalone: true,
  selector: 'app-security',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TuiButton,
    TuiPlatform,
    TuiSwitch,
  ],
  templateUrl: './security.component.html',
  styleUrl: './security.component.scss',
})
export class SecurityComponent {
  securitySettings: UISecuritySettings = { isRegistrationEnabled: false };

  constructor(
    @Inject(SECURITY_SETTINGS_SERVICE_TOKEN)
    private securitySettingsService: SecuritySettingsService,
  ) {
    this.securitySettingsService
      .getSecuritySettings()
      .subscribe((settings) => (this.securitySettings = settings));
  }

  onSubmit() {
    this.securitySettingsService
      .saveSecuritySettings(this.securitySettings)
      .subscribe();
  }
}
