export interface UICustomPage {
    id: string;
    ref: string;
    position: 'footer-links' | 'copyright' | 'footer-help';
    title: string;
    content: string;
}
