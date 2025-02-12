import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiTextfield } from '@taiga-ui/core';
import { TuiAccordion, TuiTabs } from '@taiga-ui/kit';
import {
  TuiSelectModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/legacy';
import { UILibrary } from '../../../../models/UILibrary';
import {
  LIBRARIES_SERVICE_TOKEN
} from '../../community.provider';
import { FilteredAndPaginatedBorrowRecordsComponent } from '../../components/filtered-and-paginated-borrow-records/filtered-and-paginated-borrow-records.component';
import { GetItemsParams } from '../../services/items.service';
import { LibrariesService } from '../../services/libraries.service';

@Component({
  standalone: true,
  selector: 'app-myborroweditems',
  imports: [
    CommonModule,
    TuiTextfieldControllerModule,
    FormsModule,
    TuiTable,
    TuiSelectModule,
    TuiTextfield,
    FormsModule,
    ReactiveFormsModule,
    TuiAccordion,
    TuiTabs,
    FilteredAndPaginatedBorrowRecordsComponent
  ],
  templateUrl: './borroweditems.component.html',
  styleUrls: ['./borroweditems.component.scss'],
})
export class BorrowedItemsComponent implements OnInit {

  public getItemsParams: GetItemsParams = {
    borrowedByCurrentUser: true,
  };
  libraries: UILibrary[] = [];

  constructor(
    @Inject(LIBRARIES_SERVICE_TOKEN) private librariesService: LibrariesService,
  ) {
  }

  ngOnInit() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.librariesService.getLibraries().subscribe((libraries) => {
      this.libraries = libraries;
    });
  }

  getLibrary(libraryId: string): UILibrary | undefined {
    return this.libraries.find((library) => library.id === libraryId);
  }
}