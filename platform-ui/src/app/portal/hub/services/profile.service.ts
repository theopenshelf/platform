import { Observable } from 'rxjs';
import { UIUser } from '../../../models/UIUser';

export interface ProfileService {
  updateProfile(user: UIUser): Observable<UIUser>;
}
