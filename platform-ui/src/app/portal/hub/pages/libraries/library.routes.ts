import { Routes } from "@angular/router";
import { getGlobalProviders } from "../../../../global.provider";
import { hubProviders } from "../../hub.provider";
import { LibraryApprovalComponent } from "./library-approval/library-approval.component";
import { LibraryBorrowRecordsComponent } from "./library-borrow-records/library-borrow-records.component";
import { LibraryItemsComponent } from "./library-items/library-items.component";
import { LibraryComponent } from "./library/library.component";


export const libraryRoutes: Routes = [{
    path: '',
    providers: [...hubProviders, ...getGlobalProviders()],
    component: LibraryComponent,
    children: [
        { path: '', redirectTo: 'items', pathMatch: 'full' },
        {
            path: 'approval',
            component: LibraryApprovalComponent
        },
        {
            path: 'borrow-records',
            component: LibraryBorrowRecordsComponent
        },
        {
            path: 'items',
            component: LibraryItemsComponent
        }
    ]
}]; 