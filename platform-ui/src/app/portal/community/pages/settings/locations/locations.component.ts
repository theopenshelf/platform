import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TuiButton } from '@taiga-ui/core';

interface Location {
    name: string;
    instructions: string;
    address: string;
}

@Component({
    standalone: true,
    selector: 'app-locations',
    imports: [
      CommonModule, 
      FormsModule, 
      ReactiveFormsModule,
      TuiButton,

    ],
    templateUrl: './locations.component.html',
    styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {
    locationForm!: FormGroup;
    locations: Location[] = [];
    editMode: boolean = false;
    editIndex: number | null = null;

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.locationForm = this.fb.group({
            name: ['', Validators.required],
            instructions: [''],
            address: ['', Validators.required],
        });
    }

    onSubmit(): void {
        if (this.editMode && this.editIndex !== null) {
            // Update existing location
            this.locations[this.editIndex] = this.locationForm.value;
            this.editMode = false;
            this.editIndex = null;
        } else {
            // Add new location
            this.locations.push(this.locationForm.value);
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
        this.locations.splice(index, 1);
    }
}