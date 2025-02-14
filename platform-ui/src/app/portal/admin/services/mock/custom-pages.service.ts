import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { loadCustomPagesData } from "../../../../mock/custom-page-loader";
import { loadHelpData } from "../../../../mock/help-loader";
import { UICustomPage } from "../../../../models/UICustomPage";
import { UIHelpArticle, UIHelpCategory } from "../../../../models/UIHelp";
import { CustomPagesService } from "../custom-pages.service";


@Injectable({
  providedIn: 'root',
})
export class MockCustomPagesService implements CustomPagesService {

  private customPages: UICustomPage[] = [];
  private categories: UIHelpCategory[] = [];
  private articles: UIHelpArticle[] = [];

  constructor() {
    const { categories, articles } = loadHelpData();
    this.customPages = loadCustomPagesData();

    this.categories = categories;
    this.articles = articles;
  }

  getCategories(): Observable<UIHelpCategory[]> {
    return of(this.categories);
  }

  getArticles(categoryId: string): Observable<UIHelpArticle[]> {
    return of(this.articles.filter(article => article.category.id === categoryId));
  }

  getCustomPage(pageRef: string): Observable<UICustomPage> {
    const page = this.customPages.find(page => page.ref === pageRef);
    if (!page) {
      throw new Error(`Custom page with ref ${pageRef} not found`);
    }
    return of(page);
  }

  getCustomPageRefs(): Observable<UICustomPage[]> {
    return of(this.customPages);
  }

  createCustomPage(page: UICustomPage): Observable<UICustomPage> {
    this.customPages.push(page);
    return of(page);
  }

  updateCustomPage(page: UICustomPage): Observable<UICustomPage> {
    const index = this.customPages.findIndex(p => p.ref === page.ref);
    if (index === -1) {
      throw new Error(`Custom page with ref ${page.ref} not found`);
    }
    this.customPages[index] = page;
    return of(page);
  }

  deleteCustomPage(pageRef: string): Observable<void> {
    this.customPages = this.customPages.filter(p => p.ref !== pageRef);
    return of(undefined);
  }


  createCategory(category: UIHelpCategory): Observable<UIHelpCategory> {
    this.categories.push(category);
    return of(category);
  }
  updateCategory(category: UIHelpCategory): Observable<UIHelpCategory> {
    const index = this.categories.findIndex(c => c.id === category.id);
    this.categories[index] = category;
    return of(category);
  }
  deleteCategory(categoryId: string): Observable<void> {
    this.categories = this.categories.filter(c => c.id !== categoryId);
    return of(undefined);
  }

  createArticle(article: UIHelpArticle): Observable<UIHelpArticle> {
    article.order = this.articles.length;
    this.articles.push(article);
    return of(article);
  }
  updateArticle(article: UIHelpArticle): Observable<UIHelpArticle> {
    const index = this.articles.findIndex(a => a.id === article.id);
    this.articles[index] = article;
    return of(article);
  }
  deleteArticle(articleId: string): Observable<void> {
    this.articles = this.articles.filter(a => a.id !== articleId);
    return of(undefined);
  }
}
