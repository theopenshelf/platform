import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { CustomPage, CustomPagesHubApiService, GetCustomPageRefs200ResponseInner } from "../../../../api-client";
import { UICustomPage } from "../../../../models/UICustomPage";
import { CustomPageService } from "../custom-page.service";

@Injectable({
    providedIn: 'root',
})
export class APICustomPageService implements CustomPageService {

    constructor(private customPageApiService: CustomPagesHubApiService) { }

    getCustomPage(pageRef: string): Observable<UICustomPage> {
        return this.customPageApiService.getCustomPage(pageRef).pipe(
            map((page: CustomPage) =>
                ({
                    id: page.id,
                    ref: page.ref,
                    position: page.position,
                    title: page.title,
                    content: page.content,
                }) as UICustomPage,
            ),
        );
    }

    getCustomPageRefs(): Observable<UICustomPage[]> {
        return this.customPageApiService.getCustomPageRefs().pipe(
            map((pages: GetCustomPageRefs200ResponseInner[]) => pages.map((page) => ({
                ref: page.ref,
                position: page.position,
                title: page.title,
                content: '',
            } as UICustomPage))),
        );
    }
}