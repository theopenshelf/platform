import { Observable } from 'rxjs';
import { UICategory } from '../../../models/UICategory';

export interface CategoriesService {
  getCategories(): Observable<UICategory[]>;
}
