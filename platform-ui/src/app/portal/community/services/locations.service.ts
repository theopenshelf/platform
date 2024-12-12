import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UILocation {
    id: string;
    name: string;
    instructions: string;
    address: string;
}


export interface LocationsService {

  getLocations(): Observable<UILocation[]> ;
  addLocation(location: UILocation): Observable<UILocation>;
  updateLocation(id: string, location: UILocation): Observable<UILocation> ;
  deleteLocation(id: string): Observable<void>;
}
