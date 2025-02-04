import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterModule,
} from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TuiResponsiveDialogService } from '@taiga-ui/addon-mobile';
import {
  TuiAlertService,
  TuiAutoColorPipe,
  TuiButton,
  TuiDataList,
  TuiIcon,
  TuiInitialsPipe,
  TuiTextfield
} from '@taiga-ui/core';
import {
  TUI_CONFIRM,
  TuiAccordion,
  TuiAvatar,
  TuiConfirmData,
  TuiDataListWrapper,
  TuiSwitch
} from '@taiga-ui/kit';
import {
  TuiSelectModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/legacy';
import { EMPTY, switchMap } from 'rxjs';
import {
  LIBRARIES_SERVICE_TOKEN
} from '../../../community.provider';
import { FilteredAndPaginatedBorrowRecordsComponent } from '../../../components/filtered-and-paginated-borrow-records/filtered-and-paginated-borrow-records.component';
import { FilteredAndPaginatedItemsComponent } from '../../../components/filtered-and-paginated-items/filtered-and-paginated-items.component';
import { UILibrary } from '../../../models/UILibrary';
import { GetItemsParams } from '../../../services/items.service';
import { LibrariesService } from '../../../services/libraries.service';

@Component({
  selector: 'app-library',
  imports: [
    RouterModule,
    RouterLink,
    FormsModule,
    TuiIcon,
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
    FilteredAndPaginatedItemsComponent,
    FilteredAndPaginatedBorrowRecordsComponent,
    TranslateModule
  ],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss',
})
export class LibraryComponent {
  public getItemsParams: GetItemsParams = { libraryIds: [] };

  library: UILibrary | undefined;
  tabOpened: 'items' | 'borrow-records' = 'items';

  constructor(
    @Inject(LIBRARIES_SERVICE_TOKEN) private librariesService: LibrariesService,
    private dialogs: TuiResponsiveDialogService,
    private alerts: TuiAlertService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
  ) {
  }

  ngOnInit() {
    const libraryId = this.route.snapshot.paramMap.get('id');
    if (libraryId) {
      this.librariesService.getLibrary(libraryId).subscribe((library) => {
        this.library = library;
        this.getItemsParams = { libraryIds: [this.library.id] };
      });
    }

    // Check the current route to set the tabOpened property
    this.route.url.subscribe(urlSegments => {
      const path = urlSegments.map(segment => segment.path).join('/');
      if (path.includes('borrow-records')) {
        this.tabOpened = 'borrow-records';
      } else {
        this.tabOpened = 'items';
      }
    });
  }

  deleteLibrary(library: UILibrary): void {
    const data: TuiConfirmData = {
      content: this.translate.instant('library.confirmDeleteContent', { libraryName: library.name }),
      yes: this.translate.instant('library.yesDelete'),
      no: this.translate.instant('library.cancel'),
    };

    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: this.translate.instant('library.deleteLabel', { libraryName: library.name }),
        size: 'm',
        data,
      })
      .pipe(
        switchMap((response) => {
          if (response) {
            this.librariesService.deleteLibrary(library.id).subscribe(() => {
              this.alerts.open(this.translate.instant('library.deleteSuccess', { libraryName: library.name }), {
                appearance: 'positive',
              }).subscribe();
              this.router.navigate(['/community/libraries']);
            });
          }
          return EMPTY;
        }),
      )
      .subscribe();
  }

}