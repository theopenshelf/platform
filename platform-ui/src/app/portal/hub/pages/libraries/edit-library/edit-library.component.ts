import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  TuiButton,
  TuiTextfield
} from '@taiga-ui/core';
import { TuiSwitch } from '@taiga-ui/kit';
import { QuillModule } from 'ngx-quill';
import { UILibrary } from '../../../../../models/UILibrary';
import { LIBRARIES_SERVICE_TOKEN } from '../../../hub.provider';
import { LibrariesService } from '../../../services/libraries.service';
@Component({
  selector: 'app-edit-library',
  templateUrl: './edit-library.component.html',
  styleUrls: ['./edit-library.component.scss'],
  imports: [
    QuillModule,
    ReactiveFormsModule,
    TuiSwitch,
    TuiButton,
    TuiTextfield,
    TranslateModule
  ],
})
export class EditLibraryComponent implements OnInit {
  editLibraryForm!: FormGroup;
  libraryId: string | null = null;

  editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // Text formatting
      [{ header: 1 }, { header: 2 }], // Headers
      [{ list: 'ordered' }, { list: 'bullet' }], // Lists
      [{ indent: '-1' }, { indent: '+1' }], // Indentation
      [{ align: [] }], // Text alignment
      ['link', 'image'], // Links and images
      ['clean'], // Remove formatting
    ],
  };

  constructor(
    @Inject(LIBRARIES_SERVICE_TOKEN) private librariesService: LibrariesService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.editLibraryForm = this.fb.group({
      name: ['', Validators.required],
      isHubAccessible: [false],
      instructions: [''],
      location: this.fb.group({
        name: ['', Validators.required],
        address: ['', Validators.required],
      }),
    });
    this.libraryId = this.route.snapshot.paramMap.get('id');
    if (this.libraryId) {
      this.librariesService.getLibrary(this.libraryId).subscribe((library) => {
        this.editLibraryForm.patchValue(library);
      });
    }
  }

  onSubmit(): void {
    if (this.editLibraryForm.valid) {
      const updatedLibrary: UILibrary = this.editLibraryForm.value;
      if (this.libraryId) {
        this.librariesService
          .updateLibrary(this.libraryId, updatedLibrary)
          .subscribe(() => {
            this.router.navigate(['/hub/libraries', this.libraryId]);
          });
      } else {
        this.librariesService.addLibrary(updatedLibrary).subscribe(() => {
          this.router.navigate(['/hub/libraries']);
        });
      }
    }
  }
}
