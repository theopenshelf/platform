import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiAlertService, TuiButton, TuiDialog, TuiIcon } from '@taiga-ui/core';
import { TuiAccordion } from '@taiga-ui/kit';
import { TuiInputModule } from '@taiga-ui/legacy';
import { QuillModule } from 'ngx-quill';
import { UIHelpArticle, UIHelpCategory } from '../../../community/models/UIHelp';
import { CUSTOM_PAGES_SERVICE_TOKEN } from '../../admin.providers';
import { CustomPagesService } from '../../services/custom-pages.service';

@Component({
  selector: 'app-faq-edit',
  standalone: true,
  imports: [
    QuillModule,
    ReactiveFormsModule,
    TuiAccordion,
    TuiIcon,
    FormsModule,
    TuiButton,
    TuiDialog,
    TuiInputModule,

  ],
  templateUrl: './faq-edit.component.html',
  styleUrl: './faq-edit.component.scss'
})
export class FaqEditComponent {
  categoriesPerId: { [key: string]: UIHelpCategory } = {};
  categories: UIHelpCategory[] = [];
  articles: UIHelpArticle[] = [];
  articlesByCategory: { [key: string]: UIHelpArticle[] } = {};

  selectedCategoryId: string | null = null;
  searchText = '';
  categoryForm: FormGroup;
  articleForm: FormGroup;

  protected openCategoryDialog = false;
  currentCategory: UIHelpCategory | null = null;
  currentArticle: UIHelpArticle | null = null;
  openArticleDialog = false;

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

  constructor(@Inject(CUSTOM_PAGES_SERVICE_TOKEN) private customPagesService: CustomPagesService,
    private alerts: TuiAlertService,
    private fb: FormBuilder) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      icon: ['', Validators.required],
    });

    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
    });

    this.customPagesService.getCategories().subscribe(categories => {
      this.categories = categories;
      this.categoriesPerId = categories.reduce((acc, category) => {
        acc[category.id] = category;
        return acc;
      }, {} as { [key: string]: UIHelpCategory });
      this.selectedCategoryId = categories[0].id;
      this.selectCategory(this.selectedCategoryId!);
    });
  }

  selectCategory(categoryId: string) {
    this.selectedCategoryId = categoryId;
    if (this.articlesByCategory[categoryId]) {
      this.articles = this.articlesByCategory[categoryId];
    } else {
      this.customPagesService.getArticles(categoryId).subscribe(articles => {
        this.articles = articles;
        this.articlesByCategory[categoryId] = articles;
      });
    }
  }

  onTextFilterChange() {
    if (this.searchText.length < 3) {
      return;
    }

    this.selectedCategoryId = null;
    this.categories.forEach(category => {
      if (!this.articlesByCategory[category.id]) {
        this.customPagesService.getArticles(category.id).subscribe(articles => {
          this.articlesByCategory[category.id] = articles;
        });
      }
    });
    this.filterArticles();

  }

  private filterArticles() {
    const searchTextLower = this.searchText.toLowerCase();
    this.articles = [];

    for (const categoryId in this.articlesByCategory) {
      const filteredArticles = this.articlesByCategory[categoryId].filter(article =>
        article.title.toLowerCase().includes(searchTextLower) ||
        article.content.toLowerCase().includes(searchTextLower)
      );
      this.articles.push(...filteredArticles);
    }
  }

  protected editCategory(category: UIHelpCategory): void {
    this.openCategoryDialog = true;
    this.currentCategory = category;
    this.categoryForm.patchValue({
      name: category.name,
      icon: category.icon
    });
  }

  protected editArticle(article: UIHelpArticle): void {
    this.openArticleDialog = true;
    this.currentArticle = article;
    this.articleForm.patchValue({
      title: article.title,
      content: article.content
    });
  }

  setCategory() {
    if (this.categoryForm.valid) {
      const newCategory = this.categoryForm.get('name')?.value;
      const newIcon = this.categoryForm.get('icon')?.value;
      if (typeof newCategory === 'string' && this.currentCategory?.id) {
        this.customPagesService.updateCategory({ ...this.currentCategory, name: newCategory, icon: newIcon })
          .subscribe(() => {
            this.openCategoryDialog = false;
            this.alerts
              .open(
                'Category <strong>' +
                this.currentCategory?.name +
                '</strong> edited successfully',
                { appearance: 'positive' },
              )
              .subscribe();
          });
      }
    }
  }

  setArticle() {
    if (this.articleForm.valid) {
      const newArticle = this.articleForm.value;
      this.customPagesService.updateArticle(newArticle).subscribe(() => {
        this.openArticleDialog = false;
        this.alerts
          .open(
            'Article <strong>' +
            this.currentArticle?.title +
            '</strong> edited successfully',
            { appearance: 'positive' },
          )
          .subscribe();
      });
    }
  }
}
