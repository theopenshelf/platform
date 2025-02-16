import { Injectable } from '@angular/core';

export interface BreadcrumbItem {
    caption?: string;
    name?: string;
    routerLink: string;
}

@Injectable({
    providedIn: 'root'
})
export class BreadcrumbService {
    private breadcrumbs: BreadcrumbItem[] = [];
    private breadcrumbsHistory: BreadcrumbItem[] = [];
    private breadcrumbsHistoryKey: string = '';

    resetBreadcrumbs() {
        this.breadcrumbs = [];
        this.breadcrumbsHistory = [];
    }


    setBreadcrumbs(breadcrumbs: BreadcrumbItem[]) {
        this.breadcrumbsHistory = breadcrumbs;
        this.breadcrumbs = [];
    }

    getBreadcrumbs(): BreadcrumbItem[] {
        return [...this.breadcrumbsHistory, ...this.breadcrumbs];
    }

    appendBreadcrumbs(key: string, breadcrumbs: BreadcrumbItem[], defaultParent: BreadcrumbItem[]) {
        if (this.breadcrumbsHistory.length === 0) {
            this.breadcrumbsHistory = [...defaultParent];
        } else if (this.breadcrumbsHistoryKey !== key) {
            this.breadcrumbsHistory = [...this.breadcrumbsHistory, ...this.breadcrumbs];
        }
        this.breadcrumbs = breadcrumbs;
        this.breadcrumbsHistoryKey = key;
    }
} 