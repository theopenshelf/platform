import { Observable } from 'rxjs';
import { UILibrary } from '../../../models/UILibrary';

export interface LibrariesService {
  getLibraries(): Observable<UILibrary[]>;
}
