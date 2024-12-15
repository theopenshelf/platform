import { Observable } from 'rxjs';
import { UILocation } from '../models/UILocation';

export interface LocationsService {

  getLocations(): Observable<UILocation[]>;
  addLocation(location: UILocation): Observable<UILocation>;
  updateLocation(id: string, location: UILocation): Observable<UILocation>;
  deleteLocation(id: string): Observable<void>;
}
