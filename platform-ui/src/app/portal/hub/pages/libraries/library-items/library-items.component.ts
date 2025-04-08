import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { FilteredAndPaginatedItemsComponent } from '../../../../../components/filtered-and-paginated-items/filtered-and-paginated-items.component';
import { GetItemsParams } from '../../../../../models/GetItemsParams';
import { UILibrary } from '../../../../../models/UILibrary';
import { LibraryStateService } from '../library.service';

@Component({
  selector: 'app-library-items',
  imports: [
    FilteredAndPaginatedItemsComponent,
    TuiIcon,
    TuiButton,
    TranslateModule
  ],
  templateUrl: './library-items.component.html',
  styleUrl: './library-items.component.scss'
})
export class LibraryItemsComponent {
  library: UILibrary | null = null;
  public getItemsParams: GetItemsParams | undefined;

  constructor(
    private libraryState: LibraryStateService
  ) {
    this.libraryState.library$.subscribe(library => this.library = library);
    this.getItemsParams = {
      libraryIds: [this.library!.id],
      borrowedByCurrentUser: !this.library!.isAdmin
    };
  }
}
