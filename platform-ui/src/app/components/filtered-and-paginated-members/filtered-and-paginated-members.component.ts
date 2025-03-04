import { CommonModule } from '@angular/common';
import { Component, Inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TuiResponsiveDialogService } from '@taiga-ui/addon-mobile';
import { TuiAlertService, TuiAutoColorPipe, TuiButton, TuiInitialsPipe } from '@taiga-ui/core';
import { TUI_CONFIRM, TuiAvatar, TuiConfirmData, TuiPagination, TuiSegmented } from '@taiga-ui/kit';
import { TuiCell } from '@taiga-ui/layout';
import { GetItemsParams } from '../../models/GetItemsParams';
import { UICommunity } from '../../models/UICommunity';
import { UIMember } from '../../models/UILibrary';
import { COMMUNITIES_SERVICE_TOKEN } from '../../portal/hub/hub.provider';
import { CommunitiesService } from '../../portal/hub/services/communities.service';

@Component({
  standalone: true,
  selector: 'filtered-and-paginated-members',
  imports: [
    CommonModule,
    TuiAvatar,
    TuiCell,
    TuiInitialsPipe,
    TuiAutoColorPipe,
    TuiPagination,
    TuiSegmented,
    TuiButton,
    FormsModule,
    TranslateModule
  ],
  templateUrl: './filtered-and-paginated-members.component.html',
  styleUrl: './filtered-and-paginated-members.component.scss'
})
export class FilteredAndPaginatedMembersComponent {

  public community = input.required<UICommunity>();
  public getItemsParams = input<GetItemsParams>({});
  public members: UIMember[] = [];
  protected selected = 'a';

  // Pagination properties
  totalPages: number = 10;
  currentPage: number = 0;
  itemsPerPage: number = 10; // Default value

  constructor(
    @Inject(COMMUNITIES_SERVICE_TOKEN) protected communitiesService: CommunitiesService,
    private dialogs: TuiResponsiveDialogService,
    private alerts: TuiAlertService,
    private translate: TranslateService

  ) { }

  ngOnInit() {
    this.fetchItems();
  }

  fetchItems() {
    this.communitiesService.getMembers(this.community().id, {
      ...this.getItemsParams(),
      page: this.currentPage,
      pageSize: this.itemsPerPage,
    }).subscribe((pagination) => {
      this.members = pagination.items;
      this.totalPages = pagination.totalPages;
      this.currentPage = pagination.currentPage;
      this.itemsPerPage = pagination.itemsPerPage;
    });
  }

  goToPage(page: number) {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.fetchItems();
  }

  switchType(member: UIMember, type: 'admin' | 'member') {
    const data: TuiConfirmData = {
      content: this.translate.instant('members.confirmChangeTypeContent'),
      yes: this.translate.instant('members.confirmChangeTypeYes'),
      no: this.translate.instant('members.confirmChangeTypeNo'),
    };

    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: this.translate.instant('members.confirmChangeType', { type: type }),
        size: 'm',
        data,
      })
      .subscribe(response => {
        if (response) {
          this.communitiesService.updateMember(this.community().id, member.id, {
            ...member,
            role: type === 'admin' ? 'admin' : 'member',
          }).subscribe();
        } else {
          // Revert the toggle if the user cancels the action
          member.role = member.role === 'admin' ? 'member' : 'admin';
        }
      });
  }

  deleteMember(member: UIMember) {
    const data: TuiConfirmData = {
      content: this.translate.instant('members.confirmDeleteMemberContent'),
      yes: this.translate.instant('members.confirmDeleteMemberYes'),
      no: this.translate.instant('members.confirmDeleteMemberNo'),
    };

    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: this.translate.instant('members.confirmDeleteMember'),
        size: 'm',
        data,
      })
      .subscribe(response => {
        if (response) {
          this.communitiesService.deleteMember(this.community().id, member.id).subscribe();
          this.fetchItems();
        }
      });
  }

  rejectRequest(member: UIMember) {
    const data: TuiConfirmData = {
      content: this.translate.instant('members.confirmRejectRequestContent'),
      yes: this.translate.instant('members.confirmRejectRequestYes'),
      no: this.translate.instant('members.confirmRejectRequestNo'),
    };

    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: this.translate.instant('members.confirmRejectRequest'),
        size: 'm',
        data,
      })
      .subscribe(response => {
        if (response) {
          this.communitiesService.deleteMember(this.community().id, member.id).subscribe();
          this.fetchItems();
        }
      });
  }

  acceptRequest(member: UIMember) {
    const data: TuiConfirmData = {
      content: this.translate.instant('members.confirmAcceptRequestContent'),
      yes: this.translate.instant('members.confirmAcceptRequestYes'),
      no: this.translate.instant('members.confirmAcceptRequestNo'),
    };

    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: this.translate.instant('members.confirmAcceptRequest'),
        size: 'm',
        data,
      })
      .subscribe(response => {
        if (response) {
          this.communitiesService.updateMember(this.community().id, member.id, {
            ...member,
            role: 'member',
          }).subscribe();
          this.fetchItems();
        }
      });
  }
}
