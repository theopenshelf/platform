import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // Import this

@Component({
    selector: 'app-add-item',
    imports: [ReactiveFormsModule],
    templateUrl: './add-item.component.html',
    styleUrl: './add-item.component.css'
})
export class AddItemComponent {
  addItemForm: FormGroup;


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