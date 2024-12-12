import { Injectable } from '@angular/core';
import { CategoriesService, UICategory } from '../categories.service';
import { CategoriesApiService, Category } from '../../../../api-client';
import { map, Observable } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class APICategoriesService implements CategoriesService {
    constructor(private categoriesApiService: CategoriesApiService) {}

    getCategories(): Observable<UICategory[]> {
        return this.categoriesApiService.getCategories().pipe(
            map((categories: Category[]) => categories.map((category: Category) => ({
                id: category.id,
                name: category.name,
                color: category.color,
                template: category.template
            } as UICategory)))
        );
    }
}