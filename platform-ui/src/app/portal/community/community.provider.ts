import { InjectionToken, Provider } from "@angular/core";
import { ItemsService } from "./services/items.service";
import { MockItemsService } from "./services/mock/items.service";
import { CategoriesService } from "./services/categories.service";
import { MockCategoriesService } from "./services/mock/categories.service";
import { environment } from "../../../environments/environment";
import { APICategoriesService } from "./services/real-api/categories.service";
import { APIItemsService } from "./services/real-api/items.service";
import { ApiLocationsService } from "./services/real-api/locations.service";
import { LocationsService } from "./services/locations.service";
import { MockLocationsService } from "./services/mock/locations.service";
import { ProfileService } from "./services/profile.service";
import { MockProfileService } from "./services/mock/profile.service";
import { ApiProfileService } from "./services/real-api/profile.service";

export const ITEMS_SERVICE_TOKEN = new InjectionToken<ItemsService>('ItemsService');
export const CATEGORIES_SERVICE_TOKEN = new InjectionToken<CategoriesService>('CategoriesService');
export const LOCATIONS_SERVICE_TOKEN = new InjectionToken<LocationsService>('LocationService');
export const PROFILE_SERVICE_TOKEN = new InjectionToken<ProfileService>('ProfileService');

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
];