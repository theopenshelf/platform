import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // Import this
import { QuillModule } from 'ngx-quill'; // Import ngx-quill if required
import { Item, ItemsService } from '../../services/items.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { CategoriesService, Category } from '../../services/categories.service';
import { communityProviders, ITEMS_SERVICE_TOKEN, CATEGORIES_SERVICE_TOKEN } from '../../community.provider';

@Component({
    selector: 'app-add-item',
    standalone: true, 
    imports: [CommonModule, ReactiveFormsModule, QuillModule], // Import required modules
    templateUrl: './add-item.component.html',
    styleUrl: './add-item.component.scss',
    providers: [
        ...communityProviders,
    ]
})
export class AddItemComponent {
  addItemForm: FormGroup;

  editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // Text formatting
      [{ 'header': 1 }, { 'header': 2 }],              // Headers
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],   // Lists
      [{ 'indent': '-1' }, { 'indent': '+1' }],        // Indentation
      [{ 'align': [] }],                               // Text alignment
      ['link', 'image'],                               // Links and images
      ['clean']                                        // Remove formatting
    ]
  };

  imageFile?: File;
  categories: Category[];

  constructor(
    private fb: FormBuilder,
    @Inject(ITEMS_SERVICE_TOKEN) private itemsService: ItemsService,
    @Inject(CATEGORIES_SERVICE_TOKEN) private categoriesService: CategoriesService,
    private router: Router
  ) {
    this.categories = this.categoriesService.getCategories();
    this.addItemForm = this.fb.group({
      name: ['', Validators.required],
      shortDescription: ['', [Validators.required, Validators.maxLength(150)]],
      description: ['', Validators.required],
      category: ['', [Validators.required], [
        (control) => {
          const categoryValue = control.value;
          const descriptionControl = this.addItemForm?.get('description');
          
          if (categoryValue && descriptionControl && !descriptionControl.value) {
            // Get selected category
            const category = this.categories?.find(c => c.name === categoryValue);
            if (category?.template) {
              return Promise.resolve().then(() => {
                descriptionControl.setValue(category.template);
                return null;
              });
            }
          }
          return Promise.resolve(null);
        }
      ]],
      image: [null, Validators.required],
    });
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
      newItem.category = this.categories.find(c => c.name === newItem.category);
      const createdItem = this.itemsService.addItem(newItem)
      this.addItemForm.reset();
      this.router.navigate(['/community/items', createdItem.id]);
    }
  }
}