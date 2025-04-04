import { Component, Inject, input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UICustomPage } from '../../../../models/UICustomPage';
import { CUSTOM_PAGE_SERVICE_TOKEN } from '../../hub.provider';
import { CustomPageService } from '../../services/custom-page.service';

@Component({
  selector: 'custom-page',
  imports: [
    TranslateModule
  ],
  templateUrl: './custom-page.component.html',
  styleUrl: './custom-page.component.scss'
})
export class CustomPageComponent implements OnInit {
  pageRef: any;
  page = input<UICustomPage>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject(CUSTOM_PAGE_SERVICE_TOKEN) private customPageService: CustomPageService
  ) { }

  ngOnInit() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (!this.page()) {
      this.route.params.subscribe((params) => {
        this.pageRef = params['ref'] || '';
        this.customPageService.getCustomPage(this.pageRef).subscribe((page) => {
          this.page.apply(page);
        });
      });
    }
  }
}
