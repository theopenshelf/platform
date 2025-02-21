import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  TuiAppearance,
  TuiAutoColorPipe,
  TuiButton,
  TuiIcon,
  TuiInitialsPipe,
  TuiTitle
} from '@taiga-ui/core';
import { TuiAvatar, TuiPagination } from '@taiga-ui/kit';
import { TuiCardMedium } from '@taiga-ui/layout';
import * as L from 'leaflet';
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
    TuiPagination,
  ],
  templateUrl: './communities.component.html',
  styleUrl: './communities.component.scss',
})
export class CommunitiesComponent implements OnInit, AfterViewInit {
  communities: UICommunity[] = [];
  searchText = '';
  getCommunitiesParams: GetCommunitiesParams = {
    pageSize: 5
  };

  // Pagination properties
  totalPages: number = 10;
  currentPage: number = 0;
  itemsPerPage: number = 12; // Default value

  private map: L.Map | undefined;

  constructor(
    @Inject(COMMUNITIES_SERVICE_TOKEN) private communitiesService: CommunitiesService,
    private breadcrumbService: BreadcrumbService,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthService
  ) {
    this.refreshCommunities();
    this.breadcrumbService.setBreadcrumbs([
      { caption: 'breadcrumb.communities', routerLink: '/hub/communities' }
    ]);
  }

  onTextFilterChange() {
    this.getCommunitiesParams.searchText = this.searchText;
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
    });
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
        .bindPopup(community.name));

    // Create a feature group and add markers to it
    const featureGroup = L.featureGroup(markers).addTo(this.map);

    // Fit the map to the bounds of the feature group
    this.map.fitBounds(featureGroup.getBounds());
  }
}
