import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TuiResponsiveDialogService } from '@taiga-ui/addon-mobile';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiAlertService, TuiButton, TuiIcon } from '@taiga-ui/core';
import { TUI_CONFIRM, TuiConfirmData } from '@taiga-ui/kit';
import { map } from 'rxjs';
import { CATEGORIES_SERVICE_TOKEN } from '../../admin.providers';
import {
  Column,
  TosTableComponent,
} from '../../components/tos-table/tos-table.component';
import {
  CategoriesService,
  UICategory,
} from '../../services/categories.service';
@Component({
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    TuiTable,
    TuiButton,
    TosTableComponent,
    TuiIcon,
    TosTableComponent,
    TranslateModule
  ],
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent {
  categories: UICategory[] = [];
  columns: Column[] = [
    {
      key: 'name',
      label: 'Name',
      custom: true,
      visible: true,
      sortable: true,
    },
    { key: 'template', label: 'Template', visible: false, size: 'l' },
  ];
  public constructor(
    private dialogs: TuiResponsiveDialogService,
    private alerts: TuiAlertService,
    @Inject(CATEGORIES_SERVICE_TOKEN)
    private categoriesService: CategoriesService,
  ) { }

  ngOnInit() {
    // Fetch the categories from the service
    this.categoriesService
      .getCategories()
      .subscribe((categories) => (this.categories = categories));
  }


  getDataFunction = (
    searchText?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    page?: number,
    pageSize?: number
  ) => {
    return this.categoriesService.getCategories().pipe(
      map((categories) => {
        return {
          totalPages: 1,
          totalItems: categories.length,
          currentPage: 0,
          itemsPerPage: categories.length,
          items: categories
        }
      })
    );
  }

  deleteCategory(category: UICategory) {
    const data: TuiConfirmData = {
      content: 'Are you sure you want to delete this user?', // Simple content
      yes: 'Yes, Delete',
      no: 'Cancel',
    };

    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: "Delete category '" + category.name + "'",
        size: 'm',
        data,
      })
      .subscribe((response) => {
        if (response) {
          this.alerts.open(
            'Category <strong>' +
            category.name +
            '</strong> deleted successfully',
            { appearance: 'positive' },
          ).subscribe();
        }
      });
  }
}
