import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { TuiResponsiveDialogService } from '@taiga-ui/addon-mobile';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiAlertService, TuiButton, TuiIcon } from '@taiga-ui/core';
import { TUI_CONFIRM, TuiConfirmData } from '@taiga-ui/kit';
import { map } from 'rxjs';
import { UICustomPage } from '../../../community/models/UICustomPage';
import { CUSTOM_PAGES_SERVICE_TOKEN } from '../../admin.providers';
import { Column, TosTableComponent } from '../../components/tos-table/tos-table.component';
import { CustomPagesService } from '../../services/custom-pages.service';

@Component({
  selector: 'app-custom-pages',
  imports: [
    TosTableComponent,
    TuiIcon,
    TuiButton,
    RouterLink,
    RouterModule,
    FormsModule,
    TuiTable,
    TuiButton,
    TosTableComponent,
    TuiIcon,
    TosTableComponent,
  ],
  templateUrl: './custom-pages.component.html',
  styleUrl: './custom-pages.component.scss'
})
export class CustomPagesComponent implements OnInit {

  columns: Column[] = [
    {
      key: 'ref',
      label: 'Reference',
      visible: true,
      sortable: true,
      size: 'm',
    },
    { key: 'title', label: 'Title', visible: true, sortable: true, size: 'm' },
    {
      key: 'position',
      label: 'Position',
      visible: true,
      sortable: true,
      size: 'm',
    },
    {
      key: 'content',
      label: 'Content',
      visible: false,
      sortable: false,
      size: 'l',
    }
  ];

  constructor(@Inject(CUSTOM_PAGES_SERVICE_TOKEN) private customPagesService: CustomPagesService,
    private dialogs: TuiResponsiveDialogService,
    private alerts: TuiAlertService,) {
  }

  ngOnInit() {
  }

  getDataFunction = (
    searchText?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    page?: number,
    pageSize?: number
  ) => {
    return this.customPagesService.getCustomPageRefs().pipe(
      map((pages: UICustomPage[]) => {
        pages.push({
          id: 'faq',
          ref: 'faq',
          position: 'footer-links',
          title: 'FAQ',
          content: 'Test'
        });
        return {
          totalPages: 1,
          totalItems: pages.length + 1,
          currentPage: 0,
          itemsPerPage: pages.length + 1,
          items: pages
        }
      })
    );
  }

  deletePage(page: UICustomPage) {
    const data: TuiConfirmData = {
      content: 'Are you sure you want to delete this page?', // Simple content
      yes: 'Yes, Delete',
      no: 'Cancel',
    };

    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: "Delete page '" + page.title + "'",
        size: 'm',
        data,
      })
      .subscribe((response) => {
        if (response) {
          this.customPagesService.deleteCustomPage(page.id).subscribe();
          this.alerts.open(
            'Page <strong>' +
            page.title +
            '</strong> deleted successfully',
            { appearance: 'positive' },
          ).subscribe();
        }
      });
  }
}

