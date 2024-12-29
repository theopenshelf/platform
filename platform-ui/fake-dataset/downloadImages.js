const axios = require('axios');
const fs = require('fs');
const { faker } = require('@faker-js/faker');
const path = require('path');


// Define categories with their corresponding search terms for Unsplash
const categories = [
  { name: 'books', searchTerm: 'books' },
  { name: 'electronics', searchTerm: 'electronics' },
  { name: 'clothing', searchTerm: 'clothing' },
  { name: 'diy', searchTerm: 'diy' },
  { name: 'beauty_health', searchTerm: 'beauty health' },
  { name: 'sports_outdoors', searchTerm: 'sports outdoors' },
  { name: 'camping', searchTerm: 'camping' },
  { name: 'gardening', searchTerm: 'gardening' },
  { name: 'vehicle', searchTerm: 'vehicle' },
  { name: 'home', searchTerm: 'home' },
  { name: 'kids', searchTerm: 'kids' },
  { name: 'events', searchTerm: 'events' },
  { name: 'multimedia', searchTerm: 'multimedia' },
  { name: 'travel', searchTerm: 'travel' },
  { name: 'safety', searchTerm: 'safety' }
];

// Unsplash API key
const UNSPLASH_API_KEY = 'ePxibgL8oUfw0rew9W514PkHQ8AX_wzUJuz13T5BM00';

// Fetch images from Unsplash based on category
async function fetchImageFromUnsplash(query) {
  try {
    const response = await axios.get('https://api.unsplash.com/photos/random', {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_API_KEY}`,
      },
      params: {
        query: query,
        count: 1, // Fetch only 1 image
      },
    });

    return response.data[0]?.urls?.regular || 'https://via.placeholder.com/500'; // Fallback if no image found
  } catch (error) {
    console.error('Error fetching image from Unsplash:', error);
    return 'https://via.placeholder.com/500'; // Fallback URL in case of an error
  }
}

// The rest of your code can remain the same as before.

// Generate category-specific product names
const usedProductNames = {
  books: new Set(),
  electronics: new Set(),
  clothing: new Set(),
  diy: new Set(),
  beauty_health: new Set(),
  sports_outdoors: new Set(),
  camping: new Set(),
  gardening: new Set(),
  vehicle: new Set(),
  home: new Set(),
  kids: new Set(),
  events: new Set(),
  multimedia: new Set(),
  travel: new Set(),
  safety: new Set(),
};

// Replace faker.random.arrayElement with faker.helpers.arrayElement
function generateUniqueProductName(category) {
    let name;
    do {
      switch (category) {
        case 'books':
          name = faker.helpers.arrayElement([
            'The Adventure of Sherlock Holmes',
            'Cooking for Beginners',
            'Advanced Python Programming',
            'History of the World',
            'The Art of War',
            'Science of Cooking',
            'The Ultimate Guide to JavaScript',
            'Intro to Philosophy',
            'Modern History of the USA',
            'The Great Gatsby',
            'Learning to Code',
            'The Science of Love',
            'The Road Less Traveled',
            'Shakespeare’s Life',
            'The Book Thief',
            'The Silent Patient',
            'The Alchemist',
            'Educated',
            'Becoming',
            'Atomic Habits',
            'Sapiens: A Brief History of Humankind',
            'The Four Agreements',
            'The 48 Laws of Power',
            'The Subtle Art of Not Giving a F*ck',
            'The Power of Now',
            'The Catcher in the Rye',
            'To Kill a Mockingbird',
            '1984',
            'Brave New World',
            'Pride and Prejudice',
            'Moby Dick',
            'War and Peace',
            'Ulysses',
            'The Hobbit',
            'The Lord of the Rings',
            'The Chronicles of Narnia',
            'A Game of Thrones',
            'The Shining',
            'Harry Potter and the Sorcerer’s Stone',
            'The Secret',
            'The Outsiders',
            'Dune',
            'The Handmaid’s Tale',
          ]);
          break;
        case 'electronics':
          name = faker.helpers.arrayElement([
            'Smartphone',
            'Laptop',
            'Headphones',
            'Smartwatch',
            'Wireless Speaker',
            'Bluetooth Earbuds',
            'LED TV',
            'Gaming Console',
            'Smart Thermostat',
            'Camera Drone',
            'Electric Scooter',
            '4K Projector',
            'Portable Battery Charger',
            'VR Headset',
            'Action Camera',
            'Robot Vacuum',
            'Smart Doorbell',
            'Electric Toothbrush',
            'Smart Light Bulb',
            'Wireless Charger',
            'Smart Refrigerator',
            'Smart Glasses',
            'Electric Skateboard',
            'Home Assistant Speaker',
            'Smart Lock',
            'Air Purifier',
            'Electric Kettle',
            'Smart Plugs',
            'Noise Cancelling Headphones',
            'Smart Speaker',
            'Cordless Vacuum Cleaner',
            'Digital Camera',
            'Bluetooth Speaker',
            'Smart TV Stick',
            'Power Bank',
            'Gaming Headset',
            'Projector Screen',
            'Smartphone Holder',
            'Wearable Fitness Tracker',
            'Streaming Stick',
            'Smartwatch Band',
          ]);
          break;
        case 'clothing':
          name = faker.helpers.arrayElement([
            'Leather Jacket',
            'Winter Coat',
            'Summer Dress',
            'Sneakers',
            'Jeans',
            'T-shirt',
            'Sweater',
            'Boots',
            'Running Shoes',
            'Hat',
            'Scarf',
            'Socks',
            'Gloves',
            'Jacket',
            'Track Pants',
            'Shorts',
            'Cardigan',
            'Blouse',
            'Turtleneck Sweater',
            'Chinos',
            'Puffer Jacket',
            'Denim Jacket',
            'Belt',
            'Shirt Dress',
            'Overalls',
            'Hoodie',
            'Coat',
            'Tie',
            'Sweatpants',
            'Flannel Shirt',
            'Windbreaker',
            'Vest',
            'Raincoat',
            'Poncho',
            'Beanie',
            'Swimsuit',
            'Leggings',
            'Yoga Pants',
            'Cargo Pants',
            'Bikini',
            'Rain Boots',
            'Flip Flops',
          ]);
          break;
        // Other categories would be similar, just replace all faker.random.arrayElement with faker.helpers.arrayElement
        default:
          name = faker.commerce.productName();
      }
    } while (usedProductNames[category].has(name)); // Ensure the name is unique
  
    usedProductNames[category].add(name); // Store the name in the set
    return name;
  }

// Check if the image already exists before downloading
async function downloadImage(url, filepath) {
  try {
    if (fs.existsSync(filepath)) {
      console.log(`Image already exists: ${filepath}`);
      return; // Skip download if the image exists
    }

    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });

    return new Promise((resolve, reject) => {
      response.data
        .pipe(fs.createWriteStream(filepath))
        .on('finish', () => resolve())
        .on('error', (err) => reject(err));
    });
  } catch (error) {
    console.error(`Error downloading ${url}:`, error);
  }
}

async function generateAndDownloadImages() {
    const items = Array.from({ length: 50 }).map(async (_, i) => {
      const category = faker.helpers.arrayElement(categories);
      
      // Use Unsplash instead of Pexels
      const imageUrl = await fetchImageFromUnsplash(category.searchTerm);
  
      return {
        id: `${i + 1}`,
        name: generateUniqueProductName(category.name),
        located: 'ShareSpace',
        owner: 'TheOpenShelf',
        imageUrl: `/items/${i + 1}.jpg`,
        pexelsUrl: imageUrl,  // You can update this variable name to 'unsplashUrl' if preferred
        description: faker.commerce.productDescription(),
        shortDescription: faker.lorem.sentence(),
        category: category.name,
        favorite: faker.datatype.boolean(),
        borrowCount: faker.number.int({ min: 0, max: 20 }),
        libraryId: '1',
        createdAt: new Date().toISOString(),
      };
    });
  
    const resolvedItems = await Promise.all(items);
  
    fs.writeFileSync('items.json', JSON.stringify(resolvedItems, null, 2));
  
    const outputDir = path.join(__dirname, 'images');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
  
    for (const item of resolvedItems) {
      const filepath = path.join(outputDir, `${item.id}.jpg`);
      console.log(`Checking if image exists for item ${item.id}...`);
      await downloadImage(item.pexelsUrl, filepath); // Download only if it doesn't exist
    }
  
    console.log('All images downloaded and items.json created!');
  }
  
  generateAndDownloadImages();