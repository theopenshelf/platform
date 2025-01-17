import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TuiDataList, TuiDropdown, TuiIcon } from '@taiga-ui/core';
import { TuiTabs } from '@taiga-ui/kit';
import { TuiNavigation } from '@taiga-ui/layout';

@Component({
  selector: 'tos-footer',
  imports: [
    FormsModule,
    TuiDataList,
    TuiDropdown,
    TuiIcon,
    TuiNavigation,
    TuiTabs,
    RouterLink
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
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
