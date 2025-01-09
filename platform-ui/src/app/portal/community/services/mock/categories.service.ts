import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UICategory } from '../../models/UICategory';
import { CategoriesService } from '../categories.service';


@Injectable({
    providedIn: 'root',
})
export class MockCategoriesService implements CategoriesService {
    private static index = 1;
    public static BOOKS: UICategory = { id: MockCategoriesService.index++ + "", name: 'books', color: '#b71964', template: 'Book Template', icon: '@tui.book' };
    public static ELECTRONICS: UICategory = { id: MockCategoriesService.index++ + "", name: 'electronics', color: '#1d71ac', template: 'Electronics Template', icon: '@tui.tv' };
    public static CLOTHING: UICategory = { id: MockCategoriesService.index++ + "", name: 'clothing', color: '#8a1bcc', template: 'Clothing Template', icon: '@tui.shirt' };
    public static DIY: UICategory = { id: MockCategoriesService.index++ + "", name: 'diy', color: '#f58220', template: 'DIY Template', icon: '@tui.hammer' };
    public static BEAUTY_HEALTH: UICategory = { id: MockCategoriesService.index++ + "", name: 'beauty health', color: '#e17ac4', template: 'Beauty & Health Template', icon: '@tui.heart' };
    public static SPORTS_OUTDOORS: UICategory = { id: MockCategoriesService.index++ + "", name: 'sports outdoors', color: '#2a7f3d', template: 'Sports & Outdoors Template', icon: '@tui.bike' };
    public static CAMPING: UICategory = { id: MockCategoriesService.index++ + "", name: 'camping', color: '#4f9c38', template: 'Camping Template', icon: '@tui.tent' };
    public static GARDENING: UICategory = { id: MockCategoriesService.index++ + "", name: 'gardening', color: '#4ca24c', template: 'Gardening Template', icon: '@tui.flower' };
    public static VEHICLE: UICategory = { id: MockCategoriesService.index++ + "", name: 'vehicle', color: '#019cdb', template: 'Vehicle Template', icon: '@tui.car' };
    public static HOME: UICategory = { id: MockCategoriesService.index++ + "", name: 'home', color: '#d08000', template: 'Home Template', icon: '@tui.home' };
    public static KIDS: UICategory = { id: MockCategoriesService.index++ + "", name: 'kids', color: '#e0b100', template: 'Kids Template', icon: '@tui.baby' };
    public static EVENTS: UICategory = { id: MockCategoriesService.index++ + "", name: 'events', color: '#e7315c', template: 'Events Template', icon: '@tui.calendar' };
    public static MULTIMEDIA: UICategory = { id: MockCategoriesService.index++ + "", name: 'multimedia', color: '#1e9ee7', template: 'Multimedia Template', icon: '@tui.video' };
    public static TRAVEL: UICategory = { id: MockCategoriesService.index++ + "", name: 'travel', color: '#f09830', template: 'Travel Template', icon: '@tui.train-front' };
    public static SAFETY: UICategory = { id: MockCategoriesService.index++ + "", name: 'safety', color: '#f57d2b', template: 'Safety Template', icon: '@tui.shield' };

    private categories: UICategory[] = [
        MockCategoriesService.BOOKS,
        MockCategoriesService.ELECTRONICS,
        MockCategoriesService.CLOTHING,
        MockCategoriesService.DIY,
        MockCategoriesService.BEAUTY_HEALTH,
        MockCategoriesService.SPORTS_OUTDOORS,
        MockCategoriesService.CAMPING,
        MockCategoriesService.GARDENING,
        MockCategoriesService.VEHICLE,
        MockCategoriesService.HOME,
        MockCategoriesService.KIDS,
        MockCategoriesService.EVENTS,
        MockCategoriesService.MULTIMEDIA,
        MockCategoriesService.TRAVEL,
        MockCategoriesService.SAFETY
    ];

    getCategories(): Observable<UICategory[]> {
        return of(this.categories);
    }
}