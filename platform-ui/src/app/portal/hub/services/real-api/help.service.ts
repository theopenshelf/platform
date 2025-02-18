import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { HelpApiService, HelpArticle, HelpCategory } from "../../../../api-client";
import { UIHelpArticle, UIHelpCategory } from "../../../../models/UIHelp";
import { HelpService } from "../help.service";

@Injectable({
    providedIn: 'root',
})
export class APIHelpService implements HelpService {

    constructor(private helpApiService: HelpApiService) { }

    getCategories(): Observable<UIHelpCategory[]> {
        return this.helpApiService.getHelpCategories().pipe(
            map((categories: HelpCategory[]) =>
                categories.map(
                    (category: HelpCategory) =>
                        ({
                            id: category.id,
                            name: category.name,
                        }) as UIHelpCategory,
                ),
            ),
        );
    }

    getArticles(categoryId: string): Observable<UIHelpArticle[]> {
        return this.helpApiService.getHelpArticles(categoryId).pipe(
            map((articles: HelpArticle[]) =>
                articles.map(
                    (article: HelpArticle) =>
                        ({
                            id: article.id,
                            title: article.title,
                            content: article.content,
                        }) as UIHelpArticle,
                ),
            ),
        );
    }
}