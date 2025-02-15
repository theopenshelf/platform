import { InjectionToken, Provider } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CategoriesService } from './services/categories.service';
import { CustomPageService } from './services/custom-page.service';
import { HelpService } from './services/help.service';
import { ItemsService } from './services/items.service';
import { LibrariesService } from './services/libraries.service';
import { MockCategoriesService } from './services/mock/categories.service';
import { MockCustomPageService } from './services/mock/custom-pages.service';
import { MockHelpService } from './services/mock/help.service';
import { MockItemsService } from './services/mock/items.service';
import { MockLibrariesService } from './services/mock/libraries.service';
import { MockUsersService } from './services/mock/users.service';
import { APICategoriesService } from './services/real-api/categories.service';
import { APICustomPageService } from './services/real-api/custom-pages.service';
import { APIHelpService } from './services/real-api/help.service';
import { APIItemsService } from './services/real-api/items.service';
import { ApiLibrariesService } from './services/real-api/libraries.service';
import { APIUsersService } from './services/real-api/users.service';
import { UsersService } from './services/users.service';

export const ITEMS_SERVICE_TOKEN = new InjectionToken<ItemsService>(
  'ItemsService',
);
export const CATEGORIES_SERVICE_TOKEN = new InjectionToken<CategoriesService>(
  'CategoriesService',
);
export const LIBRARIES_SERVICE_TOKEN = new InjectionToken<LibrariesService>(
  'LibrariesService',
);
export const HELP_SERVICE_TOKEN = new InjectionToken<HelpService>(
  'HelpService',
);
export const CUSTOM_PAGE_SERVICE_TOKEN = new InjectionToken<CustomPageService>(
  'CustomPageService',
);
export const USERS_SERVICE_TOKEN = new InjectionToken<UsersService>(
  'UsersService',
);

export const communityProviders: Provider[] = [
  {
    provide: ITEMS_SERVICE_TOKEN,
    useExisting: environment.useMockApi ? MockItemsService : APIItemsService,
  },
  {
    provide: CATEGORIES_SERVICE_TOKEN,
    useExisting: environment.useMockApi
      ? MockCategoriesService
      : APICategoriesService,
  },
  {
    provide: LIBRARIES_SERVICE_TOKEN,
    useExisting: environment.useMockApi
      ? MockLibrariesService
      : ApiLibrariesService,
  },
  {
    provide: HELP_SERVICE_TOKEN,
    useExisting: environment.useMockApi
      ? MockHelpService
      : APIHelpService,
  },
  {
    provide: CUSTOM_PAGE_SERVICE_TOKEN,
    useExisting: environment.useMockApi
      ? MockCustomPageService
      : APICustomPageService,
  },
  {
    provide: USERS_SERVICE_TOKEN,
    useExisting: environment.useMockApi
      ? MockUsersService
      : APIUsersService,
  },
];
