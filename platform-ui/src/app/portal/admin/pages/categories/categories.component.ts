import { NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiButton, TuiTitle } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoriesService, Category } from '../../services/categories.service';


@Component({
    standalone: true,
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        NgForOf,
        TuiTable,
        TuiTitle,
        TuiButton,
    ],
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesComponent {
    categories: Category[] = [];

    public constructor(private categoriesService: CategoriesService) {
    }

    ngOnInit() {
        // Fetch the categories from the service
        this.categories = this.categoriesService.getCategories();
    }
}
