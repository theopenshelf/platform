import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LibrariesAdminApiService, Library } from '../../../../api-client';
import { UILibrary } from '../../../../models/UILibrary';
import { LibrariesService } from '../libraries.service';

@Injectable({
    providedIn: 'root',
})
export class ApiLibrariesService implements LibrariesService {
    constructor(private librariesApiService: LibrariesAdminApiService) { }

    getLibraries(): Observable<UILibrary[]> {
        return this.librariesApiService.getAdminLibraries().pipe(
            map((libraries: Library[]) =>
                libraries.map((library) => this.mapToUILibrary(library))
            )
        );
    }

    getLibrary(id: string): Observable<UILibrary> {
        return this.librariesApiService.getAdminLibrary(id).pipe(
            map((library: Library) => this.mapToUILibrary(library))
        );
    }

    addLibrary(library: UILibrary): Observable<UILibrary> {
        const apiLibrary = this.mapToApiLibrary(library);
        return this.librariesApiService.addAdminLibrary(apiLibrary).pipe(
            map((library: Library) => this.mapToUILibrary(library))
        );
    }

    updateLibrary(id: string, library: UILibrary): Observable<UILibrary> {
        const apiLibrary = this.mapToApiLibrary(library);
        return this.librariesApiService.updateAdminLibrary(id, apiLibrary).pipe(
            map((library: Library) => this.mapToUILibrary(library))
        );
    }

    deleteLibrary(id: string): Observable<void> {
        return this.librariesApiService.deleteAdminLibrary(id);
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
                coordinates: {
                    lat: library.location?.coordinates?.lat ?? 0,
                    lng: library.location?.coordinates?.lng ?? 0,
                },
            },
            requiresApproval: library.requiresApproval ?? false,
            freeAccess: library.freeAccess ?? false,
            isAdmin: library.isAdmin ?? false,
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
                coordinates: {
                    lat: library.location?.coordinates?.lat ?? 0,
                    lng: library.location?.coordinates?.lng ?? 0,
                },
            },
            requiresApproval: library.requiresApproval ?? false,
            freeAccess: library.freeAccess ?? false,
            isAdmin: library.isAdmin ?? false,
        };
    }
}
