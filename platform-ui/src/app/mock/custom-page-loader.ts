import { UICustomPage } from '../models/UICustomPage';
import customPagesData from './custom-pages.json';
export const loadCustomPagesData = (): UICustomPage[] => {
    return customPagesData.map(page => ({
        ...page,
        position: page.position as "footer-links" | "copyright" | "footer-help",
        communityId: page.communityId || '',
        order: page.order || 0
    }));
};
