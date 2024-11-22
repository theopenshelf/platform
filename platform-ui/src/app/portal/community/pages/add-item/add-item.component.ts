import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // Import this
import { QuillModule } from 'ngx-quill'; // Import ngx-quill if required

@Component({
    selector: 'app-add-item',
    standalone: true, 
    imports: [ReactiveFormsModule, QuillModule], // Import required modules
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

  constructor(private fb: FormBuilder) {
    this.addItemForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.addItemForm.valid) {
      const newItem = this.addItemForm.value;
      alert('Item added successfully!');
      this.addItemForm.reset();
    }
  }
}