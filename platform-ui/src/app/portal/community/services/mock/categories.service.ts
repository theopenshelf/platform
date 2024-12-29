import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UICategory } from '../../models/UICategory';
import { CategoriesService } from '../categories.service';


@Injectable({
    providedIn: 'root',
})
export class MockCategoriesService implements CategoriesService {
    private static index = 1;
    public static BOOKS: UICategory = { id: MockCategoriesService.index++ + "", name: 'books', color: '#b71964', template: 'Book Template' };
    public static ELECTRONICS: UICategory = { id: MockCategoriesService.index++ + "", name: 'electronics', color: '#1d71ac', template: 'Electronics Template' };
    public static CLOTHING: UICategory = { id: MockCategoriesService.index++ + "", name: 'clothing', color: '#8a1bcc', template: 'Clothing Template' };
    public static DIY: UICategory = { id: MockCategoriesService.index++ + "", name: 'diy', color: '#f58220', template: 'DIY Template' };
    public static BEAUTY_HEALTH: UICategory = { id: MockCategoriesService.index++ + "", name: 'beauty_health', color: '#e17ac4', template: 'Beauty & Health Template' };
    public static SPORTS_OUTDOORS: UICategory = { id: MockCategoriesService.index++ + "", name: 'sports_outdoors', color: '#2a7f3d', template: 'Sports & Outdoors Template' };
    public static CAMPING: UICategory = { id: MockCategoriesService.index++ + "", name: 'camping', color: '#4f9c38', template: 'Camping Template' };
    public static GARDENING: UICategory = { id: MockCategoriesService.index++ + "", name: 'gardening', color: '#4ca24c', template: 'Gardening Template' };
    public static VEHICLE: UICategory = { id: MockCategoriesService.index++ + "", name: 'vehicle', color: '#019cdb', template: 'Vehicle Template' };
    public static HOME: UICategory = { id: MockCategoriesService.index++ + "", name: 'home', color: '#d08000', template: 'Home Template' };
    public static KIDS: UICategory = { id: MockCategoriesService.index++ + "", name: 'kids', color: '#e0b100', template: 'Kids Template' };
    public static EVENTS: UICategory = { id: MockCategoriesService.index++ + "", name: 'events', color: '#e7315c', template: 'Events Template' };
    public static MULTIMEDIA: UICategory = { id: MockCategoriesService.index++ + "", name: 'multimedia', color: '#1e9ee7', template: 'Multimedia Template' };
    public static TRAVEL: UICategory = { id: MockCategoriesService.index++ + "", name: 'travel', color: '#f09830', template: 'Travel Template' };
    public static SAFETY: UICategory = { id: MockCategoriesService.index++ + "", name: 'safety', color: '#f57d2b', template: 'Safety Template' };

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