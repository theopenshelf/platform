import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LibrariesHubApiService, Library, LibraryMember, PaginatedMembersResponse } from '../../../../api-client';
import { GetFilteredAndPaginatedParams } from '../../../../models/GetFilteredAndPaginatedParams';
import { UILibrary, UIMember, UIMembersPagination } from '../../../../models/UILibrary';
import { LibrariesService } from '../libraries.service';
import { APIUsersService } from './users.service';

@Injectable({
    providedIn: 'root',
})
export class ApiLibrariesService implements LibrariesService {

    constructor(private librariesApiService: LibrariesHubApiService, private usersService: APIUsersService) { }

    getLibraries(): Observable<UILibrary[]> {
        return this.librariesApiService.getHubLibraries().pipe(
            map((libraries: Library[]) =>
                libraries.map((library) => this.mapToUILibrary(library))
            )
        );
    }

    getLibrary(id: string): Observable<UILibrary> {
        return this.librariesApiService.getHubLibrary(id).pipe(
            map((library: Library) => this.mapToUILibrary(library))
        );
    }

    addLibrary(library: UILibrary): Observable<UILibrary> {
        const apiLibrary = this.mapToApiLibrary(library);
        return this.librariesApiService.addHubLibrary(apiLibrary).pipe(
            map((library: Library) => this.mapToUILibrary(library))
        );
    }

    updateLibrary(id: string, library: UILibrary): Observable<UILibrary> {
        const apiLibrary = this.mapToApiLibrary(library);
        return this.librariesApiService.updateHubLibrary(id, apiLibrary).pipe(
            map((library: Library) => this.mapToUILibrary(library))
        );
    }

    deleteLibrary(id: string): Observable<void> {
        return this.librariesApiService.deleteHubLibrary(id);
    }

    getMembers(libraryId: string, getFilteredAndPaginatedParams: GetFilteredAndPaginatedParams): Observable<UIMembersPagination> {
        return this.librariesApiService.getLibraryMembers(libraryId, getFilteredAndPaginatedParams.page, getFilteredAndPaginatedParams.pageSize).pipe(
            map((members: PaginatedMembersResponse) => this.mapToUIMembersPagination(members))
        );
    }

    addMember(libraryId: string, member: UIMember): Observable<UIMember> {
        return this.librariesApiService.addMember(libraryId, this.mapToApiMember(member)).pipe(
            map((member: LibraryMember) => this.mapToUIMember(member))
        );
    }

    deleteMember(libraryId: string, memberId: string): Observable<void> {
        return this.librariesApiService.deleteMember(libraryId, memberId);
    }

    updateMember(libraryId: string, memberId: string, member: UIMember): Observable<UIMember> {
        return this.librariesApiService.updateMember(libraryId, memberId, this.mapToApiMember(member)).pipe(
            map((member: LibraryMember) => this.mapToUIMember(member))
        );
    }


    private mapToUILibrary(library: Library): UILibrary {
        return {
            id: library.id,
            name: library.name,
            communityId: library.communityId,
            isHubAccessible: library.isHubAccessible ?? false,
            instructions: library.instructions ?? '',
            location: {
                name: library.location?.name ?? '',
                address: library.location?.address ?? '',
            },
            isAdmin: library.isAdmin ?? false,
            requiresApproval: library.requiresApproval ?? false,
            freeAccess: library.freeAccess ?? false,
        };
    }

    private mapToApiLibrary(library: UILibrary): Library {
        return {
            id: library.id,
            name: library.name,
            communityId: library.communityId,
            isHubAccessible: library.isHubAccessible,
            instructions: library.instructions,
            location: {
                name: library.location?.name ?? '',
                address: library.location?.address ?? '',
            },
            requiresApproval: library.requiresApproval ?? false,
            freeAccess: library.freeAccess ?? false,
            isAdmin: library.isAdmin ?? false,
        };
    }

    private mapToUIMembersPagination(members: PaginatedMembersResponse): UIMembersPagination {
        return {
            items: members.items?.map((member) => this.mapToUIMember(member)) ?? [],
            totalItems: members.totalItems,
            totalPages: members.totalPages,
            currentPage: members.currentPage,
            itemsPerPage: members.itemsPerPage ?? 0,
        };
    }

    private mapToUIMember(member: LibraryMember): UIMember {
        return {
            ...this.usersService.mapToUIUser(member),
            role: member.role ?? 'member',
        };
    }

    private mapToApiMember(member: UIMember): LibraryMember {
        return {
            ...this.usersService.mapToApiUser(member),
            role: member.role ?? 'member',
        };
    }
}
