import { Observable } from 'rxjs';

export interface UICategory {
    id: string;
    name: string;
    color: string;
    template: string;
};

export interface CategoriesService {
    getCategories(): Observable<UICategory[]>;
    getCategory(id: string): Observable<UICategory>;
    addCategory(category: UICategory): Observable<UICategory>;
}
