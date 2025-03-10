import { Component, HostListener, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TuiDataList, TuiDropdown, TuiIcon } from '@taiga-ui/core';
import { TuiTabs } from '@taiga-ui/kit';
import { TuiNavigation } from '@taiga-ui/layout';
import { UICustomPage } from '../../models/UICustomPage';
import { CUSTOM_PAGE_SERVICE_TOKEN, hubProviders } from '../../portal/hub/hub.provider';
import { CustomPageService } from '../../portal/hub/services/custom-page.service';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';

@Component({
  selector: 'tos-footer',
  imports: [
    FormsModule,
    TuiDataList,
    TuiDropdown,
    TuiIcon,
    TuiNavigation,
    TuiTabs,
    RouterLink,
    TranslateModule,
    LanguageSwitcherComponent,
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  providers: [...hubProviders]
})
export class FooterComponent {


  customPages: Map<string, UICustomPage[]> = new Map<string, UICustomPage[]>();

  constructor(
    @Inject(CUSTOM_PAGE_SERVICE_TOKEN) private customPageService: CustomPageService
  ) {
    this.customPageService.getCustomPageRefs().subscribe((pages) => {
      this.customPages = pages.reduce((map, page) => {
        if (!map.has(page.position)) {
          map.set(page.position, []);
        }
        map.get(page.position)?.push(page);
        return map;
      }, new Map<string, UICustomPage[]>());
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollToTopButton = document.getElementById('scrollToTop');
    if (scrollToTopButton) {
      if (window.pageYOffset > 300) {
        scrollToTopButton.classList.add('show');
      } else {
        scrollToTopButton.classList.remove('show');
      }
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
