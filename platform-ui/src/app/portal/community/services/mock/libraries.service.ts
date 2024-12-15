import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { UILibrary } from "../../models/UILibrary";
import { LibrariesService } from "../libraries.service";

@Injectable({
    providedIn: 'root',
})
export class MockLibrariesService implements LibrariesService {

    private libraries: UILibrary[] = [{
        id: '1',
        name: 'Library 1',
        isCommunityAccessible: true,
        members: [
            {
                id: '1',
                userId: '1',
                username: 'John Doe',
                isAdmin: true
            },
            {
                id: '2',
                userId: '2',
                username: 'Jane Doe',
                isAdmin: false
            }
        ],
        location: {
            id: '1',
            name: 'Location 1',
            address: '123 Main St, Anytown, USA',
            instructions: 'Instructions 1',
        }
    }];

    getLibraries(): Observable<UILibrary[]> {
        return of(this.libraries);
    }
    getLibrary(id: string): Observable<UILibrary> {
        const library = this.libraries.find(library => library.id === id);
        if (!library) {
            throw new Error(`Library with id ${id} not found`);
        }
        return of(library);
    }

    addLibrary(location: UILibrary): Observable<UILibrary> {
        return of(location);
    }

    // Update an existing library
    updateLibrary(id: string, location: UILibrary): Observable<UILibrary> {
        return of(location);
    }

    // Delete a library
    deleteLibrary(id: string): Observable<void> {
        return of(undefined);
    }

}

