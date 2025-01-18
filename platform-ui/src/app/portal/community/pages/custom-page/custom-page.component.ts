import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CUSTOM_PAGE_SERVICE_TOKEN } from '../../community.provider';
import { UICustomPage } from '../../models/UICustomPage';
import { CustomPageService } from '../../services/custom-page.service';

@Component({
  selector: 'app-custom-page',
  imports: [],
  templateUrl: './custom-page.component.html',
  styleUrl: './custom-page.component.scss'
})
export class CustomPageComponent implements OnInit {
  pageRef: any;
  page: UICustomPage | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject(CUSTOM_PAGE_SERVICE_TOKEN) private customPageService: CustomPageService
  ) { }

  ngOnInit() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.route.params.subscribe((params) => {
      this.pageRef = params['ref'] || '';
      this.customPageService.getCustomPage(this.pageRef).subscribe((page) => {
        this.page = page;
      });
    });
  }
}
