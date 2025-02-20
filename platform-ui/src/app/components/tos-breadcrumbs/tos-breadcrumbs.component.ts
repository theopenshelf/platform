import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TUI_IS_MOBILE, TuiItem } from '@taiga-ui/cdk';
import { TuiLink } from '@taiga-ui/core';
import { TuiBreadcrumbs, TuiFade } from '@taiga-ui/kit';
import { BreadcrumbItem, BreadcrumbService } from './tos-breadcrumbs.service';

@Component({
  selector: 'tos-breadcrumbs',
  imports: [
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
  protected readonly isMobile = inject(TUI_IS_MOBILE);

  constructor(private breadcrumbService: BreadcrumbService, private router: Router) { }

  breadcrumbs: BreadcrumbItem[] = [];

  ngOnInit() {
    this.breadcrumbs = this.breadcrumbService.getBreadcrumbs();
    this.breadcrumbService.setRefresh(this.refresh);
  }

  refresh = () => {
    this.breadcrumbs = this.breadcrumbService.getBreadcrumbs();
  }

  onBreadcrumbClick(breadcrumb: BreadcrumbItem) {
    this.breadcrumbService.onBreadcrumbsLinkClick(breadcrumb);
    this.router.navigate([breadcrumb.routerLink]);
  }
}
