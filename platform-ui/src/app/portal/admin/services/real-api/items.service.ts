import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ItemsAdminApiService } from '../../../../api-client';
import { Item, ItemsService, UIItem } from '../items.service';



@Injectable({
    providedIn: 'root',
})
export class ApiItemsService implements ItemsService {

    constructor(private itemsAdminApiService: ItemsAdminApiService) { }

    getItems(): Observable<UIItem[]> {
        return this.itemsAdminApiService.getItems().pipe(
            map((items: Item[]) => items.map((item: Item) => ({
                id: item.id,
                name: item.name,
                description: item.description,
                category: item.category,
                owner: item.owner,
                imageUrl: item.imageUrl,
                shortDescription: item.shortDescription,
                favorite: item.favorite,
                borrowCount: item.borrowCount,
                lateReturnPercentage: item.lateReturnPercentage,
                averageDuration: item.averageDuration,
                state: item.state,
            } as UIItem)))
        );
    }

    getItem(id: string): Observable<UIItem> {
        return this.itemsAdminApiService.getItem(id).pipe(
            map((item: Item) => ({
                id: item.id,
                name: item.name,
                description: item.description,
                category: item.category,
                owner: item.owner,
                imageUrl: item.imageUrl,
                shortDescription: item.shortDescription,
                favorite: item.favorite,
                borrowCount: item.borrowCount,
                lateReturnPercentage: item.lateReturnPercentage,
                averageDuration: item.averageDuration,
                state: item.state,
            } as UIItem)));
    }

    addItem(item: UIItem): Observable<UIItem> {
        return this.itemsAdminApiService.addItem(item).pipe(
            map((item: Item) => ({
                id: item.id,
                name: item.name,
                description: item.description,
                category: item.category,
                owner: item.owner,
                imageUrl: item.imageUrl,
                shortDescription: item.shortDescription,
                favorite: item.favorite,
                borrowCount: item.borrowCount,
                lateReturnPercentage: item.lateReturnPercentage,
                averageDuration: item.averageDuration,
                state: item.state,
            } as UIItem)));
    }
}