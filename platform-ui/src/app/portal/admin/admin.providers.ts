import { InjectionToken, Provider } from "@angular/core";
import { ItemsService } from "./services/items.service";
import { MockCategoriesService } from "./services/mock/categories.service";
import { CategoriesService } from "./services/categories.service";
import { MockItemsService } from "./services/mock/items.service";
import { UsersService } from "./services/users.service";
import { MockUsersService } from "./services/mock/users.service";

export const CATEGORIES_SERVICE_TOKEN = new InjectionToken<CategoriesService>('CategoriesService');
export const ITEMS_SERVICE_TOKEN = new InjectionToken<ItemsService>('ItemsService');
export const USERS_SERVICE_TOKEN = new InjectionToken<UsersService>('UsersService');
export const adminProviders: Provider[] = [
    {
        provide: CATEGORIES_SERVICE_TOKEN,
        useExisting: MockCategoriesService,
    },
    {
        provide: ITEMS_SERVICE_TOKEN,
        useExisting: MockItemsService,
    },
    {
        provide: USERS_SERVICE_TOKEN,
        useExisting: MockUsersService,
    }
];
