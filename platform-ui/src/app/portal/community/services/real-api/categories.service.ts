import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  CategoriesCommunityApiService,
  Category,
} from '../../../../api-client';
import { UICategory } from '../../../../models/UICategory';
import { CategoriesService } from '../categories.service';

@Injectable({
  providedIn: 'root',
})
export class APICategoriesService implements CategoriesService {
  constructor(private categoriesApiService: CategoriesCommunityApiService) { }

  getCategories(): Observable<UICategory[]> {
    return this.categoriesApiService.getCategories().pipe(
      map((categories: Category[]) =>
        categories.map(
          (category: Category) =>
            ({
              id: category.id,
              name: category.name,
              color: category.color,
              icon: category.icon,
              template: category.template,
            }) as UICategory,
        ),
      ),
    );
  }
}
