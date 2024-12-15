import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProfileCommunityApiService } from '../../../../api-client';
import { UIProfile } from '../../models/UIProfile';
import { ProfileService } from '../profile.service';
@Injectable({
  providedIn: 'root',
})
export class ApiProfileService implements ProfileService {

  constructor(private profileApiService: ProfileCommunityApiService) { }

  updateProfile(profile: UIProfile): Observable<UIProfile> {
    return this.profileApiService.updateProfile(profile).pipe(
      map((updatedProfile: any) => ({
        id: updatedProfile.id,
        email: updatedProfile.email,
        username: updatedProfile.username,
        streetAddress: updatedProfile.streetAddress,
        city: updatedProfile.city,
        postalCode: updatedProfile.postalCode,
        country: updatedProfile.country
      } as UIProfile))
    );
  }
} 