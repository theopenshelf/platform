import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AUTH_SERVICE_TOKEN } from '../../../../global.provider';
import { AuthService, UserInfo } from '../../../../services/auth.service';
import { CATEGORIES_SERVICE_TOKEN, ITEMS_SERVICE_TOKEN, LIBRARIES_SERVICE_TOKEN } from '../../community.provider';
import { UIBorrowRecord } from '../../models/UIBorrowRecord';
import { UIItem } from '../../models/UIItem';
import { UILibrary } from '../../models/UILibrary';
import { UIPagination } from '../../models/UIPagination';
import { CategoriesService } from '../../services/categories.service';
import { GetItemsParams, ItemsService } from '../../services/items.service';
import { LibrariesService } from '../../services/libraries.service';
import { BorrowItemCardComponent } from '../borrow-item-card/borrow-item-card.component';
import { FilteredAndPaginatedComponent } from '../filtered-and-paginated/filtered-and-paginated.component';

@Component({
  standalone: true,
  selector: 'filtered-and-paginated-borrow-records',
  imports: [
    BorrowItemCardComponent,
    FilteredAndPaginatedComponent,
  ],
  templateUrl: './filtered-and-paginated-borrow-records.component.html',
  styleUrl: './filtered-and-paginated-borrow-records.component.scss'
})
export class FilteredAndPaginatedBorrowRecordsComponent {
  currentUser: UserInfo;
  libraries: UILibrary[] = [];

  public getItemsParams = input<GetItemsParams>({});
  public enableStatusFiltering = input<boolean>(false);
  public enableCategoriesFiltering = input<boolean>(true);
  public categoriesFilteringOpened = input<boolean>(true);
  public enableSearchBar = input<boolean>(false);
  public sortingOptions = input<string[]>(FilteredAndPaginatedComponent.defaultSortingOptions);

  constructor(
    @Inject(ITEMS_SERVICE_TOKEN) protected itemsService: ItemsService,
    @Inject(CATEGORIES_SERVICE_TOKEN) protected categoriesService: CategoriesService,
    @Inject(LIBRARIES_SERVICE_TOKEN) protected librariesService: LibrariesService,
    @Inject(AUTH_SERVICE_TOKEN) protected authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.currentUser = this.authService.getCurrentUserInfo()

  }

  ngOnInit() {
    this.librariesService.getLibraries().subscribe((libraries) => {
      this.libraries = libraries;
    });
  }


  getLibrary(libraryId: string): UILibrary | undefined {
    return this.libraries.find((library) => library.id === libraryId);
  }

  getBorrowRecords(item: UIItem): UIBorrowRecord[] {
    return (
      item
        ?.borrowRecords.filter(
          (record) =>
            record.endDate >= new Date() &&
            record.borrowedBy === this.currentUser.email,
        ) || []
    );
  }

  public fetchItems = (getItemsParams: GetItemsParams): Observable<UIPagination<UIItem>> => {
    return this.itemsService.getItems(getItemsParams);
  }
}
