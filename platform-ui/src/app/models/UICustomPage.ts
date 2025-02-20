export interface UICustomPage {
    id: string;
    communityId: string;
    ref: string;
    order: number;
    position: 'footer-links' | 'copyright' | 'footer-help' | 'community';
    title: string;
    content: string;
}
