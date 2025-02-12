
import { Observable } from 'rxjs';
import { UIHelpArticle, UIHelpCategory } from '../../../models/UIHelp';

export interface HelpService {
    getCategories(): Observable<UIHelpCategory[]>;
    getArticles(categoryId: string): Observable<UIHelpArticle[]>;
}
