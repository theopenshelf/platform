import { UIBorrowRecord } from '../../models/UIBorrowRecord';
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

    const today = new Date().toISOString().split('T')[0];
    var itemsLoaded = items.map(item => {
        var borrowRecords = generateRandomRecords(Math.floor(Math.random() * 11))
        return {
            ...item,
            borrowRecords: item.borrowRecords.map((record) => ({
                id: record.id,
                startDate: new Date(record.startDate),
                endDate: new Date(record.endDate),
                borrowedBy: record.borrowedBy
            } as UIBorrowRecord)),
            isBookedToday: borrowRecords.some(record =>
                record.startDate <= today && today <= record.endDate
            ),
            myBooking: (() => {
                const record = borrowRecords.find(record =>
                    record.borrowedBy === 'me@example.com' && record.startDate > today
                );
                return record ? {
                    id: record.id,
                    startDate: new Date(record.startDate),
                    endDate: new Date(record.endDate),
                    borrowedBy: record.borrowedBy
                } : undefined;
            })(),
            createdAt: new Date(item.createdAt) // Convert string to Date
        };
    });

    return itemsLoaded;
};

function getRandomEmail() {
    const domains = ['example.com', 'test.com', 'sample.org'];
    const names = ['john', 'jane', 'doe', 'user', 'admin'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    return `${randomName}@${randomDomain}`;
}

function getRandomDate(start: Date, end: Date) {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
}

function generateRandomRecords(numRecords: number) {
    const records = [];
    for (let i = 0; i < numRecords; i++) {
        const email = Math.random() > 0.5 ? 'me@example.com' : getRandomEmail();
        const startDate = getRandomDate(new Date('2024-01-01'), new Date('2025-12-31'));
        const endDate = new Date(new Date(startDate).getTime() + (Math.floor(Math.random() * 7) + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        records.push({
            id: (i + 1).toString(),
            borrowedBy: email,
            startDate: startDate,
            endDate: endDate
        });
    }
    return records;
}