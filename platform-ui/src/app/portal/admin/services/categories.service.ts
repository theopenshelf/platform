import { Injectable } from '@angular/core';

export interface Category {
    id: string;
    name: string;
    color: string;
    template: string;
} ;

@Injectable({
    providedIn: 'root',
})
export class CategoriesService {
    private static index = 1;

    public static BOOKS: Category = { id: CategoriesService.index++ + "", name: 'books', color: '#b71964', template: 'Book Template' };
    public static ELECTRONICS: Category = { id: CategoriesService.index++ + "", name: 'electronics', color: '#1d71ac', template: 'Electronics Template' };
    public static CLOTHING: Category = { id: CategoriesService.index++ + "", name: 'clothing', color: '#8a1bcc', template: 'Clothing Template' };

    private categories: Category[] = [
        CategoriesService.BOOKS,
        CategoriesService.ELECTRONICS,
        CategoriesService.CLOTHING,
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