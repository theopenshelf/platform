CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "items" (
  "id" uuid UNIQUE DEFAULT uuid_generate_v4() PRIMARY KEY ,
  "name" varchar,
  "description" varchar(40096),
  "location" varchar,
  "created_at" timestamp
);

INSERT INTO "items" (
    "name",
    "description",
    "location",
    "created_at"
) VALUES (
    'Sample Item',
    'This is a sample description for the fake item. It can be as detailed as needed to test the character limit and functionality.',
    'Sample Location',
    NOW()
);