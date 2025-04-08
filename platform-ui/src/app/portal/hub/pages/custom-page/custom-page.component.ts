import { Component, Inject, input, OnInit, signal, WritableSignal } from '@angular/core';
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
  styleUrl: './custom-page.component.scss',
  standalone: true
})
export class CustomPageComponent implements OnInit {
  pageRef: string = '';
  page = input<UICustomPage>();
  currentPage: WritableSignal<UICustomPage | undefined> = signal(undefined);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject(CUSTOM_PAGE_SERVICE_TOKEN) private customPageService: CustomPageService
  ) { }

  ngOnInit() {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // If we have an input page, use it
    if (this.page()) {
      this.currentPage.set(this.page());
      return;
    }

    // Otherwise load from service
    this.route.params.subscribe((params) => {
      this.pageRef = params['ref'] || '';
      this.customPageService.getCustomPage(this.pageRef).subscribe({
        next: (page) => {
          this.currentPage.set(page);
        },
        error: (error) => {
          console.error('Failed to load custom page:', error);
          // You might want to navigate to an error page or show a notification
        }
      });
    });
  }
}
