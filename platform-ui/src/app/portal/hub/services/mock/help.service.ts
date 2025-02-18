import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { loadHelpData } from "../../../../mock/help-loader";
import { UIHelpArticle, UIHelpCategory } from "../../../../models/UIHelp";
import { HelpService } from "../help.service";

@Injectable({
    providedIn: 'root',
})
export class MockHelpService implements HelpService {

    private categories: UIHelpCategory[] = [];
    private articles: UIHelpArticle[] = [];

    constructor() {
        const { categories, articles } = loadHelpData();
        this.categories = categories;
        this.articles = articles;
    }

    getCategories(): Observable<UIHelpCategory[]> {
        return of(this.categories);
    }

    getArticles(categoryId: string): Observable<UIHelpArticle[]> {
        return of(this.articles.filter(article => article.category.id === categoryId));
    }
}