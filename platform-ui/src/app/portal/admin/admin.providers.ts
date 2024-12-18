import { InjectionToken, Provider } from "@angular/core";
import { environment } from "../../../environments/environment";
import { APICategoriesService } from "../community/services/real-api/categories.service";
import { APIItemsService } from "../community/services/real-api/items.service";
import { CategoriesService } from "./services/categories.service";
import { DashboardService } from "./services/dashboard.service";
import { ItemsService } from "./services/items.service";
import { MockCategoriesService } from "./services/mock/categories.service";
import { MockDashboardService } from "./services/mock/dashboard.service";
import { MockItemsService } from "./services/mock/items.service";
import { MockSecuritySettingsService } from "./services/mock/security-settings.service";
import { MockUsersService } from "./services/mock/users.service";
import { ApiDashboardService } from "./services/real-api/dashboard.service";
import { ApiSecuritySettingsService } from "./services/real-api/security-settings.service";
import { ApiUsersService } from "./services/real-api/users.service";
import { SecuritySettingsService } from "./services/security-settings.service";
import { UsersService } from "./services/users.service";

export const CATEGORIES_SERVICE_TOKEN = new InjectionToken<CategoriesService>('CategoriesService');
export const ITEMS_SERVICE_TOKEN = new InjectionToken<ItemsService>('ItemsService');
export const USERS_SERVICE_TOKEN = new InjectionToken<UsersService>('UsersService');
export const SECURITY_SETTINGS_SERVICE_TOKEN = new InjectionToken<SecuritySettingsService>('SecuritySettingsService');
export const DASHBOARD_SERVICE_TOKEN = new InjectionToken<DashboardService>('DashboardService');

export const adminProviders: Provider[] = [
    {
        provide: CATEGORIES_SERVICE_TOKEN,
        useExisting: environment.useMockApi ? MockCategoriesService : APICategoriesService,
    },
    {
        provide: ITEMS_SERVICE_TOKEN,
        useExisting: environment.useMockApi ? MockItemsService : APIItemsService,
    },
    {
        provide: USERS_SERVICE_TOKEN,
        useExisting: environment.useMockApi ? MockUsersService : ApiUsersService,
    },
    {
        provide: SECURITY_SETTINGS_SERVICE_TOKEN,
        useExisting: environment.useMockApi ? MockSecuritySettingsService : ApiSecuritySettingsService,
    },
    {
        provide: DASHBOARD_SERVICE_TOKEN,
        useExisting: environment.useMockApi ? MockDashboardService : ApiDashboardService,
    }
];
