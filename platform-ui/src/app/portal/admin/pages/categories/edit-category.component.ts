import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiButton, TuiTextfield } from '@taiga-ui/core';
import { TUI_DEFAULT_INPUT_COLORS, TuiInputColorModule } from '@taiga-ui/legacy';
import { QuillModule } from 'ngx-quill';
import { CATEGORIES_SERVICE_TOKEN } from '../../admin.providers';
import { CategoriesService, UICategory } from '../../services/categories.service';

@Component({
    standalone: true,
    selector: 'app-edit-category',
    imports: [
        QuillModule,
        TuiInputColorModule,
        TuiTextfield,
        FormsModule,
        ReactiveFormsModule,
        TuiButton,
    ],
    templateUrl: './edit-category.component.html',
    styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent {
    categoryForm: FormGroup;
    categoryId: string | null = null;
    category: UICategory = { color: '#75358a' } as UICategory;
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
            this.categoriesService.getCategory(this.categoryId).subscribe(category => {
                this.category = category;
                this.categoryForm.patchValue(this.category);
            });
        } else {
            this.categoryForm.patchValue(this.category);
        }
    }

    onSubmit() {
        if (this.categoryForm.valid) {
            const newCategory: UICategory = this.categoryForm.value;
            this.categoriesService.addCategory(newCategory);
            this.router.navigate(['/admin/categories']);
        }
    }
} 