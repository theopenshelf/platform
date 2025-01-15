import { Observable } from 'rxjs';
import { UILibrary } from '../models/UILibrary';

export interface LibrariesService {
  getLibraries(): Observable<UILibrary[]>;
  getLibrary(id: string): Observable<UILibrary>;

  addLibrary(location: UILibrary): Observable<UILibrary>;

  // Update an existing library
  updateLibrary(id: string, location: UILibrary): Observable<UILibrary>;

  // Delete a library
  deleteLibrary(id: string): Observable<void>;
}
