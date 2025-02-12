import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TuiAlertService, TuiButton, TuiDialog, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiAccordion } from '@taiga-ui/kit';
import { TuiInputModule } from '@taiga-ui/legacy';
import { QuillModule } from 'ngx-quill';
import { UIHelpArticle, UIHelpCategory } from '../../../../models/UIHelp';
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
    TuiTextfield,
    TranslateModule
  ],
  templateUrl: './help-center-edit.component.html',
  styleUrl: './help-center-edit.component.scss'
})
export class HelpCenterEditComponent {
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
  isMobile: boolean = false;

  constructor(@Inject(CUSTOM_PAGES_SERVICE_TOKEN) private customPagesService: CustomPagesService,
    private alerts: TuiAlertService,
    private fb: FormBuilder,
    private breakpointObserver: BreakpointObserver) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      icon: ['', Validators.required],
    });

    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
    });

    this.customPagesService.getCategories().subscribe(categories => {
      this.categories = categories.sort((a, b) => a.order - b.order);
      this.categoriesPerId = categories.reduce((acc, category) => {
        acc[category.id] = category;
        return acc;
      }, {} as { [key: string]: UIHelpCategory });
      this.selectedCategoryId = categories[0].id;
      this.selectCategory(this.selectedCategoryId!);
    });

    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isMobile = result.matches;
      });
  }

  selectCategory(categoryId: string) {
    this.selectedCategoryId = categoryId;
    if (this.articlesByCategory[categoryId]) {
      this.articles = this.articlesByCategory[categoryId];
    } else {
      this.customPagesService.getArticles(categoryId).subscribe(articles => {
        this.articles = articles.sort((a, b) => a.order - b.order);
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
          this.articlesByCategory[category.id] = articles.sort((a, b) => a.order - b.order);
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


  protected orderUp(category: UIHelpCategory): void {
    const currentIndex = this.categories.findIndex(cat => cat.id === category.id);
    if (currentIndex > 0) {
      const aboveCategory = this.categories[currentIndex - 1];
      const currentOrder = category.order;

      // Swap the order values
      category.order = aboveCategory.order;
      aboveCategory.order = currentOrder;
      this.categories.sort((a, b) => a.order - b.order);

      // Update both categories
      this.customPagesService.updateCategory(category).subscribe();
      this.customPagesService.updateCategory(aboveCategory).subscribe();
    }
  }

  protected orderDown(category: UIHelpCategory): void {
    const currentIndex = this.categories.findIndex(cat => cat.id === category.id);
    if (currentIndex < this.categories.length - 1) {
      const belowCategory = this.categories[currentIndex + 1];
      const currentOrder = category.order;

      category.order = belowCategory.order;
      belowCategory.order = currentOrder;
      this.categories.sort((a, b) => a.order - b.order);

      this.customPagesService.updateCategory(category).subscribe();
      this.customPagesService.updateCategory(belowCategory).subscribe();
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

  addCategory() {
    this.openCategoryDialog = true;
    this.currentCategory = {
      id: 'new',
      name: '',
      icon: '@tui.notebook',
      order: this.categories.length
    };
    this.categoryForm.patchValue({
      name: '',
      icon: '@tui.notebook'
    });
  }


  addArticle() {
    this.openArticleDialog = true;
    this.currentArticle = {
      id: 'new',
      title: '',
      content: '',
      order: this.articles.length,
      category: this.categoriesPerId[this.selectedCategoryId!]
    };
    this.articleForm.patchValue({
      title: '',
      content: ''
    });
  }

  setCategory() {
    if (this.categoryForm.valid) {
      const newCategory = this.categoryForm.get('name')?.value;
      const newIcon = this.categoryForm.get('icon')?.value;
      if (typeof newCategory === 'string' && this.currentCategory?.id) {
        if (this.currentCategory.id === 'new') {
          this.customPagesService.createCategory({ ...this.currentCategory, name: newCategory, icon: newIcon })
            .subscribe((newCategory) => {
              this.openCategoryDialog = false;
              this.articlesByCategory[newCategory.id] = [];
              this.categories.push(newCategory);
              this.categoriesPerId[newCategory.id] = newCategory;
              this.selectCategory(newCategory.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });

              this.alerts
                .open(
                  'Category <strong>' +
                  this.currentCategory?.name +
                  '</strong> created successfully',
                  { appearance: 'positive' },
                )
                .subscribe();
            });
        } else {
          this.customPagesService.updateCategory({ ...this.currentCategory, name: newCategory, icon: newIcon })
            .subscribe((newCategory) => {
              this.openCategoryDialog = false;
              this.categoriesPerId[this.currentCategory!.id] = newCategory;
              window.scrollTo({ top: 0, behavior: 'smooth' });
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
  }

  setArticle() {
    if (this.articleForm.valid) {
      const newArticle = this.articleForm.value;
      if (this.currentArticle?.id === 'new') {
        this.customPagesService.createArticle({ ...newArticle, category: this.categoriesPerId[this.selectedCategoryId!] }).subscribe((newArticle) => {
          this.openArticleDialog = false;
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.articles.push(newArticle);
          this.articles.sort((a, b) => a.order - b.order);

          this.alerts
            .open(
              'Article <strong>' +
              newArticle.title +
              '</strong> created successfully',
              { appearance: 'positive' },
            )
            .subscribe();
        });
      } else {
        this.customPagesService.updateArticle({ ...this.currentArticle!, title: newArticle.title, content: newArticle.content }).subscribe((newArticle) => {
          this.openArticleDialog = false;
          this.articles = this.articles.filter(article => article.id !== this.currentArticle!.id);
          this.articles.push(newArticle);
          this.articles.sort((a, b) => a.order - b.order);

          window.scrollTo({ top: 0, behavior: 'smooth' });
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

  protected orderUpArticle(article: UIHelpArticle): void {
    if (this.selectedCategoryId) {
      var articles = this.articlesByCategory[this.selectedCategoryId];
      const currentIndex = articles.findIndex(art => art.id === article.id);
      if (currentIndex > 0) {
        const aboveArticle = articles[currentIndex - 1];
        const currentOrder = article.order;

        // Swap the order values
        article.order = aboveArticle.order;
        aboveArticle.order = currentOrder;
        articles.sort((a, b) => a.order - b.order);

        // Update both articles
        this.customPagesService.updateArticle(article).subscribe();
        this.customPagesService.updateArticle(aboveArticle).subscribe();
      }
    }
  }

  protected orderDownArticle(article: UIHelpArticle): void {
    if (this.selectedCategoryId) {
      var articles = this.articlesByCategory[this.selectedCategoryId];
      const currentIndex = articles.findIndex(art => art.id === article.id);
      if (currentIndex < articles.length - 1) {
        const belowArticle = articles[currentIndex + 1];
        const currentOrder = article.order;

        // Swap the order values
        article.order = belowArticle.order;
        belowArticle.order = currentOrder;
        this.articles.sort((a, b) => a.order - b.order);

        // Update both articles
        this.customPagesService.updateArticle(article).subscribe();
        this.customPagesService.updateArticle(belowArticle).subscribe();
      }
    }
  }
}
