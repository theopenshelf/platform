import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService, Category } from '../../services/categories.service';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { User, UsersService } from '../../services/users.service';
import { TuiAlertService, TuiButton, TuiTextfield } from '@taiga-ui/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import {TUI_DEFAULT_INPUT_COLORS, TuiInputColorModule} from '@taiga-ui/legacy';
import { QuillModule } from 'ngx-quill';
import { adminProviders, CATEGORIES_SERVICE_TOKEN } from '../../admin.providers';

@Component({
    standalone: true,
    selector: 'app-edit-category',
    imports: [
        QuillModule,
        TuiInputColorModule, 
        TuiTextfield,
        CommonModule,
        RouterLink,
        TuiButton,
        FormsModule,
        ReactiveFormsModule],
    templateUrl: './edit-category.component.html',
    styleUrls: ['./edit-category.component.scss'],
    providers: [
        ...adminProviders
    ],
})
export class EditCategoryComponent {
    categoryForm: FormGroup;
    categoryId: string | null = null;
    category: Category = { color: '#75358a' } as Category;
    protected readonly palette = TUI_DEFAULT_INPUT_COLORS;
    color: string = '';

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

    
    constructor(
        private route: ActivatedRoute,
        private fb: FormBuilder,
        @Inject(CATEGORIES_SERVICE_TOKEN) private categoriesService: CategoriesService,
        private router: Router
    ) {
        this.categoryForm = this.fb.group({
            name: ['', Validators.required],
            color: ['', Validators.required],
            template: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.categoryId = this.route.snapshot.paramMap.get('id');
        if (this.categoryId) {
          this.category = this.categoriesService.getCategory(this.categoryId);
          this.categoryForm.patchValue(this.category);
        } else {
            this.categoryForm.patchValue(this.category);
        }
      }

    onSubmit() {
        if (this.categoryForm.valid) {
            const newCategory: Category = this.categoryForm.value;
            this.categoriesService.addCategory(newCategory);
            this.router.navigate(['/admin/categories']);
        }
    }
} 