import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UIProfile {
    id: string;
    email: string;
    username: string;
    streetAddress: string;
    city: string;
    postalCode: string;
    country: string;
}


export interface ProfileService {
  updateProfile(location: UIProfile): Observable<UIProfile>;
}
