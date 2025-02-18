
import { Observable } from 'rxjs';
import { UICustomPage } from '../../../models/UICustomPage';

export interface CustomPageService {
    getCustomPage(pageRef: string): Observable<UICustomPage>;
    getCustomPageRefs(): Observable<UICustomPage[]>;
}
