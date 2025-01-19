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
  TuiTable,
  TuiTablePagination,
  TuiTablePaginationEvent,
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
  TuiTitle
} from '@taiga-ui/core';
import { TuiCheckbox } from '@taiga-ui/kit';

import type { PolymorpheusContent } from '@taiga-ui/polymorpheus';

export type Column = {
  key: string;
  label: string;
  custom?: boolean;
  visible: boolean;
  sortable?: boolean;
  size?: 's' | 'm' | 'l';
};

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
    TuiTablePagination
  ],
  templateUrl: './tos-table.component.html',
  styleUrl: './tos-table.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class TosTableComponent {
  public addActionRoute = input.required<string>();
  public tableData = input.required<any[]>();
  public filterInput = signal<string>('');
  public columns = input.required<Column[]>();
  isMobile: boolean = true;

  @ContentChild('itemActionsTemplate', { read: TemplateRef })
  itemActionsTemplate!: TemplateRef<any>;
  @ContentChild('itemRowTemplate', { read: TemplateRef })
  itemRowTemplate!: TemplateRef<any>;
  @ContentChild('cardTemplate', { read: TemplateRef })
  cardTemplate!: TemplateRef<any>;

  protected currentSort = signal<string>('');
  protected sortOrder = signal<{ [key: string]: boolean }>({}); // True for ascending, false for descending
  protected page = 0;
  protected size = 10;
  protected total = computed(() => this.tableData().length);
  protected visibleColumns = computed<Column[]>(() => {
    return this.columns().filter(
      (column) => this.localColumnVisibility()[column.key] ?? column.visible,
    );
  });
  protected sortedData = computed<any[]>(() => {
    return this.tableData()
      .filter((item: any) => {
        const filterValue = this.filterInput().toLowerCase();
        const visibleKeys = this.visibleColumns().map((column) => column.key);
        return visibleKeys.some((key) =>
          String(item[key]).toLowerCase().includes(filterValue),
        );
      })
      .sort((a, b) => {
        const aValue = a[this.currentSort()];
        const bValue = b[this.currentSort()];

        if (this.sortOrder()[this.currentSort()]) {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        } else {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        }
      });
  });

  // Local state to manage column visibility
  private localColumnVisibility = signal<{ [key: string]: boolean }>({});

  constructor(
    private dialogs: TuiResponsiveDialogService,
    private alerts: TuiAlertService,
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit(): void {
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

    // Toggle sort order
    if (this.currentSort() === column) {
      const newSortOrder = {
        ...this.sortOrder(),
        [column]: !this.sortOrder()[column],
      };
      this.sortOrder.set(newSortOrder);
    } else {
      this.currentSort.set(column);
      const newSortOrder = { ...this.sortOrder(), [column]: true }; // Default to ascending for new column
      this.sortOrder.set(newSortOrder);
    }
  }

  protected onPagination({ page, size }: TuiTablePaginationEvent): void {
    this.page = page;
    this.size = size;
  }

  // Get the sorting icon (up or down)
  getSortIcon(column: string): string {
    return this.sortOrder()[column] ? '↑' : '↓';
  }

  onColumnVisibilityChange(column: Column): void {
    // Update the local visibility state
    const updatedVisibility = {
      ...this.localColumnVisibility(),
      [column.key]: column.visible,
    };
    this.localColumnVisibility.set(updatedVisibility);
  }
}
