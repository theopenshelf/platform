
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiAutoColorPipe, TuiIcon, TuiIconPipe, TuiInitialsPipe } from '@taiga-ui/core';
import { TuiAccordion, TuiAvatar, TuiSwitch } from '@taiga-ui/kit';
import { communityProviders, ITEMS_SERVICE_TOKEN, LIBRARIES_SERVICE_TOKEN } from '../../../community.provider';
import { ItemCardComponent } from '../../../components/item-card/item-card.component';
import { UIItemWithRecords } from '../../../models/UIItemWithRecords';
import { UILibrary } from '../../../models/UILibrary';
import { ItemsService } from '../../../services/items.service';
import { LibrariesService } from '../../../services/libraries.service';

@Component({
  selector: 'app-library',
  imports: [
    FormsModule,
    ItemCardComponent,
    TuiIcon,
    TuiIconPipe,
    TuiAccordion,
    TuiSwitch,
    TuiAvatar,
    TuiInitialsPipe,
    TuiAutoColorPipe
],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss',
  providers: [
    ...communityProviders,
  ]
})
export class LibraryComponent {
  library: UILibrary | undefined;
  items: UIItemWithRecords[] = [];
  markAsFavorite: (item: UIItemWithRecords) => void = (item) => {
    console.log(`Item ${item.id} marked as favorite.`);
  };

  constructor(@Inject(LIBRARIES_SERVICE_TOKEN) private librariesService: LibrariesService,
    @Inject(ITEMS_SERVICE_TOKEN) private itemsService: ItemsService,
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

}
