import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton } from '@taiga-ui/core';
import { communityProviders, LOCATIONS_SERVICE_TOKEN } from '../../../community.provider';
import { UILocation } from '../../../models/UILocation';
import { LocationsService } from '../../../services/locations.service';

@Component({
    standalone: true,
    selector: 'app-locations',
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TuiButton,

    ],
    providers: [
        ...communityProviders,
    ],
    templateUrl: './locations.component.html',
    styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {
    locationForm!: FormGroup;
    locations: UILocation[] = [];
    editMode: boolean = false;
    editIndex: number | null = null;

    constructor(private fb: FormBuilder, @Inject(LOCATIONS_SERVICE_TOKEN) private locationsService: LocationsService) { }

    ngOnInit(): void {
        this.locationForm = this.fb.group({
            name: ['', Validators.required],
            instructions: [''],
            address: ['', Validators.required],
        });

        this.loadLocations();
    }

    loadLocations(): void {
        this.locationsService.getLocations().subscribe(locations => {
            this.locations = locations;
        });
    }

    onSubmit(): void {
        if (this.editMode && this.editIndex !== null) {
            const locationId = this.locations[this.editIndex].id; // Assuming each location has an 'id' field
            this.locationsService.updateLocation(locationId, this.locationForm.value).subscribe(() => {
                this.loadLocations();
                this.editMode = false;
                this.editIndex = null;
            });
        } else {
            this.locationsService.addLocation(this.locationForm.value).subscribe(() => {
                this.loadLocations();
            });
        }
        this.locationForm.reset();
    }

    editLocation(index: number): void {
        this.editMode = true;
        this.editIndex = index;
        this.locationForm.setValue(this.locations[index]);
    }

    cancelEdit(): void {
        this.editMode = false;
        this.editIndex = null;
        this.locationForm.reset();
    }

    deleteLocation(index: number): void {
        const locationId = this.locations[index].id; // Assuming each location has an 'id' field
        this.locationsService.deleteLocation(locationId).subscribe(() => {
            this.loadLocations();
        });
    }
}