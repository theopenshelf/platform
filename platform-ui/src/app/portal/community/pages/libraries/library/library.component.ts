import { Component, Inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterModule,
} from '@angular/router';
import { TuiResponsiveDialogService } from '@taiga-ui/addon-mobile';
import {
  TuiAlertService,
  TuiAutoColorPipe,
  TuiButton,
  TuiDataList,
  TuiIcon,
  TuiIconPipe,
  TuiInitialsPipe,
  TuiTextfield,
} from '@taiga-ui/core';
import {
  TUI_CONFIRM,
  TuiAccordion,
  TuiAvatar,
  TuiConfirmData,
  TuiDataListWrapper,
  TuiSwitch,
} from '@taiga-ui/kit';
import {
  TuiSelectModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/legacy';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  ITEMS_SERVICE_TOKEN,
  LIBRARIES_SERVICE_TOKEN,
} from '../../../community.provider';
import { ItemCardComponent } from '../../../components/item-card/item-card.component';
import { UIBorrowRecord } from '../../../models/UIBorrowRecord';
import { UIItem } from '../../../models/UIItem';
import { UILibrary } from '../../../models/UILibrary';
import { ItemsService } from '../../../services/items.service';
import { LibrariesService } from '../../../services/libraries.service';
import { ItemsComponent } from '../../items/items.component';

@Component({
  selector: 'app-library',
  imports: [
    RouterModule,
    RouterLink,
    FormsModule,
    ItemCardComponent,
    TuiIcon,
    TuiIconPipe,
    TuiAccordion,
    TuiSwitch,
    TuiAvatar,
    TuiButton,
    TuiIcon,
    TuiInitialsPipe,
    TuiAutoColorPipe,
    TuiTextfieldControllerModule,
    ReactiveFormsModule,
    TuiTextfield,
    TuiDataList,
    TuiDataListWrapper,
    TuiSelectModule,
  ],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss',
})
export class LibraryComponent {
  searchText = '';
  selectedSortingOption = ItemsComponent.SORT_RECENTLY_ADDED; // Default sorting option

  library: UILibrary | undefined;
  items: UIItem[] = [];
  filteredItems: UIItem[] = [];
  currentUser: any = 'me@example.com'; //TODO: get current user from auth service

  protected sortingOptions = [
    ItemsComponent.SORT_RECENTLY_ADDED,
    ItemsComponent.SORT_MOST_BORROWED,
    ItemsComponent.SORT_FAVORITES,
  ];

  protected testValue = new FormControl<string | null>(null);

  markAsFavorite: (item: UIItem) => void = (item) => {
    console.log(`Item ${item.id} marked as favorite.`);
  };

  constructor(
    @Inject(LIBRARIES_SERVICE_TOKEN) private librariesService: LibrariesService,
    @Inject(ITEMS_SERVICE_TOKEN) private itemsService: ItemsService,
    private dialogs: TuiResponsiveDialogService,
    private alerts: TuiAlertService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    const libraryId = this.route.snapshot.paramMap.get('id');
    if (libraryId) {
      this.librariesService.getLibrary(libraryId).subscribe((library) => {
        this.library = library;
      });
      this.itemsService
        .getItems(undefined, undefined, undefined, [libraryId])
        .subscribe((itemsPagination) => {
          this.items = itemsPagination.items;
        });
    }
  }

  // Handle text filter change
  onTextFilterChange() {
    // The filtering is handled in the getter `filteredItems`
  }

  get filteredAndSortedItems() {
    const filtered = this.items.filter((item) =>
      item.name.toLowerCase().includes(this.searchText.toLowerCase()),
    );

    return filtered.sort((a, b) => {
      switch (this.testValue.value) {
        case ItemsComponent.SORT_RECENTLY_ADDED:
          return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
        case ItemsComponent.SORT_MOST_BORROWED:
          return (b.borrowCount || 0) - (a.borrowCount || 0);
        case ItemsComponent.SORT_FAVORITES:
          return (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0);
        default:
          return 0;
      }
    });
  }

  deleteLibrary(library: UILibrary): void {
    const data: TuiConfirmData = {
      content: 'Are you sure you want to delete this user?', // Simple content
      yes: 'Yes, Delete',
      no: 'Cancel',
    };

    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: "Delete library '" + library.name + "'",
        size: 'm',
        data,
      })
      .pipe(
        switchMap((response) => {
          this.alerts.open(
            'Library <strong>' +
              library.name +
              '</strong> deleted successfully',
            { appearance: 'positive' },
          );
          this.router.navigate(['/community/libraries']);
          return of(true);
        }),
      )
      .subscribe();

    this.librariesService.deleteLibrary(library.id).subscribe();
  }

  getBorrowRecords(itemId: string): UIBorrowRecord[] {
    return (
      this.items
        .find((item) => item.id === itemId)
        ?.borrowRecords.filter(
          (record) =>
            record.endDate >= new Date() &&
            record.borrowedBy === this.currentUser,
        ) || []
    );
  }
}
