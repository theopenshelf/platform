import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, OnInit, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  TuiAppearance,
  TuiAutoColorPipe,
  TuiButton,
  TuiDataList,
  TuiIcon,
  TuiInitialsPipe,
  TuiLoader,
  TuiTextfield,
  TuiTitle
} from '@taiga-ui/core';
import { TuiAvatar, TuiBadge, TuiDataListWrapper, TuiFade, TuiPagination, TuiSlider } from '@taiga-ui/kit';
import { TuiCardMedium } from '@taiga-ui/layout';
import { TuiComboBoxModule, TuiInputModule } from '@taiga-ui/legacy';
import * as L from 'leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { RawResult } from 'leaflet-geosearch/dist/providers/openStreetMapProvider.js';
import { SearchResult } from 'leaflet-geosearch/dist/providers/provider.js';
import { debounceTime } from 'rxjs/operators';
import { BreadcrumbService } from '../../../../components/tos-breadcrumbs/tos-breadcrumbs.service';
import { AUTH_SERVICE_TOKEN } from '../../../../global.provider';
import { GetCommunitiesParams } from '../../../../models/GetCommunitiesParams';
import { UICommunitiesPagination } from '../../../../models/UICommunitiesPagination';
import { UICommunity } from '../../../../models/UICommunity';
import { AuthService } from '../../../../services/auth.service';
import { COMMUNITIES_SERVICE_TOKEN } from '../../hub.provider';
import { CommunitiesService } from '../../services/communities.service';

@Component({
  selector: 'app-libraries',
  standalone: true,
  imports: [
    RouterModule,
    TuiAppearance,
    TuiCardMedium,
    TuiTitle,
    TuiButton,
    TuiIcon,
    TranslateModule,
    TuiAvatar,
    TuiInitialsPipe,
    TuiAutoColorPipe,
    FormsModule,
    ReactiveFormsModule,
    TuiPagination,
    TuiSlider,
    TuiInputModule,
    TuiDataList,
    TuiDataListWrapper,
    ReactiveFormsModule,
    TuiComboBoxModule,
    TuiLoader,
    TuiBadge,
    TuiInputModule,
    TuiTextfield,
    TuiFade
  ],
  templateUrl: './communities.component.html',
  styleUrl: './communities.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunitiesComponent implements OnInit, AfterViewInit {
  communities: UICommunity[] = [];
  searchText = '';
  searchLocationControl = new FormControl('');
  locationSuggestions = signal<SearchResult<RawResult>[]>([]);
  distanceControl = new FormControl<number>(3);
  labels: number[] = [3, 25, 50, 75, 100];
  getCommunitiesParams: GetCommunitiesParams = {
    pageSize: 5
  };

  // Pagination properties
  totalPages: number = 10;
  currentPage: number = 0;
  itemsPerPage: number = 12; // Default value

  private map: L.Map | undefined;
  provider = new OpenStreetMapProvider({
    params: {
      countrycodes: 'fr'
    }
  });
  selectedLocation: SearchResult<RawResult> | undefined;
  showLocationLoader: boolean = false;

  constructor(
    @Inject(COMMUNITIES_SERVICE_TOKEN) private communitiesService: CommunitiesService,
    private breadcrumbService: BreadcrumbService,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthService
  ) {
    this.refreshCommunities();
    this.breadcrumbService.setBreadcrumbs([
      { caption: 'breadcrumb.communities', routerLink: '/hub/communities' }
    ]);
    this.searchLocationControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(value => {
        if (value !== null) {
          this.updateLocationSuggestions(value);
        }
      });
  }

  selectSuggestion(suggestion: SearchResult<RawResult>) {
    this.selectedLocation = suggestion;
    this.getCommunitiesParams.location = {
      name: suggestion.label,
      address: suggestion.label,
      coordinates: {
        lat: suggestion.y,
        lng: suggestion.x
      }
    };
    this.refreshCommunities();
  }

  onTextFilterChange() {
    this.getCommunitiesParams.searchText = this.searchText;
    this.refreshCommunities();
  }

  updateLocationSuggestions(query: string) {
    if (query == null || query.length < 3) {
      this.locationSuggestions.set([]);
      return;
    }

    this.showLocationLoader = true;
    this.provider.search({ query }).then((results: SearchResult<RawResult>[]) => {
      this.locationSuggestions.set(results);
      this.showLocationLoader = false;
    }).catch((error: any) => {
      this.locationSuggestions.set([]);
      this.showLocationLoader = false;
    });
  }

  protected readonly stringify = (item: any): string => {
    if (item.label) {
      return `${item.label}`;
    }
    return item;
  };

  patchValue(newValue: number): void {
    this.distanceControl.patchValue(newValue);
    this.getCommunitiesParams.distance = newValue;
    this.refreshCommunities();
  }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  requestToJoin(community: UICommunity) {
    const user = this.authService.getCurrentUserInfo();
    this.communitiesService.addMember(community.id, {
      ...user.user,
      role: 'requestingJoin'
    }).subscribe();
  }

  protected updatePagination(communitiesPagination: UICommunitiesPagination) {
    this.totalPages = communitiesPagination.totalPages;
    this.currentPage = communitiesPagination.currentPage;
    this.itemsPerPage = communitiesPagination.itemsPerPage;
    this.communities = communitiesPagination.items;
  }

  // Public methods
  goToPage(page: number) {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.getCommunitiesParams.page = page;
    this.refreshCommunities();
  }

  refreshCommunities() {
    this.communitiesService.getCommunities(this.getCommunitiesParams).subscribe((communities) => {
      this.updatePagination(communities);
      this.clearMarkers();
      this.updateMarkers();
    });
  }

  private clearMarkers(): void {
    if (this.map) {
      this.map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          this.map!.removeLayer(layer);
        }
      });
    }
  }

  private updateMarkers(): void {
    if (this.map) {
      // Define a custom icon
      const customIcon = L.icon({
        iconUrl: 'media/pin_orange.png', // URL to your custom icon image
        iconSize: [38, 38], // size of the icon
        popupAnchor: [0, -38] // point from which the popup should open relative to the iconAnchor
      });

      // Add markers for each community with the custom icon
      const markers = this.communities
        .filter(community => community.location && community.location.coordinates)
        .map(community => {
          const marker = L.marker([community.location.coordinates.lat, community.location.coordinates.lng], { icon: customIcon })
            .bindPopup(`
              <div>
                <p>${community.name}</p>
              </div>
            `)
            .on('click', () => this.clickOnCommunityPin(community.id)); // Add click event listener
          return marker;
        });

      // Create a feature group and add markers to it
      const featureGroup = L.featureGroup(markers).addTo(this.map);

      // Fit the map to the bounds of the feature group
      this.map.fitBounds(featureGroup.getBounds());
    }
  }

  private clickOnCommunityPin(communityId: string): void {
    const communityTile = document.querySelector(`.community-card[data-community-id="${communityId}"]`);
    if (communityTile) {
      communityTile.scrollIntoView({ behavior: 'smooth' });
    }
  }

  public movePinToCenter(communityId: string): void {
    const community = this.communities.find(c => c.id === communityId);
    if (community && community.location && community.location.coordinates && this.map) {
      this.map.setView([community.location.coordinates.lat, community.location.coordinates.lng], 13);
    }
  }

  public getLocationName(): string {
    return this.selectedLocation?.label || '';
  }

  private initMap(): void {
    this.map = L.map('map').setView([46.581934, 0.341739], 13);

    L.tileLayer('https://tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=1062f6b59f1146d3946e51cdb7065363', {
      attribution: 'Data &copy; <a href="https://www.thunderforest.com/">Thunderforest</a>, Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Define a custom icon
    const customIcon = L.icon({
      iconUrl: 'media/pin_orange.png', // URL to your custom icon image
      iconSize: [38, 38], // size of the icon
      popupAnchor: [0, -38] // point from which the popup should open relative to the iconAnchor
    });

    // Add markers for each community with the custom icon
    const markers = this.communities
      .filter(community => community.location && community.location.coordinates)
      .map(community => L.marker([community.location.coordinates.lat, community.location.coordinates.lng], { icon: customIcon })
        .bindPopup(`
          <div>
            <p>${community.name}</p>
          </div>
        `));

    // Create a feature group and add markers to it
    const featureGroup = L.featureGroup(markers).addTo(this.map);

    // Fit the map to the bounds of the feature group
    this.map.fitBounds(featureGroup.getBounds());
  }

  protected openDropdownLocation = false;

  protected closeDropdownLocation(): void {
    this.openDropdownLocation = false;
  }
}
