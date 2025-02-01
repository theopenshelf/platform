import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TuiIcon } from '@taiga-ui/core';
import { TuiAccordion } from '@taiga-ui/kit';
import { HELP_SERVICE_TOKEN } from '../../community.provider';
import { UIHelpArticle, UIHelpCategory } from '../../models/UIHelp';
import { HelpService } from '../../services/help.service';

@Component({
  selector: 'app-help-center',
  imports: [
    TuiAccordion,
    TuiIcon,
    FormsModule,
    TranslateModule
  ],

  templateUrl: './help-center.component.html',
  styleUrl: './help-center.component.scss'
})
export class HelpCenterComponent {
  categoriesPerId: { [key: string]: UIHelpCategory } = {};
  categories: UIHelpCategory[] = [];
  articles: UIHelpArticle[] = [];
  articlesByCategory: { [key: string]: UIHelpArticle[] } = {};

  selectedCategoryId: string | null = null;
  searchText = '';

  constructor(@Inject(HELP_SERVICE_TOKEN) private helpService: HelpService) {
    this.helpService.getCategories().subscribe(categories => {
      this.categories = categories.sort((a, b) => a.order - b.order);
      this.categoriesPerId = categories.reduce((acc, category) => {
        acc[category.id] = category;
        return acc;
      }, {} as { [key: string]: UIHelpCategory });
      this.selectedCategoryId = categories[0].id;
      this.selectCategory(this.selectedCategoryId!);
    });
  }

  ngOnInit() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  selectCategory(categoryId: string) {
    this.selectedCategoryId = categoryId;
    if (this.articlesByCategory[categoryId]) {
      this.articles = this.articlesByCategory[categoryId];
    } else {
      this.helpService.getArticles(categoryId).subscribe(articles => {
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
        this.helpService.getArticles(category.id).subscribe(articles => {
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

}
