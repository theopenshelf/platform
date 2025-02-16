import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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

  constructor(private breadcrumbService: BreadcrumbService, private router: Router) { }

  breadcrumbs: BreadcrumbItem[] = [];

  ngOnInit() {
    this.breadcrumbs = this.breadcrumbService.getBreadcrumbs();
  }

  onBreadcrumbClick(breadcrumb: BreadcrumbItem) {
    this.breadcrumbService.onBreadcrumbsLinkClick(breadcrumb);
    this.router.navigate([breadcrumb.routerLink]);
  }
}
