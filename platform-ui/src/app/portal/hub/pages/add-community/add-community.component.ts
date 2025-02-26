import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiSegmented } from '@taiga-ui/kit';
import {
    TuiTextareaModule
} from '@taiga-ui/legacy';
import { UICommunity } from '../../../../models/UICommunity';
import { COMMUNITIES_SERVICE_TOKEN } from '../../hub.provider';
import { CommunitiesService } from '../../services/communities.service';

@Component({
    selector: 'app-add-community',
    templateUrl: './add-community.component.html',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule,
        TuiTextfield,
        TuiTextareaModule,
        TuiButton,
        TuiSegmented,
        TuiIcon
    ],
    styleUrl: './add-community.component.scss',
})
export class AddCommunityComponent implements OnInit {
    addCommunityForm: FormGroup;
    imageFile?: File;

    constructor(
        private fb: FormBuilder,
        @Inject(COMMUNITIES_SERVICE_TOKEN) private communitiesService: CommunitiesService,
        private router: Router,
        private translate: TranslateService,
    ) {
        this.addCommunityForm = this.fb.group({
            name: ['', Validators.required],
            requiresApproval: [false],
            locationName: ['', Validators.required],
            locationAddress: ['', Validators.required],
            locationCoordinatesLatitude: [null],
            locationCoordinatesLongitude: [null],
            picture: [null],
            description: [''],
        });
    }

    ngOnInit() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }


    onImageDrop(event: DragEvent) {
        event.preventDefault();
        if (event.dataTransfer?.files.length) {
            const file = event.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                this.imageFile = file;
                this.addCommunityForm.patchValue({ picture: file });
            } else {
                alert('Please drop a valid image file.');
            }
        }
    }

    allowDrag(event: DragEvent) {
        event.preventDefault();
    }

    onSubmit() {
        if (this.addCommunityForm.valid) {
            const newCommunity: UICommunity = this.addCommunityForm.value;
            this.communitiesService.addCommunity(newCommunity).subscribe({
                next: (createdCommunity) => {
                    this.addCommunityForm.reset();
                    this.router.navigate(['/hub/communities', createdCommunity.id]);
                },
                error: (error) => {
                    console.error('Failed to create community:', error);
                    // Handle error (show user feedback, etc.)
                },
            });
        }
    }

    setRequiresApproval(value: boolean) {
        this.addCommunityForm.patchValue({ requiresApproval: value });
    }
} 