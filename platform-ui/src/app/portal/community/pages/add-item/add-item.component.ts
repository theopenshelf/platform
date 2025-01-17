import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiDataListWrapper, TuiStringifyContentPipe } from '@taiga-ui/kit';
import {
  TuiComboBoxModule,
  TuiSelectModule,
  TuiTextareaModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/legacy';
import { QuillModule } from 'ngx-quill';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  CATEGORIES_SERVICE_TOKEN,
  ITEMS_SERVICE_TOKEN,
} from '../../community.provider';
import { UICategory } from '../../models/UICategory';
import { CategoriesService } from '../../services/categories.service';
import { ItemsService } from '../../services/items.service';

@Component({
  selector: 'app-add-item',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    QuillModule,
    TuiButton,
    TuiStringifyContentPipe,
    TuiTextfieldControllerModule,
    TuiTextfield,
    TuiComboBoxModule,
    TuiDataListWrapper,
    TuiSelectModule,
    TuiTextareaModule,
    ReactiveFormsModule,
    FormsModule
],
  templateUrl: './add-item.component.html',
  styleUrl: './add-item.component.scss',
})
export class AddItemComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  addItemForm: FormGroup;

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

  imageFile?: File;
  categories: UICategory[] = [];

  constructor(
    private fb: FormBuilder,
    @Inject(ITEMS_SERVICE_TOKEN) private itemsService: ItemsService,
    @Inject(CATEGORIES_SERVICE_TOKEN)
    private categoriesService: CategoriesService,
    private router: Router,
  ) {
    this.addItemForm = this.fb.group({
      name: ['', Validators.required],
      shortDescription: ['', [Validators.required, Validators.maxLength(150)]],
      description: ['', Validators.required],
      category: [
        '',
        [Validators.required],
        [
          (control) => {
            const categoryValue = control.value;
            const descriptionControl = this.addItemForm?.get('description');

            if (
              categoryValue &&
              descriptionControl &&
              !descriptionControl.value
            ) {
              // Get selected category
              const category = this.categories?.find(
                (c) => c.name === categoryValue,
              );
              if (category?.template) {
                return Promise.resolve().then(() => {
                  descriptionControl.setValue(category.template);
                  return null;
                });
              }
            }
            return Promise.resolve(null);
          },
        ],
      ],
      image: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.categoriesService
      .getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => {
          this.categories = categories;
        },
        error: (error) => {
          console.error('Failed to load categories:', error);
          // Handle error (show user feedback, etc.)
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onImageDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
      const file = event.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        this.imageFile = file;
        this.addItemForm.patchValue({ image: file });
      } else {
        alert('Please drop a valid image file.');
      }
    }
  }

  allowDrag(event: DragEvent) {
    event.preventDefault();
  }

  onSubmit() {
    if (this.addItemForm.valid) {
      const newItem = this.addItemForm.value;
      newItem.category = this.categories.find(
        (c) => c.name === newItem.category,
      );
      this.itemsService.addItem(newItem).subscribe({
        next: (createdItem) => {
          this.addItemForm.reset();
          this.router.navigate(['/community/items', createdItem.id]);
        },
        error: (error) => {
          console.error('Failed to create item:', error);
          // Handle error (show user feedback, etc.)
        },
      });
    }
  }

  protected readonly stringify = (category: UICategory): string =>
    category ? `${category.name}` : 'Category';
}
