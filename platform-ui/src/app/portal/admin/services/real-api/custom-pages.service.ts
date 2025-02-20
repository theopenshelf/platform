import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { CustomPage, CustomPagesAdminApiService, GetCustomPageRefs200ResponseInner, HelpAdminApiService, HelpArticle, HelpCategory } from "../../../../api-client";
import { UICustomPage } from "../../../../models/UICustomPage";
import { UIHelpArticle, UIHelpCategory } from "../../../../models/UIHelp";
import { CustomPagesService } from "../custom-pages.service";

@Injectable({
    providedIn: 'root',
})
export class APICustomPagesService implements CustomPagesService {

    constructor(private customPagesService: CustomPagesAdminApiService,
        private helpService: HelpAdminApiService

    ) { }

    getCustomPage(pageRef: string): Observable<UICustomPage> {
        return this.customPagesService.getAdminCustomPage(pageRef).pipe(
            map((page: CustomPage) =>
                ({
                    id: page.id,
                    ref: page.ref,
                    position: page.position,
                    title: page.title,
                    content: page.content,
                }) as UICustomPage,
            ),
        );
    }

    getCustomPageRefs(): Observable<UICustomPage[]> {
        return this.customPagesService.getAdminCustomPages().pipe(
            map((pages: GetCustomPageRefs200ResponseInner[]) => pages.map((page) => ({
                ref: page.ref,
                position: page.position,
                title: page.title,
                content: '',
                communityId: '',
                order: 0
            } as UICustomPage))),
        );
    }

    createCustomPage(page: UICustomPage): Observable<UICustomPage> {
        return this.customPagesService.createCustomPage(page).pipe(
            map((page: CustomPage) => page as UICustomPage),
        );
    }

    updateCustomPage(page: UICustomPage): Observable<UICustomPage> {
        return this.customPagesService.updateCustomPage(page.ref, page).pipe(
            map((page: CustomPage) => page as UICustomPage),
        );
    }

    deleteCustomPage(pageRef: string): Observable<void> {
        return this.customPagesService.deleteCustomPage(pageRef).pipe(
            map(() => undefined),
        );
    }

    getCategories(): Observable<UIHelpCategory[]> {
        return this.helpService.getAdminHelpCategories().pipe(
            map((categories: HelpCategory[]) => categories.map((category) => category as UIHelpCategory)),
        );
    }
    createCategory(category: UIHelpCategory): Observable<UIHelpCategory> {
        return this.helpService.createHelpCategory(category).pipe(
            map((category: HelpCategory) => category as UIHelpCategory),
        );
    }
    updateCategory(category: UIHelpCategory): Observable<UIHelpCategory> {
        return this.helpService.updateHelpCategory(category.id, category).pipe(
            map((category: HelpCategory) => category as UIHelpCategory),
        );
    }
    deleteCategory(categoryId: string): Observable<void> {
        return this.helpService.deleteHelpCategory(categoryId).pipe(
            map(() => undefined),
        );
    }

    getArticles(categoryId: string): Observable<UIHelpArticle[]> {
        return this.helpService.getAdminHelpArticles(categoryId).pipe(
            map((articles: HelpArticle[]) => articles.map((article) => article as UIHelpArticle)),
        );
    }
    createArticle(article: UIHelpArticle): Observable<UIHelpArticle> {
        return this.helpService.createHelpArticle(article).pipe(
            map((article: HelpArticle) => article as UIHelpArticle),
        );
    }
    updateArticle(article: UIHelpArticle): Observable<UIHelpArticle> {
        return this.helpService.updateHelpArticle(article.id, article).pipe(
            map((article: HelpArticle) => article as UIHelpArticle),
        );
    }
    deleteArticle(articleId: string): Observable<void> {
        return this.helpService.deleteHelpArticle(articleId).pipe(
            map(() => undefined),
        );
    }
}
