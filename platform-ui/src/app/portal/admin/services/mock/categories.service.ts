import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CategoriesService, UICategory } from '../categories.service';

@Injectable({
  providedIn: 'root',
})
export class MockCategoriesService implements CategoriesService {
  private static index = 1;

  public static BOOKS: UICategory = {
    id: MockCategoriesService.index++ + '',
    name: 'books',
    color: '#b71964',
    template: 'Book Template',
  };
  public static ELECTRONICS: UICategory = {
    id: MockCategoriesService.index++ + '',
    name: 'electronics',
    color: '#1d71ac',
    template: 'Electronics Template',
  };
  public static CLOTHING: UICategory = {
    id: MockCategoriesService.index++ + '',
    name: 'clothing',
    color: '#8a1bcc',
    template: 'Clothing Template',
  };

  private categories: UICategory[] = [
    MockCategoriesService.BOOKS,
    MockCategoriesService.ELECTRONICS,
    MockCategoriesService.CLOTHING,
  ];

  getCategories(): Observable<UICategory[]> {
    return of(this.categories);
  }

  getCategory(id: string): Observable<UICategory> {
    return of(
      this.categories.find((category) => category.id === id) ||
        ({} as UICategory),
    );
  }

  addCategory(category: UICategory): Observable<UICategory> {
    this.categories.push(category);
    return of(category);
  }
}
