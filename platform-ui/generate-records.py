import json
from datetime import datetime, timedelta
import random

# Load the JSON data
with open('src/app/portal/community/services/mock/items.json', 'r') as file:
    data = json.load(file)

# Current date
now = datetime.now().date()

# Function to calculate pickupDate
def calculate_pickup_date(start_date_str):
    start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
    if start_date < now:
        # Choose a date between startDate - 2 days and startDate + 1 day
        date_range = [start_date - timedelta(days=2), start_date + timedelta(days=1)]
    else:
        # Choose a date between startDate - 2 days and startDate
        date_range = [start_date - timedelta(days=2), start_date]

    # 50% chance to set pickupDate to startDate
    if random.random() < 0.5:
        return start_date_str
    else:
        return (date_range[0] + timedelta(days=random.randint(0, (date_range[1] - date_range[0]).days))).strftime("%Y-%m-%d")

# Update each borrow record with a pickupDate
for item in data:
    for record in item.get('borrowRecords', []):
        record['pickupDate'] = calculate_pickup_date(record['startDate'])

# Write the updated data back to the JSON file
with open('src/app/portal/community/services/mock/items.json', 'w') as file:
    json.dump(data, file, indent=4)