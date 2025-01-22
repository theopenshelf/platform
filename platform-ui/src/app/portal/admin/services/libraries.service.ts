import { Observable } from 'rxjs';
import { UILibrary } from '../../community/models/UILibrary';

export interface LibrariesService {
  getLibraries(): Observable<UILibrary[]>;
}
