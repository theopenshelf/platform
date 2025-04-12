CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "users" (
    "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "username" varchar(255) NOT NULL UNIQUE,
    "email" varchar(255) NOT NULL UNIQUE,
    "password" varchar(255) NOT NULL,
    "first_name" varchar(255),
    "last_name" varchar(255),
    "flat_number" varchar(255),
    "street_address" varchar(255),
    "city" varchar(255),
    "postal_code" varchar(255),
    "country" varchar(255),
    "preferred_language" varchar(255),
    "avatar_url" varchar(255),
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "is_email_verified" boolean NOT NULL DEFAULT false,
    "disabled" boolean NOT NULL DEFAULT false,
    "status" varchar(255) NOT NULL DEFAULT 'WAITING_FOR_EMAIL' CHECK (status IN ('WAITING_FOR_EMAIL', 'ACTIVE', 'INACTIVE'))
);

CREATE TABLE "communities" (
    "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "name" varchar(255),
    "description" varchar(255),
    "picture" varchar(255),
    "requires_approval" boolean NOT NULL DEFAULT false,
    "location_name" varchar(255),
    "address" varchar(255),
    "lat" float,
    "lng" float
);

CREATE TABLE "libraries" (
    "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "name" varchar(255),
    "community_id" uuid REFERENCES communities(id),
    "free_access" boolean NOT NULL DEFAULT false,
    "is_admin" boolean NOT NULL DEFAULT false,
    "requires_approval" boolean NOT NULL DEFAULT false,
    "instructions" varchar(255),
    "location_name" varchar(255),
    "address" varchar(255),
    "lat" float,
    "lng" float
);

CREATE TABLE "community_members" (
    "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "community_id" uuid REFERENCES communities(id),
    "user_id" uuid REFERENCES users(id),
    "role" varchar(255) CHECK (role IN ('ADMIN', 'MEMBER', 'REQUESTING_JOIN'))
);

CREATE TABLE "library_members" (
    "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "library_id" uuid REFERENCES libraries(id),
    "user_id" uuid REFERENCES users(id),
    "role" varchar(255) CHECK (role IN ('ADMIN', 'MEMBER', 'REQUESTING_JOIN'))
);


CREATE TABLE "categories" (
    "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "name" varchar(255),
    "icon" varchar(255),
    "color" varchar(255),
    "template" varchar(255)
);

-- Create tables with all required columns and constraints
CREATE TABLE "items" (
    "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "name" varchar(255),
    "description" varchar(3000),
    "short_description" varchar(1000),
    "image_url" varchar(255),
    "located" varchar(255),
    "created_at" timestamp,
    "borrow_count" integer NOT NULL DEFAULT 0,
    "favorite" boolean NOT NULL DEFAULT false,
    "owner" varchar(255),
    "library_id" uuid REFERENCES libraries(id),
    "category_id" uuid REFERENCES categories(id),
    "community_id" uuid REFERENCES communities(id)
);



CREATE TABLE "borrow_records" (
    "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "item_id" uuid REFERENCES items(id),
    "borrowed_by" varchar(255),
    "reservation_date" date,
    "start_date" date,
    "end_date" date,
    "pickup_date" date,
    "effective_return_date" date,
    "status" varchar(255) CHECK (status IN (
        'RESERVED_UNCONFIRMED', 'RESERVED_CONFIRMED', 'RESERVED_READY_TO_PICKUP',
        'RESERVED_PICKUP_UNCONFIRMED', 'BORROWED_ACTIVE', 'BORROWED_DUE_TODAY',
        'BORROWED_LATE', 'BORROWED_RETURN_UNCONFIRMED', 'RETURNED_EARLY',
        'RETURNED_ON_TIME', 'RETURNED_LATE'
    ))
);

CREATE TABLE "user_roles" (
    "user_id" uuid REFERENCES users(id),
    "role" varchar(255)
);

CREATE TABLE "custom_pages" (
    "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "community_id" uuid REFERENCES communities(id),
    "content" varchar(255),
    "display_order" integer,
    "position" varchar(255) CHECK (position IN ('FOOTER_LINKS', 'COPYRIGHT', 'FOOTER_HELP', 'COMMUNITY')),
    "ref" varchar(255),
    "title" varchar(255)
);

CREATE TABLE "help_categories" (
    "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "display_order" integer,
    "icon" varchar(255),
    "name" varchar(255)
);

CREATE TABLE "help_articles" (
    "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "content" varchar(4000),
    "display_order" integer,
    "title" varchar(255),
    "category_id" uuid REFERENCES help_categories(id)
);

CREATE TABLE "notifications" (
    "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "user_id" uuid REFERENCES users(id),
    "already_read" boolean NOT NULL,
    "author" varchar(255),
    "date" timestamp(6) with time zone,
    "payload" jsonb,
    "type" varchar(255) CHECK (type IN (
        'ITEM_AVAILABLE',
        'ITEM_DUE',
        'ITEM_BORROW_RESERVATION_DATE_START',
        'ITEM_RESERVED_NO_LONGER_AVAILABLE',
        'ITEM_RESERVATION_APPROVED',
        'ITEM_RESERVATION_REJECTED',
        'ITEM_PICKUP_APPROVED',
        'ITEM_PICKUP_REJECTED',
        'ITEM_RETURN_APPROVED',
        'ITEM_RETURN_REJECTED',
        'ITEM_NEW_RESERVATION_TO_CONFIRM',
        'ITEM_NEW_PICKUP_TO_CONFIRM',
        'ITEM_NEW_RETURN_TO_CONFIRM'
    )),
    "item_id" uuid REFERENCES items(id),
    "borrow_record_id" uuid REFERENCES borrow_records(id)
);

CREATE TABLE settings (
    key VARCHAR(255) PRIMARY KEY,
    value TEXT NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE "notification_settings" (
    "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "user_id" uuid REFERENCES users(id) NOT NULL,
    "enable_notifications" boolean NOT NULL DEFAULT true
);
