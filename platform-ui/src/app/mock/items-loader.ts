import { UIBorrowRecord } from '../models/UIBorrowRecord';
import { UIBorrowDetailedStatus } from '../models/UIBorrowStatus';
import { UICategory } from '../models/UICategory';
import { UIItem } from '../models/UIItem';
import { MockCategoriesService } from '../portal/community/services/mock/categories.service'; // Import the mock categories service
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
  var itemsLoaded = items.map((item) => {
    return {
      ...item,
      category: mapCategory(item.category),
      borrowRecords: item.borrowRecords.map(
        (record) =>
          ({
            id: record.id,
            startDate: new Date(record.startDate),
            endDate: new Date(record.endDate),
            reservationDate: new Date(record.reservationDate),
            pickupDate: record.pickupDate ? new Date(record.pickupDate) : null,
            effectiveReturnDate: record.effectiveReturnDate ? new Date(record.effectiveReturnDate) : null,
            borrowedBy: record.borrowedBy,
            status: record.status
          }) as UIBorrowRecord,
      ),
      createdAt: new Date(item.createdAt), // Convert string to Date
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
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
  return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
}

function generateRandomRecords(numRecords: number) {
  const records = [];
  for (let i = 0; i < numRecords; i++) {
    const id = Math.random() > 0.5 ? '11' : (Math.random() % 14) + 1;
    const startDate = getRandomDate(
      new Date('2024-01-01'),
      new Date('2025-12-31'),
    );
    const endDate = new Date(
      new Date(startDate).getTime() +
      (Math.floor(Math.random() * 7) + 1) * 24 * 60 * 60 * 1000,
    )
      .toISOString()
      .split('T')[0];
    records.push({
      id: (i + 1).toString(),
      borrowedBy: id,
      startDate: startDate,
      endDate: endDate,
    });
  }
  return records;
}


export function getBorrowRecordStatus(reservationDate: Date, startDate: Date, pickupDate: Date | null, endDate: Date, effectiveReturnDate: Date | null): UIBorrowDetailedStatus {
  const now = new Date();

  if (now < reservationDate) {
    return UIBorrowDetailedStatus.Reserved_Impossible;
  } else if (now < startDate && (!pickupDate || now < pickupDate!)) {
    return UIBorrowDetailedStatus.Reserved_Confirmed;
  }

  if (!pickupDate) {
    if (startDate! <= now) {
      return UIBorrowDetailedStatus.Reserved_ReadyToPickup;
    } else {
      return UIBorrowDetailedStatus.Reserved_Confirmed;
    }
  }

  if (now < endDate) {

    if (effectiveReturnDate) {
      return UIBorrowDetailedStatus.Returned_Early;
    } else {
      return UIBorrowDetailedStatus.Borrowed_Active;
    }
  }

  if (endDate === now) {
    if (effectiveReturnDate) {
      return UIBorrowDetailedStatus.Returned_OnTime;
    } else {
      return UIBorrowDetailedStatus.Borrowed_DueToday;
    }
  }

  if (endDate < now) {
    if (effectiveReturnDate) {
      if (effectiveReturnDate! < endDate) {
        return UIBorrowDetailedStatus.Returned_Early;
      } else if (effectiveReturnDate! > endDate) {
        return UIBorrowDetailedStatus.Returned_Late;
      } else {
        return UIBorrowDetailedStatus.Returned_OnTime;
      }
    } else {
      return UIBorrowDetailedStatus.Borrowed_Late;
    }
  } else {
    return UIBorrowDetailedStatus.Reserved_Impossible;
  }
}

