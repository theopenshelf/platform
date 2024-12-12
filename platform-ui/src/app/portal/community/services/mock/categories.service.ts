import { Injectable } from '@angular/core';
import { CategoriesService, UICategory } from '../categories.service';
import { Observable, of } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class MockCategoriesService implements CategoriesService {
    private static index = 1;

    public static BOOKS: UICategory = { id: MockCategoriesService.index++ + "", name: 'books', color: '#b71964', template: 'Book Template' };
    public static ELECTRONICS: UICategory = { id: MockCategoriesService.index++ + "", name: 'electronics', color: '#1d71ac', template: 'Electronics Template' };
    public static CLOTHING: UICategory = { id: MockCategoriesService.index++ + "", name: 'clothing', color: '#8a1bcc', template: 'Clothing Template' };

    private categories: UICategory[] = [
        MockCategoriesService.BOOKS,
        MockCategoriesService.ELECTRONICS,
        MockCategoriesService.CLOTHING,
    ];

    getCategories(): Observable<UICategory[]> {
        return of(this.categories);
    }
}