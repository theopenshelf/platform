import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { loadCustomPagesData } from "../../../../mock/custom-page-loader";
import { UICustomPage } from "../../../../models/UICustomPage";
import { CustomPageService } from "../custom-page.service";

@Injectable({
    providedIn: 'root',
})
export class MockCustomPageService implements CustomPageService {

    private customPages: UICustomPage[] = [];

    constructor() {
        this.customPages = loadCustomPagesData();
    }

    getCustomPage(pageRef: string): Observable<UICustomPage> {
        const page = this.customPages.find(page => page.ref === pageRef);
        if (!page) {
            throw new Error(`Custom page with ref ${pageRef} not found`);
        }
        return of(page);
    }

    getCustomPageRefs(): Observable<UICustomPage[]> {
        return of(this.customPages);
    }
}