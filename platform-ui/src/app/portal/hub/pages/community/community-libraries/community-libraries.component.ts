import { Component } from '@angular/core';
import { UICommunity } from '../../../../../models/UICommunity';
import { LibrariesComponent } from '../../libraries/libraries/libraries.component';
import { CommunityStateService } from '../community.service';

@Component({
  selector: 'app-community-libraries',
  imports: [
    LibrariesComponent
  ],
  templateUrl: './community-libraries.component.html',
  styleUrl: './community-libraries.component.scss'
})
export class CommunityLibrariesComponent {
  community: UICommunity | null = null;

  constructor(
    private communityState: CommunityStateService
  ) {
    this.communityState.community$.subscribe(community => this.community = community);
  }
}
