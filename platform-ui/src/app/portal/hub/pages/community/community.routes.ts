import { Routes } from "@angular/router";
import { getGlobalProviders } from "../../../../global.provider";
import { hubProviders } from "../../hub.provider";
import { CommunityItemsComponent } from "./community-items/community-items.component";
import { CommunityLibrariesComponent } from "./community-libraries/community-libraries.component";
import { CommunityMembersComponent } from "./community-members/community-members.component";
import { CommunityPagesComponent } from "./community-pages/community-pages.component";
import { CommunityComponent } from "./community.component";

export const communityRoutes: Routes = [{
    path: '',
    providers: [...hubProviders, ...getGlobalProviders()],
    component: CommunityComponent,
    children: [
        { path: '', redirectTo: 'pages', pathMatch: 'full' },
        {
            path: 'members',
            component: CommunityMembersComponent
        },
        {
            path: 'libraries',
            component: CommunityLibrariesComponent
        },
        {
            path: 'items',
            component: CommunityItemsComponent
        },
        {
            path: 'pages',
            component: CommunityPagesComponent
        },
        { path: 'pages/:ref', component: CommunityPagesComponent },
    ]
}]; 