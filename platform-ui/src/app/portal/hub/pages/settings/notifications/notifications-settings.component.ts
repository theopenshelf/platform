import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TuiAlertService, TuiButton, TuiTextfield } from '@taiga-ui/core';
import { TuiSwitch } from '@taiga-ui/kit';
import { AUTH_SERVICE_TOKEN } from '../../../../../global.provider';
import { AuthService } from '../../../../../services/auth.service';
import { USERS_SERVICE_TOKEN } from '../../../hub.provider';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-notifications-settings',
  imports: [
    ReactiveFormsModule,
    TuiButton,
    TuiTextfield,
    TranslateModule,
    TuiSwitch
  ],
  templateUrl: './notifications-settings.component.html',
  styleUrl: './notifications-settings.component.scss',
})
export class NotificationsSettingsComponent {
  notificationsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private alerts: TuiAlertService,
    private translate: TranslateService,
    @Inject(USERS_SERVICE_TOKEN) private usersService: UsersService,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthService,
  ) {
    this.notificationsForm = this.fb.group({
      isNotificationsEnabled: [true],
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  // Load initial profile data
  loadProfile(): void {
    this.usersService.getNotificationsSettings().subscribe((settings) => {
      this.notificationsForm.patchValue(settings);
    });
  }

  onSave(): void {
    if (this.notificationsForm.valid) {
      this.usersService
        .updateNotificationsSettings(this.notificationsForm.value)
        .subscribe((settings) => {
          this.alerts.open(this.translate.instant('notifications.saveSuccess'), {
            appearance: 'success',
          }).subscribe();
        });
    } else {
      this.alerts.open(this.translate.instant('notifications.saveError'), {
        appearance: 'error',
      }).subscribe();
    }
  }
}
