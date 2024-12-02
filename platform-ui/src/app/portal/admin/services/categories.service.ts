import { Injectable } from '@angular/core';

export interface Category {
    name: string;
    template: string;
} ;

@Injectable({
    providedIn: 'root',
})
export class CategoriesService {

    private categories: Category[] = [
        { name: 'Books', template: 'Book Template' },
        { name: 'Electronics', template: 'Electronics Template' },
        // Add more categories as needed
    ];

    getCategories(): Category[] {
        return this.categories;
    }

    addCategory(category: Category) {
        this.categories.push(category);
    }

}