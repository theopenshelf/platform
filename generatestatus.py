import json
from datetime import datetime
from typing import Optional
from dateutil import parser

# Define the UIBorrowDetailedStatus enum
class UIBorrowDetailedStatus:
    Reserved_Impossible = "reserved-impossible"
    Reserved_Confirmed = "reserved-confirmed"
    Reserved_ReadyToPickup = "reserved-ready-to-pickup"
    Borrowed_Active = "borrowed-active"
    Borrowed_DueToday = "borrowed-due-today"
    Borrowed_Late = "borrowed-late"
    Returned_OnTime = "returned"
    Returned_Early = "returned-early"
    Returned_Late = "returned-late"

def get_borrow_record_status(reservation_date: datetime, start_date: datetime, pickup_date: Optional[datetime], end_date: datetime, effective_return_date: Optional[datetime]) -> UIBorrowDetailedStatus:
    now = datetime.now()

    if now < reservation_date:
        return UIBorrowDetailedStatus.Reserved_Impossible
    elif now < start_date and (pickup_date is None or now < pickup_date):
        return UIBorrowDetailedStatus.Reserved_Confirmed

    if pickup_date is None:
        if start_date <= now:
            return UIBorrowDetailedStatus.Reserved_ReadyToPickup
        else:
            return UIBorrowDetailedStatus.Reserved_Confirmed

    if now < end_date:
        if effective_return_date:
            return UIBorrowDetailedStatus.Returned_Early
        else:
            return UIBorrowDetailedStatus.Borrowed_Active

    if end_date == now:
        if effective_return_date:
            return UIBorrowDetailedStatus.Returned_OnTime
        else:
            return UIBorrowDetailedStatus.Borrowed_DueToday

    if end_date < now:
        if effective_return_date:
            if effective_return_date < end_date:
                return UIBorrowDetailedStatus.Returned_Early
            elif effective_return_date > end_date:
                return UIBorrowDetailedStatus.Returned_Late
            else:
                return UIBorrowDetailedStatus.Returned_OnTime
        else:
            return UIBorrowDetailedStatus.Borrowed_Late

    return UIBorrowDetailedStatus.Reserved_Impossible

def update_borrow_records_status(file_path: str):
    with open(file_path, 'r') as file:
        items = json.load(file)

    for item in items:
        for record in item['borrowRecords']:
            reservation_date = parser.parse(record['reservationDate'])
            start_date = parser.parse(record['startDate'])
            pickup_date = parser.parse(record['pickupDate']) if record.get('pickupDate') else None
            end_date = parser.parse(record['endDate'])
            effective_return_date = parser.parse(record['effectiveReturnDate']) if record.get('effectiveReturnDate') else None

            status = get_borrow_record_status(reservation_date, start_date, pickup_date, end_date, effective_return_date)
            record['status'] = status

    with open(file_path, 'w') as file:
        json.dump(items, file, indent=4)

# Path to the items.json file
file_path = 'platform-ui/src/app/portal/community/services/mock/items.json'

# Update the borrow records status
update_borrow_records_status(file_path)