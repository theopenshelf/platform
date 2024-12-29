import { UICategory } from '../../models/UICategory';
import { UIItem } from '../../models/UIItem';
import { MockCategoriesService } from './categories.service'; // Import the mock categories service
import items from './items.json'; // Adjust the path as necessary

// Function to map string category to UICategory
const mapCategory = (category: string): UICategory => {
    switch (category.toLowerCase()) {
        case 'books':
            return MockCategoriesService.BOOKS;
        case 'electronics':
            return MockCategoriesService.ELECTRONICS;
        case 'clothing':
            return MockCategoriesService.CLOTHING;
        case 'diy':
            return MockCategoriesService.DIY;
        case 'beauty health':
            return MockCategoriesService.BEAUTY_HEALTH;
        case 'sports outdoors':
            return MockCategoriesService.SPORTS_OUTDOORS;
        case 'camping':
            return MockCategoriesService.CAMPING;
        case 'gardening':
            return MockCategoriesService.GARDENING;
        case 'vehicle':
            return MockCategoriesService.VEHICLE;
        case 'home':
            return MockCategoriesService.HOME;
        case 'kids':
            return MockCategoriesService.KIDS;
        case 'events':
            return MockCategoriesService.EVENTS;
        case 'multimedia':
            return MockCategoriesService.MULTIMEDIA;
        case 'travel':
            return MockCategoriesService.TRAVEL;
        case 'safety':
            return MockCategoriesService.SAFETY;
        // Add more cases for additional categories
        default:
            throw new Error(`Unknown category: ${category}`);
    }
};

export const loadItems = (): UIItem[] => {
    return items.map(item => ({
        ...item,
        category: mapCategory(item.category),
        createdAt: new Date(item.createdAt) // Convert string to Date
    }));
}; 