import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { TuiResponsiveDialogService } from '@taiga-ui/addon-mobile';
import { TuiAlertService, TuiAutoColorPipe, TuiButton, TuiIcon, TuiIconPipe, TuiInitialsPipe } from '@taiga-ui/core';
import { TUI_CONFIRM, TuiAccordion, TuiAvatar, TuiConfirmData, TuiSwitch } from '@taiga-ui/kit';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { communityProviders, ITEMS_SERVICE_TOKEN, LIBRARIES_SERVICE_TOKEN } from '../../../community.provider';
import { ItemCardComponent } from '../../../components/item-card/item-card.component';
import { UIItemWithRecords } from '../../../models/UIItemWithRecords';
import { UILibrary } from '../../../models/UILibrary';
import { ItemsService } from '../../../services/items.service';
import { LibrariesService } from '../../../services/libraries.service';

@Component({
  selector: 'app-library',
  imports: [
    RouterModule,
    RouterLink,
    FormsModule,
    ItemCardComponent,
    TuiIcon,
    TuiIconPipe,
    TuiAccordion,
    TuiSwitch,
    TuiAvatar,
    TuiButton,
    TuiIcon,
    TuiInitialsPipe,
    TuiAutoColorPipe
  ],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss'
})
export class LibraryComponent {
  library: UILibrary | undefined;
  items: UIItemWithRecords[] = [];
  markAsFavorite: (item: UIItemWithRecords) => void = (item) => {
    console.log(`Item ${item.id} marked as favorite.`);
  };

  constructor(@Inject(LIBRARIES_SERVICE_TOKEN) private librariesService: LibrariesService,
    @Inject(ITEMS_SERVICE_TOKEN) private itemsService: ItemsService,
    private dialogs: TuiResponsiveDialogService,
    private alerts: TuiAlertService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    const itemId = this.route.snapshot.paramMap.get('id');
    if (itemId) {
      this.librariesService.getLibrary(itemId).subscribe((library) => {
        this.library = library;
      });
      this.itemsService.getItemsByLibrary(itemId).subscribe((items) => {
        this.items = items;
      });
    }
  }

  deleteLibrary(library: UILibrary): void {
    const data: TuiConfirmData = {
      content: 'Are you sure you want to delete this user?',  // Simple content
      yes: 'Yes, Delete',
      no: 'Cancel',
    };

    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: "Delete library '" + library.name + "'",
        size: 'm',
        data,
      })
      .pipe(switchMap((response) => {
        this.alerts.open('Library <strong>' + library.name + '</strong> deleted successfully', { appearance: 'positive' });
        this.router.navigate(['/community/libraries']);
        return of(true);
      }))
      .subscribe();


    this.librariesService.deleteLibrary(library.id).subscribe();
  }

}
