CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "items" (
  "id" uuid UNIQUE DEFAULT uuid_generate_v4() PRIMARY KEY,
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

CREATE TABLE "users" (
    "id" uuid UNIQUE DEFAULT uuid_generate_v4() PRIMARY KEY,
    "username" VARCHAR(50) NOT NULL UNIQUE,
    "email" VARCHAR(100) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(255),
    "last_name" VARCHAR(255),
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password, email, first_name, last_name) VALUES
('john_doe', '$2a$10$/APsou9Dm.JeRSa/VNhcYeaQvcZUVGjqKWzMz86tlptob4TfrJ/UW', 'john.doe@example.com', 'John', 'Doe'),
('jane_smith', '$2a$10$FZLU/ajV2PZmD9cXiZqNMuruo592lNW13uKcICG5oEBdnfYNbej1e', 'jane.smith@example.com', 'Jane', 'Smith');