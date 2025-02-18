import { Observable } from 'rxjs';
import { GetFilteredAndPaginatedParams } from '../../../models/GetFilteredAndPaginatedParams';
import { UILibrary, UIMember, UIMembersPagination } from '../../../models/UILibrary';

export interface LibrariesService {
  getLibraries(): Observable<UILibrary[]>;
  getLibrary(id: string): Observable<UILibrary>;

  addLibrary(location: UILibrary): Observable<UILibrary>;

  // Update an existing library
  updateLibrary(id: string, location: UILibrary): Observable<UILibrary>;

  // Delete a library
  deleteLibrary(id: string): Observable<void>;

  getMembers(libraryId: string, getFilteredAndPaginatedParams: GetFilteredAndPaginatedParams): Observable<UIMembersPagination>;

  addMember(libraryId: string, member: UIMember): Observable<UIMember>;

  deleteMember(libraryId: string, memberId: string): Observable<void>;

  updateMember(libraryId: string, memberId: string, member: UIMember): Observable<UIMember>;
}
