import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TuiTable } from '@taiga-ui/addon-table';
import {
  TuiButton,
  TuiDropdown,
  TuiIcon
} from '@taiga-ui/core';
import {
  TUI_CONFIRM,
  TuiConfirmData,
  TuiItemsWithMore
} from '@taiga-ui/kit';

import { BreakpointObserver } from '@angular/cdk/layout';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TuiAlertService, TuiDialogService } from '@taiga-ui/core';
import { ITEMS_SERVICE_TOKEN } from '../../admin.providers';
import {
  Column,
  TosTableComponent,
} from '../../components/tos-table/tos-table.component';
import { ItemsService, UIItemWithStats } from '../../services/items.service';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    TuiDropdown,
    TuiItemsWithMore,
    TuiTable,
    TuiButton,
    TuiIcon,
    TosTableComponent,
    TranslateModule
  ],
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemsComponent {
  items: UIItemWithStats[] = [];
  columns: Column[] = [];

  public constructor(
    @Inject(ITEMS_SERVICE_TOKEN) private itemsService: ItemsService,
    private breakpointObserver: BreakpointObserver,
    private translate: TranslateService,
    private dialogs: TuiDialogService,
    private alerts: TuiAlertService,
  ) {
    this.columns = [
      {
        key: 'img',
        label: this.translate.instant('items.columns.image'),
        custom: true,
        visible: true,
        sortable: false,
        size: 's',
      },
      {
        key: 'name',
        label: this.translate.instant('items.columns.name'),
        custom: false,
        visible: true,
        sortable: true,
        size: 'l',
      },
      {
        key: 'located',
        label: this.translate.instant('items.columns.located'),
        custom: false,
        visible: true,
        sortable: true,
        size: 'm',
      },
      {
        key: 'owner',
        label: this.translate.instant('items.columns.owner'),
        custom: false,
        visible: false,
        sortable: true,
        size: 'm',
      },
      {
        key: 'imageUrl',
        label: this.translate.instant('items.columns.imageUrl'),
        custom: false,
        visible: false,
        sortable: false,
        size: 'm',
      },
      {
        key: 'description',
        label: this.translate.instant('items.columns.description'),
        custom: false,
        visible: false,
        sortable: false,
        size: 'l',
      },
      {
        key: 'shortDescription',
        label: this.translate.instant('items.columns.shortDescription'),
        custom: false,
        visible: false,
        sortable: false,
        size: 'l',
      },
      {
        key: 'category',
        label: this.translate.instant('items.columns.category'),
        custom: true,
        visible: true,
        sortable: true,
        size: 'm',
      },
      {
        key: 'favorite',
        label: this.translate.instant('items.columns.favorite'),
        custom: false,
        visible: false,
        sortable: false,
        size: 's',
      },
      {
        key: 'borrowCount',
        label: this.translate.instant('items.columns.borrowCount'),
        custom: false,
        visible: true,
        sortable: true,
        size: 's',
      },
      {
        key: 'lateReturnPercentage',
        label: this.translate.instant('items.columns.lateReturnPercentage'),
        custom: false,
        visible: true,
        sortable: true,
        size: 's',
      },
      {
        key: 'averageDuration',
        label: this.translate.instant('items.columns.averageDuration'),
        custom: false,
        visible: true,
        sortable: true,
        size: 's',
      },
    ];

  }

  ngOnInit() {
    // Fetch the items from the service
    this.itemsService.getItems().subscribe((itemsPagination) => {
      this.items = itemsPagination.items;
    });
  }

  getDataFunction = (
    searchText?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    page?: number,
    pageSize?: number
  ) => {
    return this.itemsService.getItems(undefined, undefined, undefined, undefined, searchText, undefined, sortBy, sortOrder, page, pageSize);
  }

  deleteItem(item: UIItemWithStats): void {
    const data: TuiConfirmData = {
      content: this.translate.instant('items.confirmDeleteContent'),
      yes: this.translate.instant('items.confirmDeleteYes'),
      no: this.translate.instant('items.confirmDeleteNo'),
    };

    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: this.translate.instant('items.confirmDeleteLabel', { name: item.name }),
        size: 'm',
        data,
      })
      .subscribe(response => {
        if (response) {
          this.alerts.open(
            this.translate.instant('items.deleteSuccess', { name: item.name }),
            { appearance: 'positive' },
          ).subscribe();
        }
      });
  }
}
