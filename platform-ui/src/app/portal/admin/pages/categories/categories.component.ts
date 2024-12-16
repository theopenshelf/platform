
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TuiResponsiveDialogService } from '@taiga-ui/addon-mobile';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiAlertService, TuiButton, TuiTitle } from '@taiga-ui/core';
import { TUI_CONFIRM, TuiConfirmData } from '@taiga-ui/kit';
import { switchMap } from 'rxjs';
import { CategoryBadgeComponent } from '../../../../components/category-badge/category-badge.component';
import { adminProviders, CATEGORIES_SERVICE_TOKEN } from '../../admin.providers';
import { CategoriesService, UICategory } from '../../services/categories.service';


@Component({
    standalone: true,
    imports: [
    CategoryBadgeComponent,
    RouterModule,
    FormsModule,
    TuiTable,
    TuiTitle,
    TuiButton
],
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss'],
    providers: [
        ...adminProviders
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesComponent {

    categories: UICategory[] = [];

    public constructor(
        private dialogs: TuiResponsiveDialogService,
        private alerts: TuiAlertService,
        @Inject(CATEGORIES_SERVICE_TOKEN) private categoriesService: CategoriesService
    ) {
    }

    ngOnInit() {
        // Fetch the categories from the service
        this.categoriesService.getCategories().subscribe(categories => this.categories = categories);
    }

    deleteCategory(category: UICategory) {
        const data: TuiConfirmData = {
            content: 'Are you sure you want to delete this user?',  // Simple content
            yes: 'Yes, Delete',
            no: 'Cancel',
        };

        this.dialogs
            .open<boolean>(TUI_CONFIRM, {
                label: "Delete category '" + category.name + "'",
                size: 'm',
                data,
            })
            .pipe(switchMap((response) => this.alerts.open('Category <strong>' + category.name + '</strong> deleted successfully', { appearance: 'positive' })))
            .subscribe();
    }
}
