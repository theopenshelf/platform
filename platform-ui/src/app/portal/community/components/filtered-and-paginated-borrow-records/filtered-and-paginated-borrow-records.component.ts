import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AUTH_SERVICE_TOKEN } from '../../../../global.provider';
import { AuthService, UserInfo } from '../../../../services/auth.service';
import { CATEGORIES_SERVICE_TOKEN, ITEMS_SERVICE_TOKEN, LIBRARIES_SERVICE_TOKEN } from '../../community.provider';
import { UIBorrowRecordStandalone } from '../../models/UIBorrowRecordsPagination';
import { UILibrary } from '../../models/UILibrary';
import { UIPagination } from '../../models/UIPagination';
import { CategoriesService } from '../../services/categories.service';
import { GetItemsParams, ItemsService } from '../../services/items.service';
import { LibrariesService } from '../../services/libraries.service';
import { BorrowRecordCardComponent } from '../borrow-record-card/borrow-record-card.component';
import { FilteredAndPaginatedComponent } from '../filtered-and-paginated/filtered-and-paginated.component';

@Component({
  standalone: true,
  selector: 'filtered-and-paginated-borrow-records',
  imports: [
    BorrowRecordCardComponent,
    FilteredAndPaginatedComponent,
  ],
  templateUrl: './filtered-and-paginated-borrow-records.component.html',
  styleUrl: './filtered-and-paginated-borrow-records.component.scss'
})
export class FilteredAndPaginatedBorrowRecordsComponent {
  // Sorting properties

  static readonly defaultSortingOptions = [
    FilteredAndPaginatedComponent.SORT_RESERVATION_DATE,
    FilteredAndPaginatedComponent.SORT_START_DATE,
    FilteredAndPaginatedComponent.SORT_END_DATE,
    FilteredAndPaginatedComponent.SORT_RETURN_DATE,
  ];


  currentUser: UserInfo;
  libraries: UILibrary[] = [];

  public getItemsParams = input<GetItemsParams>({});
  public enableStatusFiltering = input<boolean>(false);
  public enableCategoriesFiltering = input<boolean>(true);
  public categoriesFilteringOpened = input<boolean>(true);
  public enableSearchBar = input<boolean>(false);
  public sortingOptions = input<string[]>(FilteredAndPaginatedBorrowRecordsComponent.defaultSortingOptions);


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


  public fetchItems = (getItemsParams: GetItemsParams): Observable<UIPagination<UIBorrowRecordStandalone>> => {
    return this.itemsService.getBorrowRecords(getItemsParams);
  }
}
