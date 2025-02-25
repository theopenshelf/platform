import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, ContentChild, Inject, input, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AUTH_SERVICE_TOKEN } from '../../global.provider';
import { GetItemsParams } from '../../models/GetItemsParams';
import { UIBorrowRecord } from '../../models/UIBorrowRecord';
import { UICommunity } from '../../models/UICommunity';
import { UIItem } from '../../models/UIItem';
import { isLibraryAdmin, UILibrary } from '../../models/UILibrary';
import { UIPagination } from '../../models/UIPagination';
import { CATEGORIES_SERVICE_TOKEN, COMMUNITIES_SERVICE_TOKEN, ITEMS_SERVICE_TOKEN, LIBRARIES_SERVICE_TOKEN } from '../../portal/hub/hub.provider';
import { CategoriesService } from '../../portal/hub/services/categories.service';
import { CommunitiesService } from '../../portal/hub/services/communities.service';
import { ItemsService } from '../../portal/hub/services/items.service';
import { LibrariesService } from '../../portal/hub/services/libraries.service';
import { AuthService, UserInfo } from '../../services/auth.service';
import { BorrowDialogService } from '../borrow-dialog/borrow-dialog.service';
import { FilteredAndPaginatedComponent } from '../filtered-and-paginated/filtered-and-paginated.component';
import { ItemCardComponent } from '../item-card/item-card.component';

@Component({
  standalone: true,
  selector: 'filtered-and-paginated-items',
  imports: [
    CommonModule,
    ItemCardComponent,
    FilteredAndPaginatedComponent,
  ],
  templateUrl: './filtered-and-paginated-items.component.html',
  styleUrl: './filtered-and-paginated-items.component.scss'
})
export class FilteredAndPaginatedItemsComponent {
  currentUser: UserInfo;
  libraries: UILibrary[] = [];
  public community = input<UICommunity>();
  public getItemsParams = input<GetItemsParams>({});
  public enableStatusFiltering = input<boolean>(false);
  public enableCategoriesFiltering = input<boolean>(true);
  public categoriesFilteringOpened = input<boolean>(true);
  public enableSearchBar = input<boolean>(false);
  public sortingOptions = input<string[]>(FilteredAndPaginatedComponent.defaultSortingOptions);
  @ContentChild('libraryTemplate', { read: TemplateRef })
  libraryTemplate!: TemplateRef<any>;
  @ViewChild(FilteredAndPaginatedComponent) filteredAndPaginatedComponent!: FilteredAndPaginatedComponent;
  communities: UICommunity[] = [];

  constructor(
    @Inject(ITEMS_SERVICE_TOKEN) protected itemsService: ItemsService,
    @Inject(CATEGORIES_SERVICE_TOKEN) protected categoriesService: CategoriesService,
    @Inject(LIBRARIES_SERVICE_TOKEN) protected librariesService: LibrariesService,
    @Inject(AUTH_SERVICE_TOKEN) protected authService: AuthService,
    @Inject(COMMUNITIES_SERVICE_TOKEN) protected communitiesService: CommunitiesService,
    private borrowDialogService: BorrowDialogService,
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.currentUser = this.authService.getCurrentUserInfo()

  }

  ngOnInit() {
    if (this.community()) {
      this.librariesService.getLibrariesByCommunityId(this.community()!.id).subscribe((libraries) => {
        this.libraries = libraries;
      });
    } else {
      this.librariesService.getLibraries().subscribe((libraries) => {
        this.libraries = libraries;
      });
      this.communitiesService.getCommunities({ isMember: true, page: 1, pageSize: 100 }).subscribe((communities) => {
        this.communities = communities.items;
      });
    }
  }

  getCommunity(libraryId: string): UICommunity | undefined {
    const library = this.getLibrary(libraryId);
    if (library) {
      return this.communities.find((community) => community.id === library.communityId);
    }
    return undefined;
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
            record.borrowedBy === this.currentUser.user.id,
        ) || []
    );
  }

  public fetchItems = (getItemsParams: GetItemsParams): Observable<UIPagination<UIItem>> => {
    return this.itemsService.getItems(getItemsParams);
  }

  public borrowNow = (item: UIItem) => {
    this.borrowDialogService.borrowNowDialog(this.currentUser, isLibraryAdmin(this.currentUser.user, this.getLibrary(item.libraryId)!), item, this.getLibrary(item.libraryId)!, this.itemsService).subscribe(i => {
      this.filteredAndPaginatedComponent.resetItems();
    });
  }

  public reserveItem = (item: UIItem) => {
    this.borrowDialogService.reserveItem(this.currentUser, isLibraryAdmin(this.currentUser.user, this.getLibrary(item.libraryId)!), item, this.itemsService, this.getLibrary(item.libraryId)!).subscribe(i => {
      this.filteredAndPaginatedComponent.resetItems();
    });
  }
}
