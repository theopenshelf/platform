import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { tuiAsPortal, TuiPortals } from '@taiga-ui/cdk';
import {
  TuiDataList,
  TuiDropdown,
  TuiDropdownService,
  TuiRoot,
} from '@taiga-ui/core';
import { TuiTabs } from '@taiga-ui/kit';
import { TuiNavigation } from '@taiga-ui/layout';

@Component({
  standalone: true,
  selector: 'public-layout',
  imports: [
    RouterOutlet,
    TuiRoot,
    FormsModule,
    TuiDataList,
    TuiDropdown,
    TuiNavigation,
    TuiTabs,
  ],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss',
  providers: [TuiDropdownService, tuiAsPortal(TuiDropdownService)],
})
export class PublicLayoutComponent extends TuiPortals {}
