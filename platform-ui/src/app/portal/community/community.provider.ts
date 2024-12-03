import { InjectionToken, Provider } from "@angular/core";
import { ItemsService } from "./services/items.service";
import { MockItemsService } from "./services/mock/items.service";

export const ITEMS_SERVICE_TOKEN = new InjectionToken<ItemsService>('ItemsService');

export const communityProviders: Provider[] = [
    {
        provide: ITEMS_SERVICE_TOKEN,
        useClass: MockItemsService,
    }
];