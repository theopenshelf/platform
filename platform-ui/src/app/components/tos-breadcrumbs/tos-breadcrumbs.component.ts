import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TuiItem } from '@taiga-ui/cdk';
import { TuiLink } from '@taiga-ui/core';
import { TuiBreadcrumbs, TuiFade } from '@taiga-ui/kit';
import { BreadcrumbItem, BreadcrumbService } from './tos-breadcrumbs.service';

@Component({
  selector: 'tos-breadcrumbs',
  imports: [
    RouterLink,
    TuiBreadcrumbs,
    TuiItem,
    TuiLink,
    TranslateModule,
    TuiFade,

  ],
  templateUrl: './tos-breadcrumbs.component.html',
  styleUrl: './tos-breadcrumbs.component.scss'
})
export class TosBreadcrumbsComponent implements OnInit {

  constructor(private breadcrumbService: BreadcrumbService) { }

  breadcrumbs: BreadcrumbItem[] = [];

  ngOnInit() {
    this.breadcrumbs = this.breadcrumbService.getBreadcrumbs();
  }
}
