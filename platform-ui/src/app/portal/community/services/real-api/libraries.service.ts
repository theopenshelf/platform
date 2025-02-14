import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LibrariesCommunityApiService, Library } from '../../../../api-client';
import { UILibrary } from '../../../../models/UILibrary';
import { LibrariesService } from '../libraries.service';

@Injectable({
    providedIn: 'root',
})
export class ApiLibrariesService implements LibrariesService {
    constructor(private librariesApiService: LibrariesCommunityApiService) { }

    getLibraries(): Observable<UILibrary[]> {
        return this.librariesApiService.getCommunityLibraries().pipe(
            map((libraries: Library[]) =>
                libraries.map((library) => this.mapToUILibrary(library))
            )
        );
    }

    getLibrary(id: string): Observable<UILibrary> {
        return this.librariesApiService.getCommunityLibrary(id).pipe(
            map((library: Library) => this.mapToUILibrary(library))
        );
    }

    addLibrary(library: UILibrary): Observable<UILibrary> {
        const apiLibrary = this.mapToApiLibrary(library);
        return this.librariesApiService.addCommunityLibrary(apiLibrary).pipe(
            map((library: Library) => this.mapToUILibrary(library))
        );
    }

    updateLibrary(id: string, library: UILibrary): Observable<UILibrary> {
        const apiLibrary = this.mapToApiLibrary(library);
        return this.librariesApiService.updateCommunityLibrary(id, apiLibrary).pipe(
            map((library: Library) => this.mapToUILibrary(library))
        );
    }

    deleteLibrary(id: string): Observable<void> {
        return this.librariesApiService.deleteCommunityLibrary(id);
    }

    private mapToUILibrary(library: Library): UILibrary {
        return {
            id: library.id,
            name: library.name,
            isCommunityAccessible: library.isCommunityAccessible ?? false,
            instructions: library.instructions ?? '',
            location: {
                name: library.location?.name ?? '',
                address: library.location?.address ?? '',
            },
            admins: library.admins?.map((admin) => ({ userId: admin })) ?? [],
            requiresApproval: library.requiresApproval ?? false,
            freeAccess: library.freeAccess ?? false,
        };
    }

    private mapToApiLibrary(library: UILibrary): Library {
        return {
            id: library.id,
            name: library.name,
            isCommunityAccessible: library.isCommunityAccessible,
            instructions: library.instructions,
            location: {
                name: library.location?.name ?? '',
                address: library.location?.address ?? '',
            },
            admins: library.admins?.map((admin) => admin.userId) ?? [],
            requiresApproval: library.requiresApproval ?? false,
            freeAccess: library.freeAccess ?? false,
        };
    }
}
