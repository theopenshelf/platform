import { Component } from '@angular/core';
import { FilteredAndPaginatedBorrowRecordsComponent } from '../../../../../components/filtered-and-paginated-borrow-records/filtered-and-paginated-borrow-records.component';
import { GetItemsParams } from '../../../../../models/GetItemsParams';
import { UILibrary } from '../../../../../models/UILibrary';
import { LibraryStateService } from '../library.service';

@Component({
  selector: 'app-library-approval',
  imports: [FilteredAndPaginatedBorrowRecordsComponent,
  ],
  templateUrl: './library-approval.component.html',
  styleUrl: './library-approval.component.scss'
})
export class LibraryApprovalComponent {
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
