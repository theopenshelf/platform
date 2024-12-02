import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService, Category } from '../../services/categories.service';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { User, UsersService } from '../../services/users.service';
import { TuiAlertService, TuiButton } from '@taiga-ui/core';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
    standalone: true,
    selector: 'app-edit-category',
    imports: [
        CommonModule,
        RouterLink,
        TuiButton,
        FormsModule,
        ReactiveFormsModule],
    templateUrl: './edit-category.component.html',
    styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent {
    categoryForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private categoriesService: CategoriesService,
        private router: Router
    ) {
        this.categoryForm = this.fb.group({
            name: ['', Validators.required],
            template: ['', Validators.required]
        });
    }

    onSubmit() {
        if (this.categoryForm.valid) {
            const newCategory: Category = this.categoryForm.value;
            this.categoriesService.addCategory(newCategory);
            this.router.navigate(['/categories']);
        }
    }
} 