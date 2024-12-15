import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UIProfile } from '../../models/UIProfile';
import { ProfileService } from '../profile.service';

@Injectable({
  providedIn: 'root',
})
export class MockProfileService implements ProfileService {

  private profiles: UIProfile = { id: '1', email: 'user1@example.com', username: 'user1', streetAddress: '123 Main St', city: 'Anytown', postalCode: '12345', country: 'Country1' };

  updateProfile(profile: UIProfile): Observable<UIProfile> {
    this.profiles = profile;
    return of(profile);
  }
} 