import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // Import this
import { QuillModule } from 'ngx-quill'; // Import ngx-quill if required
import { Item, ItemsService } from '../../services/items.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
    selector: 'app-add-item',
    standalone: true, 
    imports: [CommonModule, ReactiveFormsModule, QuillModule], // Import required modules
    templateUrl: './add-item.component.html',
    styleUrl: './add-item.component.css'
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

  constructor(
    private fb: FormBuilder,
    private itemsService: ItemsService,
    private router: Router
  ) {
    this.addItemForm = this.fb.group({
      name: ['', Validators.required],
      shortDescription: ['', [Validators.required, Validators.maxLength(150)]],
      description: ['', Validators.required],
      category: ['', Validators.required],
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
      const createdItem = this.itemsService.addItem(newItem)
      this.addItemForm.reset();
      this.router.navigate(['/community/items', createdItem.id]);
    }
  }
}