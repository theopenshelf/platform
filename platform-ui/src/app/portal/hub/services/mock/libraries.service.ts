import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { loadLibrariesData } from '../../../../mock/libraries-loader';
import librariesData from '../../../../mock/libraries.json';
import { GetFilteredAndPaginatedParams } from '../../../../models/GetFilteredAndPaginatedParams';
import { UILibrary, UIMember, UIMembersPagination } from '../../../../models/UILibrary';
import { LibrariesService } from '../libraries.service';
import { MockUsersService } from './users.service';

@Injectable({
  providedIn: 'root',
})
export class MockLibrariesService implements LibrariesService {
  public libraries: UILibrary[] = [];
  private membersMap: Map<string, UIMember[]> = new Map();

  constructor(private usersService: MockUsersService) {
    this.libraries = loadLibrariesData();
    librariesData.forEach((library) => {
      const members = library.members.map((member) => {
        const user = this.usersService.getMockUser(member.userId);
        return {
          ...user,
          role: member.role as 'admin' | 'member' | 'requestingJoin',
        };
      });
      this.membersMap.set(library.id, members);
    });
  }

  getLibraries(): Observable<UILibrary[]> {
    return of(this.libraries);
  }

  getLibrariesByCommunityId(communityId: string): Observable<UILibrary[]> {
    return of(this.libraries.filter((library) => library.communityId === communityId));
  }

  getMockLibrariesByCommunityId(communityId: string): UILibrary[] {
    return this.libraries.filter((library) => library.communityId === communityId);
  }

  getLibrary(id: string): Observable<UILibrary> {
    const library = this.libraries.find((library) => library.id === id);
    if (!library) {
      throw new Error(`Library with id ${id} not found`);
    }
    return of(library);
  }

  addLibrary(library: UILibrary): Observable<UILibrary> {
    library.id = (this.libraries.length + 1).toString();
    this.libraries.push(library);
    this.membersMap.set(library.id, []);
    return of(library);
  }

  // Update an existing library
  updateLibrary(id: string, updatedLibrary: UILibrary): Observable<UILibrary> {
    const index = this.libraries.findIndex((library) => library.id === id);
    if (index === -1) {
      throw new Error(`Library with id ${id} not found`);
    }
    updatedLibrary.id = id;
    this.libraries[index] = updatedLibrary;
    return of(updatedLibrary);
  }

  // Delete a library
  deleteLibrary(id: string): Observable<void> {
    this.libraries = this.libraries.filter((library) => library.id !== id);
    this.membersMap.delete(id);
    return of(undefined);
  }

  getMembers(libraryId: string, getFilteredAndPaginatedParams: GetFilteredAndPaginatedParams): Observable<UIMembersPagination> {
    const {
      searchText,
      page = 0,
      pageSize = 10,
    } = getFilteredAndPaginatedParams;

    let members = this.membersMap.get(libraryId);
    if (!members) {
      throw new Error(`Library with id ${libraryId} not found`);
    }


    if (searchText) {
      members = members.filter((member) => member.username.toLowerCase().includes(searchText.toLowerCase()));
    }

    // Pagination logic
    const totalItems = members.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = page * pageSize;
    members = members.slice(
      startIndex,
      startIndex + pageSize
    );
    return of({
      items: members,
      totalItems: totalItems,
      totalPages: totalPages,
      currentPage: page,
      itemsPerPage: pageSize,
    });
  }

  addMember(libraryId: string, member: UIMember): Observable<UIMember> {
    const members = this.membersMap.get(libraryId);
    if (!members) {
      throw new Error(`Library with id ${libraryId} not found`);
    }
    members.push(member);
    return of(member);
  }

  deleteMember(libraryId: string, memberId: string): Observable<void> {
    const members = this.membersMap.get(libraryId);
    if (!members) {
      throw new Error(`Library with id ${libraryId} not found`);
    }
    this.membersMap.set(libraryId, members.filter((member) => member.id !== memberId));
    return of(undefined);
  }

  updateMember(libraryId: string, memberId: string, member: UIMember): Observable<UIMember> {
    const members = this.membersMap.get(libraryId);
    if (!members) {
      throw new Error(`Library with id ${libraryId} not found`);
    }
    const index = members.findIndex((m) => m.id === memberId);
    if (index === -1) {
      throw new Error(`Member with id ${memberId} not found in library ${libraryId}`);
    }
    members[index] = member;
    return of(member);
  }
}