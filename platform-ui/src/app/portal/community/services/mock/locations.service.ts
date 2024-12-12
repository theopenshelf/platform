import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { LocationsService, UILocation } from '../locations.service';


@Injectable({
  providedIn: 'root',
})
export class MockLocationsService implements LocationsService {

  private locations: UILocation[] = [
    { id: '1', name: 'Location 1', instructions: 'Instructions 1', address: 'Address 1' },
    { id: '2', name: 'Location 2', instructions: 'Instructions 2', address: 'Address 2' },
  ];

  getLocations(): Observable<UILocation[]> {
    return of(this.locations);
  }

  addLocation(location: UILocation): Observable<UILocation> {
    this.locations.push(location);
    return of(location);
  }

  updateLocation(id: string, location: UILocation): Observable<UILocation> {
    const index = this.locations.findIndex(loc => loc.name === location.name);
    if (index !== -1) {
      this.locations[index] = location;
    }
    return of(location);
  }
  deleteLocation(id: string): Observable<void> {
    this.locations = this.locations.filter(location => location.id !== id);
    return of(undefined);
  }
}
