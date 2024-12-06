import { Injectable } from '@angular/core';
import { CategoriesService, Category } from '../categories.service';


@Injectable({
    providedIn: 'root',
})
export class MockCategoriesService implements CategoriesService {
    private static index = 1;

    public static BOOKS: Category = { id: MockCategoriesService.index++ + "", name: 'books', color: '#b71964', template: 'Book Template' };
    public static ELECTRONICS: Category = { id: MockCategoriesService.index++ + "", name: 'electronics', color: '#1d71ac', template: 'Electronics Template' };
    public static CLOTHING: Category = { id: MockCategoriesService.index++ + "", name: 'clothing', color: '#8a1bcc', template: 'Clothing Template' };

    private categories: Category[] = [
        MockCategoriesService.BOOKS,
        MockCategoriesService.ELECTRONICS,
        MockCategoriesService.CLOTHING,
    ];

    getCategories(): Category[] {
        return this.categories;
    }

    getCategory(id: string): Category {
        return this.categories.find(category => category.id === id) || {} as Category;
    }

    addCategory(category: Category) {
        this.categories.push(category);
    }

}