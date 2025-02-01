import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  ContentChild,
  input,
  signal,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TuiResponsiveDialogService } from '@taiga-ui/addon-mobile';
import {
  TuiTable
} from '@taiga-ui/addon-table';
import {
  TuiAlertService,
  TuiButton,
  TuiDialogContext,
  TuiDropdown,
  TuiHint,
  TuiIcon,
  TuiSizeL,
  TuiSizeS,
  TuiTextfield,
  TuiTitle
} from '@taiga-ui/core';
import { TuiCheckbox, TuiPagination } from '@taiga-ui/kit';

import { TranslateModule } from '@ngx-translate/core';
import type { PolymorpheusContent } from '@taiga-ui/polymorpheus';
import { Observable } from 'rxjs';
export type Column = {
  key: string;
  label: string;
  custom?: boolean;
  visible: boolean;
  sortable?: boolean;
  size?: 's' | 'm' | 'l';
};

export interface ItemPagination {
  totalPages: number;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  items: any[];
}

@Component({
  selector: 'tos-table',
  imports: [
    CommonModule,
    TuiButton,
    TuiHint,
    ReactiveFormsModule,
    TuiCheckbox,
    TuiButton,
    RouterModule,
    FormsModule,
    TuiDropdown,
    TuiTable,
    TuiTitle,
    TuiIcon,
    TuiPagination,
    TranslateModule,
    TuiTextfield
  ],
  templateUrl: './tos-table.component.html',
  styleUrl: './tos-table.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class TosTableComponent {
  public addActionRoute = input.required<string>();
  public addActionIcon = input.required<string>();
  public filterInput = signal<string>('');
  public columns = input.required<Column[]>();
  public getDataFunction = input.required<(
    searchText?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    page?: number,
    pageSize?: number
  ) => Observable<ItemPagination>>();

  isMobile: boolean = true;

  @ContentChild('itemActionsTemplate', { read: TemplateRef })
  itemActionsTemplate!: TemplateRef<any>;
  @ContentChild('itemRowTemplate', { read: TemplateRef })
  itemRowTemplate!: TemplateRef<any>;
  @ContentChild('cardTemplate', { read: TemplateRef })
  cardTemplate!: TemplateRef<any>;

  protected currentSort = signal<string>('');
  public tableData = signal<any[]>([]);

  // Pagination properties
  totalPages: number = 10;
  currentPage: number = 1;
  itemsPerPage: number = 12; // Default value


  protected total = computed(() => this.tableData().length);
  protected visibleColumns = computed<Column[]>(() => {
    return this.columns().filter(
      (column) => this.localColumnVisibility()[column.key] ?? column.visible,
    );
  });


  // Local state to manage column visibility
  private localColumnVisibility = signal<{ [key: string]: boolean }>({});
  sortedColumn: string = '';
  sortOrder: boolean = true;

  constructor(
    private dialogs: TuiResponsiveDialogService,
    private alerts: TuiAlertService,
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit(): void {
    this.fetchData();

    this.localColumnVisibility.set(
      this.columns().reduce(
        (acc, column) => {
          acc[column.key] = column.visible;
          return acc;
        },
        {} as { [key: string]: boolean },
      ),
    );

    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.Handset])
      .subscribe((result) => {
        this.isMobile = result.matches;
      });
  }

  protected selectColumnsDialog(
    content: PolymorpheusContent<TuiDialogContext>,
    textFieldSize: TuiSizeL | TuiSizeS,
  ): void {
    this.dialogs.open(content, { data: { textFieldSize } }).subscribe();
  }

  getDataProperty(data: any, key: string): any {
    return data[key];
  }

  // Sort function with toggle for ascending/descending
  sort(column: string): void {

    const columnConfig = this.columns().find((col) => col.key === column);
    if (!columnConfig || !columnConfig.sortable) {
      return; // Exit if the column is not sortable
    }
    if (this.sortedColumn === column) {
      this.sortOrder = !this.sortOrder;
    } else {
      this.sortedColumn = column;
      this.sortOrder = true;
    }

    this.fetchData();
  }

  goToPage(page: number) {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.fetchData();
  }

  // Get the sorting icon (up or down)
  getSortIcon(column: string): string {
    return this.sortedColumn === column ? (this.sortOrder ? '↑' : '↓') : '';
  }

  onColumnVisibilityChange(column: Column): void {
    // Update the local visibility state
    const updatedVisibility = {
      ...this.localColumnVisibility(),
      [column.key]: column.visible,
    };
    this.localColumnVisibility.set(updatedVisibility);
  }

  fetchData() {
    this.getDataFunction()(
      this.filterInput(),
      this.sortedColumn,
      this.sortOrder ? 'asc' : 'desc',
      this.currentPage,
      this.itemsPerPage
    ).subscribe((itemsPagination) => {
      this.tableData.set(itemsPagination.items);
      this.totalPages = itemsPagination.totalPages;
      this.currentPage = itemsPagination.currentPage;
      this.itemsPerPage = itemsPagination.itemsPerPage;
    });
  }
}

