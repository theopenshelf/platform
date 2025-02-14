import { InjectionToken, Provider } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CategoriesService } from './services/categories.service';
import { CustomPagesService } from './services/custom-pages.service';
import { DashboardService } from './services/dashboard.service';
import { ItemsService } from './services/items.service';
import { MockCategoriesService } from './services/mock/categories.service';
import { MockCustomPagesService } from './services/mock/custom-pages.service';
import { MockDashboardService } from './services/mock/dashboard.service';
import { MockItemsService } from './services/mock/items.service';
import { MockSecuritySettingsService } from './services/mock/security-settings.service';
import { MockUsersService } from './services/mock/users.service';
import { ApiCategoriesService } from './services/real-api/categories.service';
import { APICustomPagesService } from './services/real-api/custom-pages.service';
import { ApiDashboardService } from './services/real-api/dashboard.service';
import { ApiItemsService } from './services/real-api/items.service';
import { ApiSecuritySettingsService } from './services/real-api/security-settings.service';
import { ApiUsersService } from './services/real-api/users.service';
import { SecuritySettingsService } from './services/security-settings.service';
import { UsersService } from './services/users.service';
import { LibrariesService } from './services/libraries.service';
import { MockLibrariesService } from './services/mock/libraries.service';
import { ApiLibrariesService } from './services/real-api/libraries.service';

export const CATEGORIES_SERVICE_TOKEN = new InjectionToken<CategoriesService>(
  'CategoriesService',
);
export const ITEMS_SERVICE_TOKEN = new InjectionToken<ItemsService>(
  'ItemsService',
);
export const USERS_SERVICE_TOKEN = new InjectionToken<UsersService>(
  'UsersService',
);
export const SECURITY_SETTINGS_SERVICE_TOKEN =
  new InjectionToken<SecuritySettingsService>('SecuritySettingsService');
export const DASHBOARD_SERVICE_TOKEN = new InjectionToken<DashboardService>(
  'DashboardService',
);
export const CUSTOM_PAGES_SERVICE_TOKEN = new InjectionToken<CustomPagesService>(
  'CustomPagesService',
);
export const LIBRARIES_SERVICE_TOKEN = new InjectionToken<LibrariesService>(
  'LibrariesService',
);

export const adminProviders: Provider[] = [
  {
    provide: CATEGORIES_SERVICE_TOKEN,
    useExisting: environment.useMockApi
      ? MockCategoriesService
      : ApiCategoriesService,
  },
  {
    provide: ITEMS_SERVICE_TOKEN,
    useExisting: environment.useMockApi ? MockItemsService : ApiItemsService,
  },
  {
    provide: USERS_SERVICE_TOKEN,
    useExisting: environment.useMockApi ? MockUsersService : ApiUsersService,
  },
  {
    provide: SECURITY_SETTINGS_SERVICE_TOKEN,
    useExisting: environment.useMockApi
      ? MockSecuritySettingsService
      : ApiSecuritySettingsService,
  },
  {
    provide: DASHBOARD_SERVICE_TOKEN,
    useExisting: environment.useMockApi
      ? MockDashboardService
      : ApiDashboardService,
  },
  {
    provide: CUSTOM_PAGES_SERVICE_TOKEN,
    useExisting: environment.useMockApi
      ? MockCustomPagesService
      : APICustomPagesService,
  },
  {
    provide: LIBRARIES_SERVICE_TOKEN,
    useExisting: environment.useMockApi
      ? MockLibrariesService
      : ApiLibrariesService,
  },
];
