import { Injectable } from '@angular/core';

export interface Category {
    id: string;
    name: string;
    color: string;
    template: string;
} ;

export interface CategoriesService {
    getCategories(): Category[];
    getCategory(id: string): Category;
    addCategory(category: Category): void;
}
