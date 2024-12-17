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
        instructions: 'Instructions 1',
        location: {
            name: 'Location 1',
            address: '123 Main St, Anytown, USA',
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

    addLibrary(library: UILibrary): Observable<UILibrary> {
        library.id = (this.libraries.length + 1).toString();
        this.libraries.push(library);
        return of(library);
    }

    // Update an existing library
    updateLibrary(id: string, updatedLibrary: UILibrary): Observable<UILibrary> {
        const index = this.libraries.findIndex(library => library.id === id);
        if (index === -1) {
            throw new Error(`Library with id ${id} not found`);
        }
        updatedLibrary.id = id;
        this.libraries[index] = updatedLibrary;
        return of(updatedLibrary);
    }

    // Delete a library
    deleteLibrary(id: string): Observable<void> {
        this.libraries = this.libraries.filter(library => library.id !== id);
        return of(undefined);
    }

}

