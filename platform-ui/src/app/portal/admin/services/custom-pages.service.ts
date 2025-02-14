import { Observable } from 'rxjs';
import { UICustomPage } from '../../../models/UICustomPage';
import { UIHelpArticle, UIHelpCategory } from '../../../models/UIHelp';


export interface CustomPagesService {
  getCustomPage(pageRef: string): Observable<UICustomPage>;
  getCustomPageRefs(): Observable<UICustomPage[]>;

  getCustomPage(pageRef: string): Observable<UICustomPage>;
  getCustomPageRefs(): Observable<UICustomPage[]>;
  createCustomPage(page: UICustomPage): Observable<UICustomPage>;
  updateCustomPage(page: UICustomPage): Observable<UICustomPage>;
  deleteCustomPage(pageRef: string): Observable<void>;

  getCategories(): Observable<UIHelpCategory[]>;
  getArticles(categoryId: string): Observable<UIHelpArticle[]>;

  createCategory(category: UIHelpCategory): Observable<UIHelpCategory>;
  updateCategory(category: UIHelpCategory): Observable<UIHelpCategory>;
  deleteCategory(categoryId: string): Observable<void>;

  createArticle(article: UIHelpArticle): Observable<UIHelpArticle>;
  updateArticle(article: UIHelpArticle): Observable<UIHelpArticle>;
  deleteArticle(articleId: string): Observable<void>;
}

