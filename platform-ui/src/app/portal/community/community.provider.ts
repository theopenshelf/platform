import { InjectionToken, Provider } from "@angular/core";
import { ItemsService } from "./services/items.service";
import { MockItemsService } from "./services/mock/items.service";
import { CategoriesService } from "./services/categories.service";
import { MockCategoriesService } from "./services/mock/categories.service";
import { environment } from "../../../environments/environment";
import { APICategoriesService } from "./services/real-api/categories.service";
import { APIItemsService } from "./services/real-api/items.service";

export const ITEMS_SERVICE_TOKEN = new InjectionToken<ItemsService>('ItemsService');
export const CATEGORIES_SERVICE_TOKEN = new InjectionToken<CategoriesService>('CategoriesService');

export const communityProviders: Provider[] = [
    {
        provide: ITEMS_SERVICE_TOKEN,
        useExisting: environment.useMockApi ? MockItemsService : APIItemsService,
    },
    {
        provide: CATEGORIES_SERVICE_TOKEN,
        useExisting: environment.useMockApi ? MockCategoriesService : APICategoriesService,
    },
];