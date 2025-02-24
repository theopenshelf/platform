import json
import os
import random
import subprocess
from datetime import datetime, timedelta
from io import BytesIO

import openai
import requests
from bs4 import BeautifulSoup
from PIL import Image

# Constants
BASE_URL = "https://api.libraryofthings.co.uk/"
IMAGE_DIR = "fake-dataset/items"
ITEMS_JSON_PATH = "fake-dataset/items.json"
USERS_JSON_PATH = "fake-dataset/users.json"


# Ensure the image directory exists
os.makedirs(IMAGE_DIR, exist_ok=True)

def fetch_items():
    headers = {
        'accept': '*/*',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjBjYmJiZDI2NjNhY2U4OTU4YTFhOTY4ZmZjNDQxN2U4MDEyYmVmYmUiLCJ0eXAiOiJKV1QifQ.eyJwcm92aWRlcl9pZCI6ImFub255bW91cyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9saWJyYXJ5LW9mLXRoaW5ncy1wcm9kdWN0aW9uIiwiYXVkIjoibGlicmFyeS1vZi10aGluZ3MtcHJvZHVjdGlvbiIsImF1dGhfdGltZSI6MTczMTcwMDgwMiwidXNlcl9pZCI6IkxiNXE5VkZ3TVhNN1RqN2JoN3p3SkQ0czNWVTIiLCJzdWIiOiJMYjVxOVZGd01YTTdUajdiaDd6d0pENHMzVlUyIiwiaWF0IjoxNzQwNDA3MzA0LCJleHAiOjE3NDA0MTA5MDQsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnt9LCJzaWduX2luX3Byb3ZpZGVyIjoiYW5vbnltb3VzIn19.fZVmyknr9p6bUaqPnwvVRV3MI9CTNbemZyzlL4HLhRaExot_I-PWKiMTUfEoItw0gBkt3iOamFra5Olzs5gTqhDnTv9Qynggi6aM-_Fu5SbW-o2T2bPg_zUk4QJBo_BOibMOjs4YoyYv1njKfWlhdzBX3tbfxSid14rZPUm66MsdaqTGhJ5HAW_D6AUo0UVTcxsi-U3kzXp0kNn_IWpazHVdd7Vqq1egBy3XanLO8us8OQoAa_XP3Ml3ZA4_Kn-LyMLTcZxEEKHf2D1JFRaugAVENq03QC44MxO4LP8pHVbW07oU12sfgaRkfT0Em0oOezz0WT3BczoRvVBBK_4Ybw',
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'network': 'lot',
        'origin': 'https://www.libraryofthings.co.uk',
        'pragma': 'no-cache',
        'priority': 'u=1, i',
        'referer': 'https://www.libraryofthings.co.uk/',
        'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
    }
    
    data = {
        "operationName": "GetCatalogueData",
        "variables": {"search": None},
        "query": "query GetCatalogueData($search: String) {\n  things(where: {activeOnly: true, search: $search}) {\n    ...AllThingFields\n    availableLocations {\n      code\n      status\n      __typename\n    }\n    __typename\n  }\n  categories {\n    id\n    name\n    slug\n    thumbnail\n    description\n    things {\n      id\n      slug\n      __typename\n    }\n    seoTitle\n    seoDescription\n    __typename\n  }\n  openLocations {\n    id\n    name\n    code\n    kioskStatus\n    deliveryStatus\n    latitude\n    longitude\n    deliveryRadius\n    __typename\n  }\n}\n\nfragment AllThingFields on Thing {\n  atAGlance {\n    icon\n    description\n    __typename\n  }\n  id\n  name\n  imageBaseUrl\n  make\n  model\n  slug\n  impact {\n    spaceSaved {\n      amount\n      __typename\n    }\n    moneySaved {\n      grossAmount\n      netAmount\n      currency\n      __typename\n    }\n    wasteSaved {\n      amount\n      __typename\n    }\n    __typename\n  }\n  categories {\n    id\n    name\n    slug\n    __typename\n  }\n  models {\n    brand\n    model\n    __typename\n  }\n  hourlyPrice {\n    grossAmount\n    netAmount\n    currency\n    __typename\n  }\n  dailyPrice {\n    grossAmount\n    netAmount\n    currency\n    __typename\n  }\n  weeklyPrice {\n    grossAmount\n    netAmount\n    currency\n    __typename\n  }\n  whatItDoes\n  whatsIncluded\n  goodToKnow\n  shortSummary\n  minimumLoanLength\n  seoTitle\n  seoDescription\n  isCollectable\n  isDeliverable\n  isActive\n  requiresIdCheck\n  slotDuration\n  suggestedReservationLengths\n  __typename\n}"
    }
    
    response = requests.post(BASE_URL, headers=headers, json=data)
    response_data = response.json()
    
    # Check if 'data' key is present in the response
    if 'data' not in response_data:
        print("Error in response:", response_data)  # Log the entire response for debugging
        return []  # Return an empty list or handle the error as needed
    
    # Extract item details from the response
    items = response_data['data']['things']
    
    item_data = []
    for item in items:
        # Extract item details
        name = item['name']
        image_url = item['imageBaseUrl']
        description = item.get('whatItDoes', "Default description")
        
        # Translate name to French using ChatGPT
        translated_name = call_chatgpt(f"Translate the following text to French: {name}")
        
        # Translate description to French using ChatGPT
        if is_english(description):
            translated_description = call_chatgpt(f"Translate the following text to French: {description}")
        else:
            translated_description = description

        # Remove any unwanted phrases from the translated description
        translated_description = translated_description.replace("Here is the translation of the text to French:", "").strip()
        
        # Translate short description to French using ChatGPT
        short_description = item.get('shortSummary', "Default short description")
        if not short_description:
            short_description = call_chatgpt(f"Generate a short description for: {description}")
        translated_short_description = call_chatgpt(f"Translate the following text to French: {short_description}")

        # Download image
        image_path = download_image(image_url, name)
        
        # Skip item if image download fails
        if image_path is None:
            print(f"Skipping item {name} due to image download failure.")
            continue
        
        # Create item data
        item_data.append({
            "id": str(random.randint(100, 10000)),
            "name": translated_name,
            "imageUrl": image_path,
            "description": translated_description,
            "shortDescription": translated_short_description,
            "category": random.choice(["home", "kids", "safety", "books", "diy"]),
            "favorite": random.choice([True, False]),
            "borrowCount": random.randint(0, 20),
            "libraryId": random.choice(["4", "5", "6", "7", "8", "9"]),
            "createdAt": datetime.now().isoformat(),
            "borrowRecords": generate_borrow_records()
        })
    
    return item_data

def download_image(url, name):
    try:
        image_path = os.path.join(IMAGE_DIR, f"{name.replace(' ', '_')}.jpg")
        
        # Construct the wget command
        wget_command = ['wget', '-O', image_path, url]
        
        # Print the wget command
        print("Executing wget command:", ' '.join(wget_command))
        
        # Run the wget command
        result = subprocess.run(wget_command, capture_output=True, text=True)
        
        if result.returncode != 0:
            print(f"wget failed: {result.stderr}")
            return None
        
        return image_path
    except Exception as e:
        print(f"An error occurred: {e}")
    return None

def generate_borrow_records():
    records = []
    for _ in range(random.randint(1, 5)):
        start_date = datetime.now() - timedelta(days=random.randint(1, 365))
        end_date = start_date + timedelta(days=random.randint(1, 14))
        status = random.choice(["reserved-confirmed", "returned", "borrowed-late"])
        
        records.append({
            "id": str(random.randint(100, 100000)),
            "borrowedBy": str(random.randint(1, 14)),  # Assuming user IDs are 1-14
            "startDate": start_date.isoformat(),
            "endDate": end_date.isoformat(),
            "reservationDate": (start_date - timedelta(days=random.randint(1, 30))).isoformat(),
            "effectiveReturnDate": end_date.isoformat() if status == "returned" else None,
            "pickupDate": start_date.isoformat(),
            "status": status
        })
    return records

def call_chatgpt(prompt):
    client = openai.OpenAI()  # Créer un client OpenAI
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content.strip()

def is_english(text):
    # Implement your logic to determine if a text is in English
    # This is a placeholder and should be replaced with actual implementation
    return True

def main():
    items = fetch_items()
    
    # Load existing items
    with open(ITEMS_JSON_PATH, 'r') as f:
        existing_items = json.load(f)
    
    # Append new items
    existing_items.extend(items)
    
    # Save updated items
    with open(ITEMS_JSON_PATH, 'w') as f:
        json.dump(existing_items, f, indent=4)

if __name__ == "__main__":
    main()