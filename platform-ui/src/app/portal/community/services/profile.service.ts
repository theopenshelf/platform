import { Observable } from 'rxjs';
import { UIProfile } from '../models/UIProfile';

export interface ProfileService {
  updateProfile(location: UIProfile): Observable<UIProfile>;
}
