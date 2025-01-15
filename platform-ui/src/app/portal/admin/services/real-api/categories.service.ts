import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CategoriesAdminApiService, Category } from '../../../../api-client';
import { UICategory } from '../../../community/models/UICategory';
import { CategoriesService } from '../categories.service';

@Injectable({
  providedIn: 'root',
})
export class ApiCategoriesService implements CategoriesService {
  constructor(private categoriesApiService: CategoriesAdminApiService) {}

  getCategories(): Observable<UICategory[]> {
    return this.categoriesApiService.getAdminCategories().pipe(
      map((categories: Category[]) =>
        categories.map(
          (category: Category) =>
            ({
              id: category.id,
              name: category.name,
              color: category.color,
              template: category.template,
            }) as UICategory,
        ),
      ),
    );
  }
  getCategory(id: string): Observable<UICategory> {
    return this.categoriesApiService.getAdminCategory(id).pipe(
      map(
        (category: Category) =>
          ({
            id: category.id,
            name: category.name,
            color: category.color,
            template: category.template,
          }) as UICategory,
      ),
    );
  }
  addCategory(category: UICategory): Observable<UICategory> {
    return this.categoriesApiService.addAdminCategory(category);
  }
}
