import json
import uuid


def load_json(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)

def generate_uuid():
    return str(uuid.uuid4())

def map_user_ids(users):
    user_id_map = {}
    for user in users:
        user_id_map[user['id']] = generate_uuid()
    return user_id_map

def escape_sql_string(value):
    """Escape single quotes in SQL strings."""
    return value.replace("'", "''")

def generate_users_sql(users, user_id_map):
    sql_statements = []
    password_hash = "$2a$10$FZLU/ajV2PZmD9cXiZqNMuruo592lNW13uKcICG5oEBdnfYNbej1e"  # Use this hash for all passwords
    for user in users:
        new_id = user_id_map[user['id']]
        sql = f"INSERT INTO users (id, username, email, password, first_name, last_name, flat_number, street_address, city, postal_code, country, preferred_language, avatar_url, is_email_verified, disabled) VALUES ('{new_id}', '{escape_sql_string(user['username'])}', '{escape_sql_string(user['email'])}', '{password_hash}', '{escape_sql_string(user['firstName'])}', '{escape_sql_string(user['lastName'])}', '{escape_sql_string(user['flatNumber'])}', '{escape_sql_string(user['streetAddress'])}', '{escape_sql_string(user['city'])}', '{escape_sql_string(user['postalCode'])}', '{escape_sql_string(user['country'])}', '{escape_sql_string(user['preferredLanguage'])}', '{escape_sql_string(user.get('avatarUrl', ''))}', {str(user['isEmailVerified']).lower()}, {str(user['disabled']).lower()});"
        sql_statements.append(sql)
    return sql_statements

def generate_notifications_sql(notifications, user_id_map):
    sql_statements = []
    for user_id in user_id_map.values():
        for notification in notifications:
            # Assign the current user_id to the notification
            # Ensure type is valid according to the constraint
            notification_type = notification['type'].replace('-', '_').upper()
            if notification_type not in [
                'ITEM_AVAILABLE',
                'ITEM_DUE',
                'ITEM_BORROW_RESERVATION_DATE_START',
                'ITEM_RESERVED_NO_LONGER_AVAILABLE'
            ]:
                notification_type = 'ITEM_AVAILABLE'  # Default to a valid type if necessary
            # Use UUID for the notification ID
            notification_id = generate_uuid()
            sql = f"INSERT INTO notifications (id, user_id, author, date, type, already_read, payload) VALUES ('{notification_id}', '{user_id}', '{notification['author']}', '{notification['date']}', '{notification_type}', {str(notification['alreadyRead']).lower()}, '{json.dumps(notification['payload'])}');"
            sql_statements.append(sql)
    return sql_statements

def generate_libraries_sql(libraries, community_id_map):
    sql_statements = []
    library_id_map = {}  # Map to store library ID to UUID mapping
    for library in libraries:
        library_uuid = generate_uuid()
        library_id_map[library['id']] = library_uuid

        community_id = community_id_map.get(library['communityId'], None)
        community_id_sql = f"'{community_id}'" if community_id else "NULL"

        sql = f"INSERT INTO libraries (id, name, community_id, free_access, is_admin, requires_approval, instructions, location_name, address, lat, lng) VALUES ('{library_uuid}', '{escape_sql_string(library['name'])}', {community_id_sql}, {str(library.get('freeAccess', False)).lower()}, {str(library.get('isAdmin', False)).lower()}, {str(library.get('requiresApproval', False)).lower()}, '{escape_sql_string(library.get('instructions', ''))}', '{escape_sql_string(library.get('locationName', ''))}', '{escape_sql_string(library.get('address', ''))}', {library.get('lat', 0.0)}, {library.get('lng', 0.0)});"
        sql_statements.append(sql)
    return sql_statements, library_id_map

def generate_help_sql(help_data):
    sql_statements = []
    category_id_map = {}  # Map to store category ID to UUID mapping
    for category in help_data['categories']:
        # Generate a new UUID for the category
        category_uuid = generate_uuid()
        category_id_map[category['id']] = category_uuid
        sql = f"INSERT INTO help_categories (id, name, icon, display_order) VALUES ('{category_uuid}', '{escape_sql_string(category['name'])}', '{escape_sql_string(category['icon'])}', {category['order']});"
        sql_statements.append(sql)
    for article in help_data['articles']:
        # Use the mapped UUID for category_id
        category_id = category_id_map.get(article['category_id'], 'NULL')
        sql = f"INSERT INTO help_articles (id, title, content, display_order, category_id) VALUES ('{generate_uuid()}', '{escape_sql_string(article['title'])}', '{escape_sql_string(article['content'])}', {article['order']}, '{category_id}');"
        sql_statements.append(sql)
    return sql_statements, category_id_map

def generate_custom_pages_sql(custom_pages, community_id_map):
    sql_statements = []
    for page in custom_pages:
        # Convert position to uppercase to match the constraint
        position = page['position'].replace('-', '_').upper()
        valid_positions = ['FOOTER_LINKS', 'COPYRIGHT', 'FOOTER_HELP', 'COMMUNITY']
        if position not in valid_positions:
            position = 'FOOTER_LINKS'  # Default to a valid position if necessary

        # Map community_id to UUID, use NULL if not found
        community_id = community_id_map.get(page['communityId'], None)
        community_id_sql = f"'{community_id}'" if community_id else "NULL"

        sql = f"INSERT INTO custom_pages (id, position, ref, title, community_id, display_order, content) VALUES ('{generate_uuid()}', '{escape_sql_string(position)}', '{escape_sql_string(page['ref'])}', '{escape_sql_string(page['title'])}', {community_id_sql}, {page['order']}, '{escape_sql_string(page['content'])}');"
        sql_statements.append(sql)
    return sql_statements

def generate_communities_sql(communities):
    sql_statements = []
    community_id_map = {}
    for community in communities:
        community_uuid = generate_uuid()
        community_id_map[community['id']] = community_uuid
        sql = f"INSERT INTO communities (id, name, description, picture, requires_approval, location_name, address, lat, lng) VALUES ('{community_uuid}', '{escape_sql_string(community['name'])}', '{escape_sql_string(community['description'])}', '{escape_sql_string(community['picture'])}', {community['requiresApproval']}, '{escape_sql_string(community['location']['name'])}', '{escape_sql_string(community['location']['address'])}', {community['location']['coordinates']['lat']}, {community['location']['coordinates']['lng']});"
        sql_statements.append(sql)
    return sql_statements, community_id_map

def generate_items_sql(items, libraries, user_id_map, library_id_map, community_id_map, category_id_map):
    sql_statements = []
    item_id_map = {}  # Map to store item ID to UUID mapping
    for item in items:
        # Generate a new UUID for the item
        item_uuid = generate_uuid()
        item_id_map[item['id']] = item_uuid

        # Replace newlines with spaces or escape them
        description = escape_sql_string(item['description'].replace('\n', ' '))
        short_description = escape_sql_string(item['shortDescription'].replace('\n', ' '))

        # Map library_id to UUID
        library_id = library_id_map.get(item['libraryId'], None)
        
        # Deduce community_id from the library entity
        community_id = None
        if library_id:
            library = next((lib for lib in libraries if lib['id'] == item['libraryId']), None)
            if library:
                community_id = community_id_map.get(library['communityId'], None)

        # Map category name to UUID
        category_id = None
        for cat_name, cat_uuid in category_id_map.items():
            if cat_name.lower() == item['category'].lower():
                category_id = cat_uuid
                break

        # Use 'NULL' without quotes if the ID is None
        library_id_sql = f"'{library_id}'" if library_id else "NULL"
        community_id_sql = f"'{community_id}'" if community_id else "NULL"
        category_id_sql = f"'{category_id}'" if category_id else "NULL"
        
        sql = f"INSERT INTO items (id, name, description, short_description, image_url, located, created_at, borrow_count, favorite, owner, library_id, category_id, community_id) VALUES ('{item_uuid}', '{escape_sql_string(item['name'])}', '{description}', '{short_description}', '{escape_sql_string(item['imageUrl'])}', '{escape_sql_string(item.get('located', ''))}', '{item['createdAt']}', {item['borrowCount']}, {item['favorite']}, '{escape_sql_string(item.get('owner', ''))}', {library_id_sql}, {category_id_sql}, {community_id_sql});"
        sql_statements.append(sql)
        
        for record in item['borrowRecords']:
            borrowed_by = user_id_map.get(record['borrowedBy'], record['borrowedBy'])
            # Ensure status is valid according to the constraint
            status = record['status'].replace('-', '_').upper()
            if status not in [
                'RESERVED_UNCONFIRMED', 'RESERVED_CONFIRMED', 'RESERVED_READY_TO_PICKUP',
                'RESERVED_PICKUP_UNCONFIRMED', 'BORROWED_ACTIVE', 'BORROWED_DUE_TODAY',
                'BORROWED_LATE', 'BORROWED_RETURN_UNCONFIRMED', 'RETURNED_EARLY',
                'RETURNED_ON_TIME', 'RETURNED_LATE'
            ]:
                status = 'RESERVED_UNCONFIRMED'  # Default to a valid status if necessary
            # Use 'NULL' without quotes if the date is None
            pickup_date = f"'{record.get('pickupDate')}'" if record.get('pickupDate') else "NULL"
            effective_return_date = f"'{record.get('effectiveReturnDate')}'" if record.get('effectiveReturnDate') else "NULL"
            record_sql = f"INSERT INTO borrow_records (id, item_id, borrowed_by, reservation_date, start_date, end_date, pickup_date, effective_return_date, status) VALUES ('{generate_uuid()}', '{item_uuid}', '{borrowed_by}', '{record['reservationDate']}', '{record['startDate']}', '{record['endDate']}', {pickup_date}, {effective_return_date}, '{status}');"
            sql_statements.append(record_sql)
    return sql_statements

def generate_item_categories_sql(categories):
    sql_statements = []
    category_id_map = {}
    for category in categories:
        category_uuid = generate_uuid()
        category_id_map[category['name'].lower()] = category_uuid
        sql = f"INSERT INTO categories (id, name, icon, color, template) VALUES ('{category_uuid}', '{escape_sql_string(category['name'])}', '{escape_sql_string(category['icon'])}', '{escape_sql_string(category['color'])}', '{escape_sql_string(category['template'])}');"
        sql_statements.append(sql)
    return sql_statements, category_id_map

def generate_community_members_sql(communities, user_id_map, community_id_map):
    sql_statements = []
    for community in communities:
        community_id = community_id_map.get(community['id'], None)
        if community_id:
            for member in community.get('members', []):
                user_id = user_id_map.get(member['userId'], None)
                role = member['role'].upper()
                if role not in ['ADMIN', 'MEMBER', 'REQUESTING_JOIN']:
                    role = 'MEMBER'  # Default to a valid role if necessary

                if user_id:
                    sql = f"INSERT INTO community_members (id, community_id, user_id, role) VALUES ('{generate_uuid()}', '{community_id}', '{user_id}', '{role}');"
                    sql_statements.append(sql)
    return sql_statements

def generate_library_members_sql(libraries, user_id_map, library_id_map):
    sql_statements = []
    for library in libraries:
        library_id = library_id_map.get(library['id'], None)
        if library_id:
            for member in library.get('members', []):
                user_id = user_id_map.get(member['userId'], None)
                role = member['role'].upper()
                if role not in ['ADMIN', 'MEMBER', 'REQUESTING_JOIN']:
                    role = 'MEMBER'  # Default to a valid role if necessary

                if user_id:
                    sql = f"INSERT INTO library_members (id, library_id, user_id, role) VALUES ('{generate_uuid()}', '{library_id}', '{user_id}', '{role}');"
                    sql_statements.append(sql)
    return sql_statements

def generate_data_sql():
    users = load_json('platform/platform-ui/src/app/mock/users.json')
    notifications = load_json('platform/platform-ui/src/app/mock/notifications.json')
    libraries = load_json('platform/platform-ui/src/app/mock/libraries.json')
    help_data = load_json('platform/platform-ui/src/app/mock/help.json')
    custom_pages = load_json('platform/platform-ui/src/app/mock/custom-pages.json')
    communities = load_json('platform/platform-ui/src/app/mock/communities.json')
    items = load_json('platform/platform-ui/src/app/mock/items.json')

    item_categories = load_json('platform/platform-ui/src/app/mock/item-categories.json')

    user_id_map = map_user_ids(users)

    # Generate communities and get the community_id_map
    community_sql, community_id_map = generate_communities_sql(communities)

    # Generate libraries and get the library_id_map
    library_sql, library_id_map = generate_libraries_sql(libraries, community_id_map)

    # Generate item categories and get the category_id_map
    item_category_sql, category_id_map = generate_item_categories_sql(item_categories)

    sql_statements = []

    # Users
    sql_statements.append("-- Users")
    sql_statements.extend(generate_users_sql(users, user_id_map))
    sql_statements.append("")

    # Communities
    sql_statements.append("-- Communities")
    sql_statements.extend(community_sql)
    sql_statements.append("")

    # Libraries
    sql_statements.append("-- Libraries")
    sql_statements.extend(library_sql)
    sql_statements.append("")

    # Item Categories
    sql_statements.append("-- Item Categories")
    sql_statements.extend(item_category_sql)
    sql_statements.append("")

    # Items and Borrow Records
    sql_statements.append("-- Items and Borrow Records")
    sql_statements.extend(generate_items_sql(items, libraries, user_id_map, library_id_map, community_id_map, category_id_map))
    sql_statements.append("")

    # Notifications
    sql_statements.append("-- Notifications")
    sql_statements.extend(generate_notifications_sql(notifications, user_id_map))
    sql_statements.append("")

    # Help Categories and Articles
    sql_statements.append("-- Help Categories and Articles")
    category_sql, _ = generate_help_sql(help_data)
    sql_statements.extend(category_sql)
    sql_statements.append("")

    # Custom Pages
    sql_statements.append("-- Custom Pages")
    sql_statements.extend(generate_custom_pages_sql(custom_pages, community_id_map))
    sql_statements.append("")

    # Community Members
    sql_statements.append("-- Community Members")
    sql_statements.extend(generate_community_members_sql(communities, user_id_map, community_id_map))
    sql_statements.append("")

    # Library Members
    sql_statements.append("-- Library Members")
    sql_statements.extend(generate_library_members_sql(libraries, user_id_map, library_id_map))
    sql_statements.append("")

    with open('platform/db/postgres/data.sql', 'w') as file:
        for statement in sql_statements:
            file.write(statement + '\n')

if __name__ == "__main__":
    generate_data_sql()