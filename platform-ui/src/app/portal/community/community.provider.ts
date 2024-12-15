import { InjectionToken, Provider } from "@angular/core";
import { environment } from "../../../environments/environment";
import { CategoriesService } from "./services/categories.service";
import { ItemsService } from "./services/items.service";
import { LibrariesService } from "./services/libraries.service";
import { LocationsService } from "./services/locations.service";
import { MockCategoriesService } from "./services/mock/categories.service";
import { MockItemsService } from "./services/mock/items.service";
import { MockLibrariesService } from "./services/mock/libraries.service";
import { MockLocationsService } from "./services/mock/locations.service";
import { MockProfileService } from "./services/mock/profile.service";
import { ProfileService } from "./services/profile.service";
import { APICategoriesService } from "./services/real-api/categories.service";
import { APIItemsService } from "./services/real-api/items.service";
import { ApiLocationsService } from "./services/real-api/locations.service";
import { ApiProfileService } from "./services/real-api/profile.service";

export const ITEMS_SERVICE_TOKEN = new InjectionToken<ItemsService>('ItemsService');
export const CATEGORIES_SERVICE_TOKEN = new InjectionToken<CategoriesService>('CategoriesService');
export const LOCATIONS_SERVICE_TOKEN = new InjectionToken<LocationsService>('LocationService');
export const PROFILE_SERVICE_TOKEN = new InjectionToken<ProfileService>('ProfileService');
export const LIBRARIES_SERVICE_TOKEN = new InjectionToken<LibrariesService>('LibrariesService');

export const communityProviders: Provider[] = [
    {
        provide: ITEMS_SERVICE_TOKEN,
        useExisting: environment.useMockApi ? MockItemsService : APIItemsService,
    },
    {
        provide: CATEGORIES_SERVICE_TOKEN,
        useExisting: environment.useMockApi ? MockCategoriesService : APICategoriesService,
    },
    {
        provide: LOCATIONS_SERVICE_TOKEN,
        useExisting: environment.useMockApi ? MockLocationsService : ApiLocationsService,
    },
    {
        provide: PROFILE_SERVICE_TOKEN,
        useExisting: environment.useMockApi ? MockProfileService : ApiProfileService,
    },
    {
        provide: LIBRARIES_SERVICE_TOKEN,
        useExisting: environment.useMockApi ? MockLibrariesService : MockLibrariesService,
    },
];
