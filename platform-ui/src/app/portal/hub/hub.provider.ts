import { InjectionToken, Provider } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { CategoriesService } from './services/categories.service';
import { CommunitiesService } from './services/communities.service';
import { CustomPageService } from './services/custom-page.service';
import { HelpService } from './services/help.service';
import { ItemsService } from './services/items.service';
import { LibrariesService } from './services/libraries.service';
import { MockCategoriesService } from './services/mock/categories.service';
import { MockCommunitiesService } from './services/mock/communities.service';
import { MockCustomPageService } from './services/mock/custom-pages.service';
import { MockHelpService } from './services/mock/help.service';
import { MockItemsService } from './services/mock/items.service';
import { MockLibrariesService } from './services/mock/libraries.service';
import { MockUsersService } from './services/mock/users.service';
import { APICategoriesService } from './services/real-api/categories.service';
import { ApiCommunitiesService } from './services/real-api/communities.service';
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
export const COMMUNITIES_SERVICE_TOKEN = new InjectionToken<CommunitiesService>(
  'CommunitiesService',
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

export const hubProviders: Provider[] = [
  {
    provide: ITEMS_SERVICE_TOKEN,
    useExisting: ConfigService.configuration.useMockApi ? MockItemsService : APIItemsService,
  },
  {
    provide: CATEGORIES_SERVICE_TOKEN,
    useExisting: ConfigService.configuration.useMockApi
      ? MockCategoriesService
      : APICategoriesService,
  },
  {
    provide: LIBRARIES_SERVICE_TOKEN,
    useExisting: ConfigService.configuration.useMockApi
      ? MockLibrariesService
      : ApiLibrariesService,
  },
  {
    provide: COMMUNITIES_SERVICE_TOKEN,
    useExisting: ConfigService.configuration.useMockApi
      ? MockCommunitiesService
      : ApiCommunitiesService,
  },
  {
    provide: HELP_SERVICE_TOKEN,
    useExisting: ConfigService.configuration.useMockApi
      ? MockHelpService
      : APIHelpService,
  },
  {
    provide: CUSTOM_PAGE_SERVICE_TOKEN,
    useExisting: ConfigService.configuration.useMockApi
      ? MockCustomPageService
      : APICustomPageService,
  },
  {
    provide: USERS_SERVICE_TOKEN,
    useExisting: ConfigService.configuration.useMockApi
      ? MockUsersService
      : APIUsersService,
  },
];
