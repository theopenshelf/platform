import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TuiResponsiveDialogService } from '@taiga-ui/addon-mobile';
import { TuiAlertService, TuiButton } from '@taiga-ui/core';
import { TUI_CONFIRM, TuiConfirmData } from '@taiga-ui/kit';
import { EMPTY, filter, map, switchMap, tap } from 'rxjs';
import { UICommunity } from '../../../../../models/UICommunity';
import { UICustomPage } from '../../../../../models/UICustomPage';
import { COMMUNITIES_SERVICE_TOKEN } from '../../../hub.provider';
import { CommunitiesService } from '../../../services/communities.service';
import { CustomPageComponent } from '../../custom-page/custom-page.component';
import { CustomPagesEditComponent } from '../../custom-pages-edit/custom-pages-edit.component';
import { CommunityStateService } from '../community.service';

@Component({
  selector: 'app-community-pages',
  imports: [
    TranslateModule,
    CustomPageComponent,
    CustomPagesEditComponent,
    TuiButton,
  ],
  templateUrl: './community-pages.component.html',
  styleUrl: './community-pages.component.scss'
})
export class CommunityPagesComponent implements OnInit {

  selectedPage: UICustomPage | undefined;
  pages: UICustomPage[] = [];
  editMode: boolean = false;
  isAdmin: boolean = false;
  community: UICommunity | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(COMMUNITIES_SERVICE_TOKEN) private communitiesService: CommunitiesService,
    private dialogs: TuiResponsiveDialogService,
    private alerts: TuiAlertService,
    private router: Router,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private communityState: CommunityStateService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const pageRef = params['ref'];  // Get the ref parameter directly from route params
      this.communityState.community$.pipe(
        tap(community => this.community = community),
        filter(community => !!community),
        switchMap(community => this.communitiesService.getCustomPages(community!.id).pipe(
          map(pages => {
            this.pages = pages;
            if (pageRef) {
              this.selectPage(this.pages.find(page => page.ref === pageRef)!);
            } else {
              this.selectPage(this.pages[0]);
            }
          })
        ))
      ).subscribe();
    });
  }

  selectPage(page: UICustomPage) {
    this.selectedPage = page;
    this.editMode = false;
    this.cdr.detectChanges();

    var queryParams: any = {};

    let path = `/hub/communities/${this.community?.id}`;
    path += '/pages/' + page.ref;

    this.router.navigate([path], {
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }

  editPage(page: UICustomPage) {
    this.selectedPage = page;
    this.editMode = true;
    this.cdr.detectChanges();
  }

  createPage() {
    this.selectedPage = {
      id: '',
      communityId: this.community?.id!,
      ref: '',
      order: 100,
      title: '',
      content: '',
      position: 'community',
    };
    this.editMode = true;
    this.cdr.detectChanges();
  }

  deletePage(page: UICustomPage): void {

    const data: TuiConfirmData = {
      content: this.translate.instant('community.confirmDeletePage', { pageTitle: page.title }),
      yes: this.translate.instant('community.yesDelete'),
      no: this.translate.instant('community.cancel'),
    };

    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: this.translate.instant('community.deletePageLabel', { pageTitle: page.title }),
        size: 'm',
        data,
      })
      .pipe(
        switchMap((response) => {
          if (response) {
            this.communitiesService.deleteCustomPage(this.community?.id!, page.id).subscribe(() => {
              this.alerts.open(this.translate.instant('community.deletePageSuccess', { pageTitle: page.title }), {
                appearance: 'positive',
              }).subscribe();
              this.pages = this.pages.filter(p => p.id !== page.id);
            });
          }
          return EMPTY;
        }),
      )
      .subscribe();
  }
}
