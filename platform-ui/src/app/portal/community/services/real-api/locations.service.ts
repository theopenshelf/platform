import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { LocationsService, UILocation } from '../locations.service';
import { LocationsApiService } from '../../../../api-client';


@Injectable({
  providedIn: 'root',
})
export class ApiLocationsService implements LocationsService {

  constructor(private locationsApiService: LocationsApiService) {}

  getLocations(): Observable<UILocation[]> {
    return this.locationsApiService.getLocations().pipe(
      map((locations: any[]) => locations.map((location: any) => ({
        name: location.name,
        instructions: location.instructions,
        address: location.address
      } as UILocation)))
    );
  }

  addLocation(location: UILocation): Observable<UILocation> {
    return this.locationsApiService.addLocation(location).pipe(
      map((location: any) => ({
        name: location.name,
        instructions: location.instructions,
        address: location.address
      } as UILocation))
    );
  }

  updateLocation(id: string, location: UILocation): Observable<UILocation> {
    return this.locationsApiService.updateLocation(id, location).pipe(
      map((location: any) => ({
        name: location.name,
        instructions: location.instructions,
        address: location.address
      } as UILocation))
    );
  }

  deleteLocation(id: string): Observable<void> {
    return this.locationsApiService.deleteLocation(id).pipe(
      map(() => undefined)
    );
  }
}
