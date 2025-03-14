-- Users
INSERT INTO users (id, username, email, password, first_name, last_name, flat_number, street_address, city, postal_code, country, preferred_language, avatar_url, is_email_verified, disabled) VALUES
('11111111-1111-1111-1111-111111111111', 'john_doe', 'john.doe@example.com', '$2a$10$/APsou9Dm.JeRSa/VNhcYeaQvcZUVGjqKWzMz86tlptob4TfrJ/UW', 'John', 'Doe', '123', '123 Main St', 'Anytown', '12345', 'USA', 'en', NULL, true, false),
('22222222-2222-2222-2222-222222222222', 'jane_smith', 'jane.smith@example.com', '$2a$10$FZLU/ajV2PZmD9cXiZqNMuruo592lNW13uKcICG5oEBdnfYNbej1e', 'Jane', 'Smith', '456', '456 Elm St', 'Othertown', '67890', 'USA', 'en', NULL, true, false),
('33333333-3333-3333-3333-333333333333', 'alice_jones', 'alice.jones@example.com', '$2a$10$FZLU/ajV2PZmD9cXiZqNMuruo592lNW13uKcICG5oEBdnfYNbej1e', 'Alice', 'Jones', '789', '789 Oak St', 'Somewhere', '54321', 'Canada', 'fr', NULL, false, true),
('44444444-4444-4444-4444-444444444444', 'bob_brown', 'bob.brown@example.com', '$2a$10$FZLU/ajV2PZmD9cXiZqNMuruo592lNW13uKcICG5oEBdnfYNbej1e', 'Bob', 'Brown', '101', '101 Pine St', 'Nowhere', '98765', 'Mexico', 'es', NULL, true, false),
('55555555-5555-5555-5555-555555555555', 'emily_davis', 'emily.davis@example.com', '$2a$10$FZLU/ajV2PZmD9cXiZqNMuruo592lNW13uKcICG5oEBdnfYNbej1e', 'Emily', 'Davis', '202', '202 Cedar St', 'Anothertown', '24680', 'Germany', 'de', 'https://example.com/avatars/emily_davis.jpg', true, false),
('66666666-6666-6666-6666-666666666666', 'michael_wilson', 'michael.wilson@example.com', '$2a$10$FZLU/ajV2PZmD9cXiZqNMuruo592lNW13uKcICG5oEBdnfYNbej1e', 'Michael', 'Wilson', '303', '303 Birch St', 'Somecity', '13579', 'Spain', 'es', NULL, true, false),
('77777777-7777-7777-7777-777777777777', 'olivia_martinez', 'olivia.martinez@example.com', '$2a$10$FZLU/ajV2PZmD9cXiZqNMuruo592lNW13uKcICG5oEBdnfYNbej1e', 'Olivia', 'Martinez', '404', '404 Maple St', 'Anothercity', '24680', 'France', 'fr', NULL, true, false),
('88888888-8888-8888-8888-888888888888', 'david_lee', 'david.lee@example.com', '$2a$10$FZLU/ajV2PZmD9cXiZqNMuruo592lNW13uKcICG5oEBdnfYNbej1e', 'David', 'Lee', '505', '505 Oak St', 'Somewhere', '12345', 'China', 'zh', NULL, true, false),
('99999999-9999-9999-9999-999999999999', 'sophia_garcia', 'sophia.garcia@example.com', '$2a$10$FZLU/ajV2PZmD9cXiZqNMuruo592lNW13uKcICG5oEBdnfYNbej1e', 'Sophia', 'Garcia', '606', '606 Pine St', 'Nowhere', '67890', 'Spain', 'es', NULL, true, false),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'charlie_rodriguez', 'charlie.rodriguez@example.com', '$2a$10$FZLU/ajV2PZmD9cXiZqNMuruo592lNW13uKcICG5oEBdnfYNbej1e', 'Charlie', 'Rodriguez', '707', '707 Cedar St', 'Anothertown', '54321', 'Mexico', 'es', NULL, true, false),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'me', 'me@example.com', '$2a$10$FZLU/ajV2PZmD9cXiZqNMuruo592lNW13uKcICG5oEBdnfYNbej1e', 'Me', 'Me', '808', '808 Birch St', 'Somewhere', '12345', 'USA', 'en', 'https://mdbcdn.b-cdn.net/img/new/avatars/2.webp', true, false),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'ava_walker', 'ava.walker@example.com', '$2a$10$FZLU/ajV2PZmD9cXiZqNMuruo592lNW13uKcICG5oEBdnfYNbej1e', 'Ava', 'Walker', '909', '909 Cedar St', 'Anothertown', '67890', 'USA', 'en', NULL, true, false),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'noah_turner', 'noah.turner@example.com', '$2a$10$FZLU/ajV2PZmD9cXiZqNMuruo592lNW13uKcICG5oEBdnfYNbej1e', 'Noah', 'Turner', '1010', '1010 Pine St', 'Nowhere', '54321', 'USA', 'en', NULL, true, false),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'mia_hall', 'mia.hall@example.com', '$2a$10$FZLU/ajV2PZmD9cXiZqNMuruo592lNW13uKcICG5oEBdnfYNbej1e', 'Mia', 'Hall', '1111', '1111 Oak St', 'Somewhere', '12345', 'USA', 'en', NULL, true, false);

-- Communities
INSERT INTO communities (id, name, description, picture, requires_approval, location_name, address, lat, lng) VALUES
('11111111-1111-1111-1111-111111111112', 'Communauté de l''anneau', 'La communauté de l''anneau est une communauté de Hobbits qui veulent protéger la Terre du Milieu.', 'https://e0.pxfuel.com/wallpapers/258/960/desktop-wallpaper-the-one-ring.jpg', false, 'Mordor', '123 Bagshot Row, Hobbiton, The Shire', -43.455046454725355, 171.30580294612173),
('22222222-2222-2222-2222-222222222223', 'Terres de Laya', 'Terres de Laya est un écoquartier avec des ambitions écologiques fortes aux portes du Bourget du Lac', 'https://terresdelaya.fr/terres-de-laya-header.png', true, 'L''eco-hammeau des granges', 'All. de la Dent du Chat, 73290 La Motte-Servolex', 45.632249361296964, 5.86580778251088),
('33333333-3333-3333-3333-333333333334', 'Poitiers - Beaulieu', 'Beaulieu est une communauté offrant un cadre de vie urbain avec des espaces verts, idéale pour les résidents cherchant un équilibre entre la ville et la nature.', '/media/communities/beaulieu.png', false, 'Parc urbain de Beaulieu', 'Bd René Cassin, 86000 Poitiers', 46.573076, 0.384676),
('44444444-4444-4444-4444-444444444444', 'Poitiers - Les 3 cités', 'Les 3 cités est une communauté connue pour son dynamisme culturel et sa forte cohésion communautaire.', 'media/communities/3cites.png', false, 'Parc du Triangle d''Or', '10 Rue Jean de la Fontaine, 86280 Saint-Benoît', 46.564059669449655, 0.3449034728364043),
('55555555-5555-5555-5555-555555555555', 'Poitiers - Les rocs', 'Les rocs est une communauté renommée pour son importance historique et architecturale.', 'media/communities/lesrocs.png', false, 'Place Chocquin de Sarzec', '8-14 Av. de la Paix, 86000 Poitiers', 46.590152, 0.333012),
('66666666-6666-6666-6666-666666666666', 'Poitiers - Centre-ville', 'Poitiers - Centre-ville est une communauté dynamique située au cœur de la ville.', 'media/communities/poitierscentreville.png', false, 'Place de la République', '15 Pl. du Maréchal-Leclerc, 86000 Poitiers', 46.58303704967021, 0.34204776768581924);

-- Libraries
INSERT INTO libraries (id, name, community_id, free_access, is_admin, requires_approval, instructions, location_name, address, lat, lng) VALUES
('11111111-1111-1111-1111-111111111113', 'Common space', '22222222-2222-2222-2222-222222222223', true, true, false, 'Please follow the guidelines for hub usage.', 'Bat B', '123 Main St, Anytown, USA', 40.7128, -74.0060),
('22222222-2222-2222-2222-222222222224', 'Garage 102', '22222222-2222-2222-2222-222222222223', false, true, true, 'Reserve an items and as I am using it too, I will let you know when it''s available.', 'Garage 102', '123 Main St, Anytown, USA', 40.7128, -74.0060),
('33333333-3333-3333-3333-333333333335', 'Garage 212', '22222222-2222-2222-2222-222222222223', false, true, true, 'Reserve an items and as I am using it too, I will let you know when it''s available.', 'Garage 212', '123 Main St, Anytown, USA', 40.7128, -74.0060),
('44444444-4444-4444-4444-444444444445', 'Mordor', '11111111-1111-1111-1111-111111111112', false, true, true, 'Reserve an items and as I am using it too, I will let you know when it''s available.', 'Mordor', '123 Bagshot Row, Hobbiton, The Shire', -43.455046454725355, 171.30580294612173),
('55555555-5555-5555-5555-555555555556', 'Bibliothèque de Beaulieu', '33333333-3333-3333-3333-333333333334', true, true, false, 'Veuillez suivre les directives d''utilisation du hub.', 'Bibliothèque de Beaulieu', '123 Rue de la Bibliothèque, Beaulieu, France', 46.573076, 0.384676),
('66666666-6666-6666-6666-666666666667', 'Bibliothèque des 3 cités', '44444444-4444-4444-4444-444444444444', true, true, false, 'Veuillez suivre les directives d''utilisation du hub.', 'Bibliothèque des 3 cités', '123 Rue de la Bibliothèque, Saint-Benoît, France', 46.564059669449655, 0.3449034728364043),
('77777777-7777-7777-7777-777777777778', 'Bibliothèque des rocs', '55555555-5555-5555-5555-555555555555', true, true, false, 'Veuillez suivre les directives d''utilisation du hub.', 'Bibliothèque des rocs', '123 Rue de la Bibliothèque, Poitiers, France', 46.590152, 0.333012),
('88888888-8888-8888-8888-888888888889', 'Bibliothèque de Poitiers', '66666666-6666-6666-6666-666666666666', true, true, false, 'Veuillez suivre les directives d''utilisation du hub.', 'Bibliothèque de Poitiers', '123 Rue de la Bibliothèque, Poitiers, France', 46.58303704967021, 0.34204776768581924);

-- Help Categories
INSERT INTO help_categories (id, name, icon, display_order) VALUES
('11111111-1111-1111-1111-111111111116', 'General', '@tui.globe', 1),
('22222222-2222-2222-2222-222222222227', 'Account', 'user', 2),
('33333333-3333-3333-3333-333333333336', 'Billing', 'credit-card', 3),
('44444444-4444-4444-4444-444444444446', 'Technical Support', 'settings', 4),
('55555555-5555-5555-5555-555555555557', 'Privacy', 'lock', 5),
('66666666-6666-6666-6666-666666666668', 'Security', 'shield', 6),
('77777777-7777-7777-7777-777777777779', 'Feedback', 'message-circle', 7),
('88888888-8888-8888-8888-88888888888a', 'Updates', 'bell-ring', 8);

-- Help Articles (adding first few for brevity - you can add all 33 from the JSON)
INSERT INTO help_articles (id, title, content, category_id, display_order) VALUES
('11111111-1111-1111-1111-111111111117', 'How to use the app', '<p><b>This article</b> provides a comprehensive guide on how to use the app effectively.</p>', '11111111-1111-1111-1111-111111111116', 1),
('22222222-2222-2222-2222-222222222228', 'Creating an Account', 'Creating an account is the first step to accessing all the features of our service.', '22222222-2222-2222-2222-222222222227', 2);

-- Custom pages with 'bottom' position
INSERT INTO custom_pages (id, title, content, position, community_id) VALUES
('11111111-1111-1111-1111-111111111114', 'About Us', 'Welcome to our community!', 'FOOTER_LINKS', NULL),
('22222222-2222-2222-2222-222222222223', 'Terms of Service', 'Our terms and conditions...', 'FOOTER_LINKS', NULL),
('33333333-3333-3333-3333-333333333334', 'Privacy Policy', 'Your privacy matters...', 'FOOTER_LINKS', NULL),
('44444444-4444-4444-4444-444444444445', 'Contact', 'Get in touch with us...', 'FOOTER_LINKS', NULL);

-- Community Members (sample entries - add more based on the JSON data)
INSERT INTO community_members (id, community_id, user_id, role) VALUES
('11111111-1111-1111-1111-111111111119', '11111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'REQUESTING_JOIN'),
('22222222-2222-2222-2222-22222222222a', '11111111-1111-1111-1111-111111111112', '22222222-2222-2222-2222-222222222222', 'MEMBER');

-- Library Members (sample entries - add more based on the JSON data)
INSERT INTO library_members (id, library_id, user_id, role) VALUES
('11111111-1111-1111-1111-11111111111a', '11111111-1111-1111-1111-111111111113', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'ADMIN'),
('22222222-2222-2222-2222-22222222222b', '22222222-2222-2222-2222-222222222224', '11111111-1111-1111-1111-111111111111', 'MEMBER');

-- Notifications
INSERT INTO notifications (id, author, date, type, already_read, payload) VALUES
(1, 'Platform', '2024-11-19', 'ITEM_RESERVED_NO_LONGER_AVAILABLE', true, '{"itemId": "1"}'::jsonb),
(2, 'Platform', '2024-11-19', 'ITEM_BORROW_RESERVATION_DATE_START', true, '{"itemId": "18"}'::jsonb),
(3, 'Platform', '2024-11-20', 'ITEM_DUE', false, '{"itemId": "14"}'::jsonb),
(4, 'Platform', '2024-11-21', 'ITEM_AVAILABLE', false, '{"itemId": "12"}'::jsonb);

-- Items
INSERT INTO items (id, name, description, short_description, image_url, located, created_at, borrow_count, favorite, owner, library_id, category_id) VALUES
('11111111-1111-1111-1111-11111111111b', 'The Four Agreements', 'Les Otis Chips sont les derniers produits d''une série similaire de Schimmel - Renner.\nRésumé : Les Otis Chips sont les nouveaux produits de Schimmel - Renner.', 'Les Otis Chips sont les nouveaux produits de Schimmel - Renner.', '/items/1.jpg', 'ShareSpace', '2024-12-29T20:51:37.186Z', 2, true, 'TheOpenShelf', '11111111-1111-1111-1111-111111111113', NULL),
('22222222-2222-2222-2222-22222222222c', 'Licensed Metal Cheese', 'Nouvelles chaussures turquoise avec un design ergonomique pour un confort joyeux.\nRésumé : Chaussures turquoise ergonomiques pour un confort joyeux.', 'Chaussures turquoise ergonomiques pour un confort joyeux.', '/items/2.jpg', 'ShareSpace', '2024-12-29T20:51:37.203Z', 9, false, 'TheOpenShelf', '11111111-1111-1111-1111-111111111113', NULL),
('33333333-3333-3333-3333-333333333338', 'Ergonomic Metal Pants', 'Poulet élégant conçu pour vous démarquer avec un look écrasant.\n\nRésumé : Poulet élégant pour un look écrasant.', 'Poulet élégant pour un look écrasant.', '/items/3.jpg', 'ShareSpace', '2024-12-29T20:51:37.265Z', 2, false, 'TheOpenShelf', '11111111-1111-1111-1111-111111111113', NULL),
('44444444-4444-4444-4444-444444444448', 'Luxurious Granite Pants', 'Chapeau sans marque conçu avec du plastique pour une performance remarquable.\nRésumé : Chapeau sans marque en plastique pour performance optimale.', 'Chapeau sans marque en plastique pour performance optimale.', '/items/4.jpg', 'ShareSpace', '2024-12-29T20:51:37.161Z', 15, false, 'TheOpenShelf', '11111111-1111-1111-1111-111111111113', NULL),
('55555555-5555-5555-5555-555555555558', 'Handcrafted Plastic Ball', 'Ordinateur ergonomique fabriqué avec des matériaux de qualité pour un soutien lustré toute la journée.\nRésumé : Ordinateur ergonomique pour un soutien confortable toute la journée.', 'Ordinateur ergonomique pour un soutien confortable toute la journée.', '/items/5.jpg', 'ShareSpace', '2024-12-29T20:51:37.145Z', 2, true, 'TheOpenShelf', '11111111-1111-1111-1111-111111111113', NULL),
('66666666-6666-6666-6666-666666666668', 'Fantastic Soft Sausages', 'Découvrez le thon inspiré des Comores, mêlant style sans pareil et artisanat local.\nRésumé : Thon des Comores alliant style unique et savoir-faire local.', 'Thon des Comores alliant style unique et savoir-faire local.', '/items/6.jpg', 'ShareSpace', '2024-12-29T20:51:37.187Z', 12, false, 'TheOpenShelf', '11111111-1111-1111-1111-111111111113', NULL),
('77777777-7777-7777-7777-77777777777a', 'Gorgeous Bronze Sausages', 'Nouvelles chips à la menthe avec un design ergonomique pour le confort des félins.\n\nRésumé : Chips à la menthe ergonomiques pour chats.', 'Chips à la menthe ergonomiques pour chats.', '/items/7.jpg', 'ShareSpace', '2024-12-29T20:51:37.151Z', 20, true, 'TheOpenShelf', '11111111-1111-1111-1111-111111111113', NULL),
('88888888-8888-8888-8888-88888888888b', 'Ulysses', 'Thon élégant conçu pour vous démarquer avec un look magnifique.\n\nRésumé : Thon élégant pour un look magnifique.', 'Thon élégant pour un look magnifique.', '/items/8.jpg', 'ShareSpace', '2024-12-29T20:51:37.222Z', 15, false, 'TheOpenShelf', '11111111-1111-1111-1111-111111111113', NULL),
('99999999-9999-9999-9999-99999999999c', 'Gorgeous Rubber Keyboard', 'Avec la technologie améliorée au technétium, notre voiture offre des performances exceptionnelles.\n\nRésumé : Voiture performante grâce à la technologie au technétium.', 'Voiture performante grâce à la technologie au technétium.', '/items/9.jpg', 'ShareSpace', '2024-12-29T20:51:37.251Z', 16, true, 'TheOpenShelf', '11111111-1111-1111-1111-111111111113', NULL),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', 'Bespoke Cotton Chicken', 'La Belle Shirt est le dernier produit frivole de la série proposée par Gleichner-Kerluke.\n\nRésumé : La Belle Shirt est un produit frivole de Gleichner-Kerluke.', 'La Belle Shirt est un produit frivole de Gleichner-Kerluke.', '/items/10.jpg', 'ShareSpace', '2024-12-29T20:51:37.152Z', 7, false, 'TheOpenShelf', '11111111-1111-1111-1111-111111111113', NULL),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc', 'Fantastic Concrete Hat', 'La souris élégante et sardonique est dotée d''un éclairage LED lavande pour une fonctionnalité intelligente.\nRésumé : Souris élégante avec éclairage LED lavande pour une fonctionnalité intelligente.', 'Souris élégante avec éclairage LED lavande pour une fonctionnalité intelligente.', '/items/11.jpg', 'ShareSpace', '2024-12-29T20:51:37.203Z', 14, true, 'TheOpenShelf', '11111111-1111-1111-1111-111111111113', NULL),
('cccccccc-cccc-cccc-cccc-cccccccccccd', 'Cordless Vacuum Cleaner', 'Grâce à sa technologie améliorée au strontium, notre Bacon offre des performances inégalées à distance.\n\nRésumé : Le Bacon offre des performances inégalées grâce à sa technologie au strontium.', 'Le Bacon offre des performances inégalées grâce à sa technologie au strontium.', '/items/12.jpg', 'ShareSpace', '2024-12-29T20:51:37.151Z', 8, true, 'TheOpenShelf', '11111111-1111-1111-1111-111111111113', NULL),
('dddddddd-dddd-dddd-dddd-ddddddddddde', 'Refined Soft Salad', 'Notre bacon inspiré des douceurs apporte une touche de luxe à votre super style de vie.\n\nRésumé : Bacon sucré pour une touche de luxe dans votre vie.', 'Bacon sucré pour une touche de luxe dans votre vie.', '/items/13.jpg', 'ShareSpace', '2024-12-29T20:51:37.312Z', 14, true, 'TheOpenShelf', '11111111-1111-1111-1111-111111111113', NULL),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeed', 'Refined Plastic Shirt', 'Vélo innovant doté de la technologie de pointe et d''une construction en caoutchouc.\n\nRésumé : Vélo innovant avec technologie avancée et structure en caoutchouc.', 'Vélo innovant avec technologie avancée et structure en caoutchouc.', '/items/14.jpg', 'ShareSpace', '2024-12-29T20:51:37.162Z', 1, false, 'TheOpenShelf', '11111111-1111-1111-1111-111111111113', NULL),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Bespoke Plastic Table', 'Découvrez l''essence salée de notre savon, conçu pour accompagner vos aventures culinaires conscientes.\n\nRésumé : Savon aux notes salées pour aventures culinaires conscientes.', 'Savon aux notes salées pour aventures culinaires conscientes.', '/items/15.jpg', 'ShareSpace', '2024-12-29T20:51:37.189Z', 19, false, 'TheOpenShelf', '11111111-1111-1111-1111-111111111113', NULL),
('11111111-2222-3333-4444-555555555555', 'Rustic Steel Car', 'Pizza ergonomique en plastique pour un soutien assourdissant toute la journée.\n\nRésumé : Pizza en plastique ergonomique pour un soutien durable.', 'Pizza en plastique ergonomique pour un soutien durable.', '/items/16.jpg', 'ShareSpace', '2024-12-29T20:51:37.544Z', 7, true, 'TheOpenShelf', '11111111-1111-1111-1111-111111111113', NULL),
('22222222-3333-4444-5555-666666666666', 'Generic Plastic Table', 'La technologie de pointe des chemises de Lehner, Witting et Dicki améliore les capacités de l''usure.\n\nRésumé : La technologie avancée des chemises Lehner, Witting et Dicki améliore l''usure.', 'La technologie avancée des chemises Lehner, Witting et Dicki améliore l''usure.', '/items/17.jpg', 'ShareSpace', '2024-12-29T20:51:37.203Z', 18, false, 'TheOpenShelf', '11111111-1111-1111-1111-111111111113', NULL),
('33333333-4444-5555-6666-777777777777', 'Awesome Fresh Pizza', 'Souris élégante conçue pour vous démarquer avec un design fantastique.\n\nRésumé : Souris élégante pour se démarquer.', 'Souris élégante pour se démarquer.', '/items/18.jpg', 'ShareSpace', '2024-12-29T20:51:37.186Z', 5, true, 'TheOpenShelf', '11111111-1111-1111-1111-111111111113', NULL),
('44444444-5555-6666-7777-888888888888', 'Small Cotton Computer', 'Les gants Verna sont le dernier produit audacieux de la série Hauck - Kessler.\n\nRésumé : Les gants Verna sont une nouveauté audacieuse de Hauck - Kessler.', 'Les gants Verna sont une nouveauté audacieuse de Hauck - Kessler.', '/items/19.jpg', 'ShareSpace', '2024-12-29T20:51:37.187Z', 6, true, 'TheOpenShelf', '11111111-1111-1111-1111-111111111113', NULL),
('55555555-6666-7777-8888-999999999999', 'Fantastic Metal Hat', 'Découvrez l''agilité du loup de mer de notre chemise, parfaite pour tous les utilisateurs.\n\nRésumé : Chemise agile inspirée du loup de mer pour tous.', 'Chemise agile inspirée du loup de mer pour tous.', '/items/20.jpg', 'ShareSpace', '2024-12-29T20:51:37.302Z', 8, false, 'TheOpenShelf', '11111111-1111-1111-1111-111111111113', NULL),
('66666666-7777-8888-9999-aaaaaaaaaaaa', 'Modern Bronze Pizza', 'Nos pantalons adaptés aux grenouilles garantissent le confort optimal pour vos animaux de compagnie.\nRésumé : Pantalons confortables pour animaux de compagnie.', 'Pantalons confortables pour animaux de compagnie.', '/items/21.jpg', 'ShareSpace', '2024-12-29T20:51:37.305Z', 13, false, 'TheOpenShelf', '11111111-1111-1111-1111-111111111113', NULL),
('77777777-8888-9999-aaaa-bbbbbbbbbbbb', 'Fantastic Granite Chips', 'Nouveau savon indigo avec un design ergonomique pour un confort optimal.\n\nRésumé : Savon indigo ergonomique pour un confort optimal.', 'Savon indigo ergonomique pour un confort optimal.', '/items/22.jpg', 'ShareSpace', '2024-12-29T20:51:37.260Z', 3, false, 'TheOpenShelf', '11111111-1111-1111-1111-111111111113', NULL),
('88888888-9999-aaaa-bbbb-cccccccccccc', 'Unbranded Cotton Gloves', 'Découvrez l''essence juteuse de notre chapeau, conçu pour de véritables aventures culinaires.\n\nRésumé : Chapeau pour aventures culinaires.', 'Chapeau pour aventures culinaires.', '/items/23.jpg', 'ShareSpace', '2024-12-29T20:51:37.173Z', 11, false, 'TheOpenShelf', '11111111-1111-1111-1111-111111111113', NULL),
('99999999-aaaa-bbbb-cccc-dddddddddddd', 'Handcrafted Metal Gloves', 'La technologie de pointe de Bacon d''Hirthe, Hilpert et Kreiger améliore les capacités émotionnelles.\n\nRésumé : La technologie de pointe de Bacon améliore les capacités émotionnelles.', 'La technologie de pointe de Bacon améliore les capacités émotionnelles.', '/items/24.jpg', 'ShareSpace', '2024-12-29T20:51:37.308Z', 16, true, 'TheOpenShelf', '11111111-1111-1111-1111-111111111113', NULL),
('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', 'Practical Concrete Towels', 'Notre vélo inspiré par la fraîcheur apporte une touche de luxe à votre style de vie qualifié.\nRésumé : Vélo de luxe pour un style de vie qualifié.', 'Vélo de luxe pour un style de vie qualifié.', '/items/25.jpg', 'ShareSpace', '2024-12-29T20:51:37.189Z', 0, true, 'TheOpenShelf', '11111111-1111-1111-1111-111111111113', NULL),
('bbbbbbbb-cccc-dddd-eeee-ffffffffffff', 'Bikini', 'Nouveau modèle Bacon avec 88 Go de RAM, 775 Go de stockage et fonctionnalités animées.\n\nRésumé : Nouveau modèle Bacon avec 88 Go de RAM et 775 Go de stockage, incluant des fonctionnalités animées.', 'Nouveau modèle Bacon avec 88 Go de RAM et 775 Go de stockage, incluant des fonctionnalités animées.', '/items/26.jpg', 'ShareSpace', '2024-12-29T20:51:37.186Z', 1, false, 'TheOpenShelf', '11111111-1111-1111-1111-111111111113', NULL),
('cccccccc-dddd-eeee-ffff-111111111111', 'Handmade Steel Chicken', 'Notre souris adaptée aux girafes assure le confort physique de vos animaux.\n\nRésumé : Souris adaptée aux girafes pour le confort des animaux.', 'Souris adaptée aux girafes pour le confort des animaux.', '/items/27.jpg', 'ShareSpace', '2024-12-29T20:51:37.214Z', 7, false, 'TheOpenShelf', '11111111-1111-1111-1111-111111111113', NULL),
('dddddddd-eeee-ffff-1111-222222222222', 'Recycled Plastic Soap', 'Découvrez l''agilité semblable à celle des abeilles de notre souris, parfaite pour les utilisateurs ordinaires.\n\nRésumé : Souris agile pour utilisateurs normaux.', 'Souris agile pour utilisateurs normaux.', '/items/28.jpg', 'ShareSpace', '2024-12-29T20:51:37.447Z', 19, false, 'TheOpenShelf', '11111111-1111-1111-1111-111111111113', NULL),
('eeeeeeee-ffff-1111-2222-333333333333', 'Intelligent Bronze Keyboard', 'La pizza Marguerite est le dernier produit sérieux de la série de Howe - Hermann.\nRésumé : Pizza Marguerite, nouveau produit de Howe - Hermann.', 'Pizza Marguerite, nouveau produit de Howe - Hermann.', '/items/29.jpg', 'ShareSpace', '2024-12-29T20:51:37.631Z', 6, true, 'TheOpenShelf', '11111111-1111-1111-1111-111111111113', NULL),
('ffffffff-1111-2222-3333-444444444444', 'Elegant Wooden Keyboard', 'Savon innovant avec une technologie élégante et une construction en acier.\n\nRésumé : Savon innovant avec technologie élégante en acier.', 'Savon innovant avec technologie élégante en acier.', '/items/30.jpg', 'ShareSpace', '2024-12-29T20:51:37.274Z', 1, true, 'TheOpenShelf', '11111111-1111-1111-1111-111111111113', NULL);

-- Borrow Records
INSERT INTO borrow_records (id, item_id, borrowed_by, reservation_date, start_date, end_date, pickup_date, effective_return_date, status) VALUES
-- Item 1 borrow records
('11111111-1111-1111-1111-11111111111c', '11111111-1111-1111-1111-11111111111b', '88888888-8888-8888-8888-888888888888', '2025-01-22', '2025-08-21', '2025-08-28', '2025-08-21', NULL, 'RESERVED_CONFIRMED'),
('22222222-2222-2222-2222-22222222222d', '11111111-1111-1111-1111-11111111111b', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '2024-01-05', '2024-01-29', '2024-02-04', '2024-01-29', '2024-02-04', 'RETURNED_ON_TIME'),
('33333333-3333-3333-3333-333333333339', '11111111-1111-1111-1111-11111111111b', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '2024-10-03', '2024-10-27', '2024-11-02', '2024-10-27', '2024-11-03', 'RETURNED_LATE'),
('44444444-4444-4444-4444-444444444449', '11111111-1111-1111-1111-11111111111b', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '2024-11-24', '2024-11-28', '2024-12-01', '2024-11-28', '2024-11-30', 'RETURNED_EARLY'),
('55555555-5555-5555-5555-555555555559', '11111111-1111-1111-1111-11111111111b', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '2025-01-16', '2025-05-02', '2025-05-07', '2025-05-02', NULL, 'RESERVED_CONFIRMED'),
('66666666-6666-6666-6666-666666666669', '11111111-1111-1111-1111-11111111111b', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '2024-10-23', '2024-10-31', '2024-11-02', '2024-10-29', '2024-11-01', 'RETURNED_EARLY'),

-- Item 2 borrow records
('77777777-7777-7777-7777-77777777777b', '22222222-2222-2222-2222-22222222222c', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '2024-07-12', '2024-08-09', '2024-08-14', '2024-08-09', '2024-08-14', 'RETURNED_ON_TIME'),
('88888888-8888-8888-8888-88888888888c', '22222222-2222-2222-2222-22222222222c', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '2024-12-25', '2025-01-08', '2025-01-13', '2025-01-08', NULL, 'RESERVED_CONFIRMED'),
('99999999-9999-9999-9999-99999999999d', '22222222-2222-2222-2222-22222222222c', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '2024-11-14', '2024-11-28', '2024-12-03', '2024-11-28', '2024-12-03', 'RETURNED_ON_TIME'),

-- Item 3 borrow records
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaac', '33333333-3333-3333-3333-333333333338', 'ffffffff-ffff-ffff-ffff-ffffffffffff', '2024-08-15', '2024-09-12', '2024-09-17', '2024-09-12', '2024-09-17', 'RETURNED_ON_TIME'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbd', '33333333-3333-3333-3333-333333333338', 'ffffffff-ffff-ffff-ffff-ffffffffffff', '2024-12-26', '2025-01-23', '2025-01-28', '2025-01-23', NULL, 'RESERVED_CONFIRMED'),

-- Item 4 borrow records
('cccccccc-cccc-cccc-cccc-ccccccccccce', '44444444-4444-4444-4444-444444444448', '11111111-1111-1111-1111-111111111111', '2024-09-18', '2024-10-16', '2024-10-21', '2024-10-16', '2024-10-21', 'RETURNED_ON_TIME'),
('dddddddd-dddd-dddd-dddd-dddddddddddf', '44444444-4444-4444-4444-444444444448', '11111111-1111-1111-1111-111111111111', '2025-01-02', '2025-01-30', '2025-02-04', '2025-01-30', NULL, 'RESERVED_CONFIRMED'),

-- Item 5 borrow records
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1', '55555555-5555-5555-5555-555555555558', '22222222-2222-2222-2222-222222222222', '2024-10-22', '2024-11-19', '2024-11-24', '2024-11-19', '2024-11-24', 'RETURNED_ON_TIME'),
('ffffffff-ffff-ffff-ffff-ffffffffff01', '55555555-5555-5555-5555-555555555558', '22222222-2222-2222-2222-222222222222', '2025-01-09', '2025-02-06', '2025-02-11', '2025-02-06', NULL, 'RESERVED_CONFIRMED'),

-- Item 6 borrow records
('11111111-1111-1111-1111-111111111112', '66666666-6666-6666-6666-666666666668', '33333333-3333-3333-3333-333333333333', '2024-11-25', '2024-12-23', '2024-12-28', '2024-12-23', '2024-12-28', 'RETURNED_ON_TIME'),
('22222222-2222-2222-2222-222222222223', '66666666-6666-6666-6666-666666666668', '33333333-3333-3333-3333-333333333333', '2025-01-16', '2025-02-13', '2025-02-18', '2025-02-13', NULL, 'RESERVED_CONFIRMED'),

-- Item 7 borrow records
('33333333-3333-3333-3333-333333333334', '77777777-7777-7777-7777-77777777777a', '44444444-4444-4444-4444-444444444444', '2024-12-29', '2025-01-26', '2025-01-31', '2025-01-26', NULL, 'RESERVED_CONFIRMED'),
('44444444-4444-4444-4444-444444444445', '77777777-7777-7777-7777-77777777777a', '44444444-4444-4444-4444-444444444444', '2024-07-04', '2024-08-01', '2024-08-06', '2024-08-01', '2024-08-06', 'RETURNED_ON_TIME'),

-- Item 8 borrow records
('55555555-5555-5555-5555-555555555556', '88888888-8888-8888-8888-88888888888b', '55555555-5555-5555-5555-555555555555', '2024-08-07', '2024-09-04', '2024-09-09', '2024-09-04', '2024-09-09', 'RETURNED_ON_TIME'),
('66666666-6666-6666-6666-666666666667', '88888888-8888-8888-8888-88888888888b', '55555555-5555-5555-5555-555555555555', '2025-01-05', '2025-02-02', '2025-02-07', '2025-02-02', NULL, 'RESERVED_CONFIRMED'),

-- Item 9 borrow records
('77777777-7777-7777-7777-777777777778', '99999999-9999-9999-9999-99999999999c', '66666666-6666-6666-6666-666666666666', '2024-09-10', '2024-10-08', '2024-10-13', '2024-10-08', '2024-10-13', 'RETURNED_ON_TIME'),
('88888888-8888-8888-8888-888888888889', '99999999-9999-9999-9999-99999999999c', '66666666-6666-6666-6666-666666666666', '2025-01-12', '2025-02-09', '2025-02-14', '2025-02-09', NULL, 'RESERVED_CONFIRMED'),

-- Item 10 borrow records
('99999999-9999-9999-9999-99999999999a', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', '77777777-7777-7777-7777-777777777777', '2024-10-14', '2024-11-11', '2024-11-16', '2024-11-11', '2024-11-16', 'RETURNED_ON_TIME'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', '77777777-7777-7777-7777-777777777777', '2025-01-19', '2025-02-16', '2025-02-21', '2025-02-16', NULL, 'RESERVED_CONFIRMED'),

-- Records for remaining items
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb02', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc', '88888888-8888-8888-8888-888888888888', '2024-11-17', '2024-12-15', '2024-12-20', '2024-12-15', '2024-12-20', 'RETURNED_ON_TIME'),
('cccccccc-cccc-cccc-cccc-cccccccccc03', 'cccccccc-cccc-cccc-cccc-cccccccccccd', '99999999-9999-9999-9999-999999999999', '2024-12-21', '2025-01-18', '2025-01-23', '2025-01-18', NULL, 'RESERVED_CONFIRMED'),
('dddddddd-dddd-dddd-dddd-dddddddddd04', 'dddddddd-dddd-dddd-dddd-ddddddddddde', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2024-07-25', '2024-08-22', '2024-08-27', '2024-08-22', '2024-08-27', 'RETURNED_ON_TIME'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee05', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeed', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '2024-08-28', '2024-09-25', '2024-09-30', '2024-09-25', '2024-09-30', 'RETURNED_ON_TIME'),
('ffffffff-ffff-ffff-ffff-ffffffffff06', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '2024-10-01', '2024-10-29', '2024-11-03', '2024-10-29', '2024-11-03', 'RETURNED_ON_TIME'),
('11111111-1111-1111-1111-111111111107', '11111111-2222-3333-4444-555555555555', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '2024-11-04', '2024-12-02', '2024-12-07', '2024-12-02', '2024-12-07', 'RETURNED_ON_TIME'),
('22222222-2222-2222-2222-222222222208', '22222222-3333-4444-5555-666666666666', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '2024-12-08', '2025-01-05', '2025-01-10', '2025-01-05', NULL, 'RESERVED_CONFIRMED'),
('33333333-3333-3333-3333-333333333309', '33333333-4444-5555-6666-777777777777', 'ffffffff-ffff-ffff-ffff-ffffffffffff', '2024-07-15', '2024-08-12', '2024-08-17', '2024-08-12', '2024-08-17', 'RETURNED_ON_TIME'),
('44444444-4444-4444-4444-444444444410', '44444444-5555-6666-7777-888888888888', '11111111-1111-1111-1111-111111111111', '2024-08-18', '2024-09-15', '2024-09-20', '2024-09-15', '2024-09-20', 'RETURNED_ON_TIME'),
('55555555-5555-5555-5555-555555555511', '55555555-6666-7777-8888-999999999999', '22222222-2222-2222-2222-222222222222', '2024-09-21', '2024-10-19', '2024-10-24', '2024-10-19', '2024-10-24', 'RETURNED_ON_TIME'),
('66666666-6666-6666-6666-666666666612', '66666666-7777-8888-9999-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', '2024-10-25', '2024-11-22', '2024-11-27', '2024-11-22', '2024-11-27', 'RETURNED_ON_TIME'),
('77777777-8888-9999-aaaa-000000000001', '77777777-8888-9999-aaaa-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', '2025-01-12', '2025-11-14', '2025-11-20', '2025-11-14', NULL, 'RESERVED_CONFIRMED'),
('77777777-8888-9999-aaaa-000000000002', '77777777-8888-9999-aaaa-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', '2025-01-21', '2025-05-25', '2025-05-30', '2025-05-25', NULL, 'RESERVED_CONFIRMED'),
('77777777-8888-9999-aaaa-000000000003', '77777777-8888-9999-aaaa-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', '2025-01-18', '2025-02-17', '2025-02-24', '2025-02-15', NULL, 'RESERVED_CONFIRMED'),
('88888888-9999-aaaa-0000-000000000001', '88888888-9999-aaaa-bbbb-cccccccccccc', '13131313-1313-1313-1313-131313131313', '2024-08-17', '2024-09-16', '2024-09-21', '2024-09-16', '2024-09-20', 'RETURNED_EARLY'),
('88888888-9999-aaaa-0000-000000000002', '88888888-9999-aaaa-bbbb-cccccccccccc', '55555555-5555-5555-5555-555555555555', '2024-11-08', '2024-11-11', '2024-11-14', '2024-11-11', '2024-11-14', 'RETURNED_ON_TIME'),
('99999999-aaaa-bbbb-0000-000000000001', '99999999-aaaa-bbbb-cccc-dddddddddddd', '11111111-1111-1111-1111-111111111111', '2024-10-08', '2024-11-03', '2024-11-04', '2024-11-03', '2024-11-05', 'RETURNED_LATE'),
('aaaaaaaa-bbbb-cccc-0000-000000000001', 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222', '2024-01-06', '2024-01-24', '2024-01-31', '2024-01-25', '2024-01-31', 'RETURNED_ON_TIME'),
('aaaaaaaa-bbbb-cccc-0000-000000000002', 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222', '2025-01-14', '2025-06-10', '2025-06-16', '2025-06-09', NULL, 'RESERVED_CONFIRMED'),
('bbbbbbbb-cccc-dddd-0000-000000000001', 'bbbbbbbb-cccc-dddd-eeee-ffffffffffff', '11111111-1111-1111-1111-111111111111', '2024-04-17', '2024-04-23', '2024-04-28', '2024-04-22', '2024-04-29', 'RETURNED_LATE'),
('bbbbbbbb-cccc-dddd-0000-000000000002', 'bbbbbbbb-cccc-dddd-eeee-ffffffffffff', '11111111-1111-1111-1111-111111111111', '2025-01-14', '2025-11-23', '2025-11-25', '2025-11-23', NULL, 'RESERVED_CONFIRMED'),
('cccccccc-dddd-eeee-0000-000000000001', 'cccccccc-dddd-eeee-ffff-111111111111', '11111111-1111-1111-1111-111111111111', '2025-01-15', '2025-11-15', '2025-11-19', '2025-11-15', NULL, 'RESERVED_CONFIRMED'),
('cccccccc-dddd-eeee-0000-000000000002', 'cccccccc-dddd-eeee-ffff-111111111111', '11111111-1111-1111-1111-111111111111', '2025-01-17', '2025-08-21', '2025-08-26', '2025-08-21', NULL, 'RESERVED_CONFIRMED'),
('dddddddd-eeee-ffff-0000-000000000001', 'dddddddd-eeee-ffff-1111-222222222222', '11111111-1111-1111-1111-111111111111', '2024-04-13', '2024-05-02', '2024-05-05', '2024-05-02', '2024-05-04', 'RETURNED_EARLY'),
('dddddddd-eeee-ffff-0000-000000000002', 'dddddddd-eeee-ffff-1111-222222222222', '11111111-1111-1111-1111-111111111111', '2025-01-21', '2025-04-27', '2025-04-28', '2025-04-26', NULL, 'RESERVED_CONFIRMED'),
('eeeeeeee-ffff-1111-0000-000000000001', 'eeeeeeee-ffff-1111-2222-333333333333', '22222222-2222-2222-2222-222222222222', '2025-01-21', '2025-02-17', '2025-02-20', '2025-02-17', NULL, 'RESERVED_CONFIRMED'),
('eeeeeeee-ffff-1111-0000-000000000002', 'eeeeeeee-ffff-1111-2222-333333333333', '22222222-2222-2222-2222-222222222222', '2025-01-09', '2025-06-12', '2025-06-17', '2025-06-12', NULL, 'RESERVED_CONFIRMED'),
('ffffffff-1111-2222-0000-000000000001', 'ffffffff-1111-2222-3333-444444444444', '22222222-2222-2222-2222-222222222222', '2023-12-25', '2024-01-09', '2024-01-11', '2024-01-09', '2024-01-11', 'RETURNED_ON_TIME'),
('ffffffff-1111-2222-0000-000000000002', 'ffffffff-1111-2222-3333-444444444444', '55555555-5555-5555-5555-555555555555', '2024-12-25', '2025-01-06', '2025-01-13', '2025-01-07', '2025-01-14', 'RETURNED_LATE'); 


-- Categories
INSERT INTO categories (id, name, icon, color, template) VALUES
('11111111-1111-1111-1111-111111111115', 'Books', '@tui.book', '#4CAF50', NULL),
('22222222-2222-2222-2222-222222222225', 'Tools', '@tui.drill', '#FF9800', NULL),
('33333333-3333-3333-3333-333333333335', 'Electronics', '@tui.smartphone', '#2196F3', NULL),
('44444444-4444-4444-4444-444444444445', 'Sports', '@tui.activity', '#E91E63', NULL),
('55555555-5555-5555-5555-555555555555', 'Kitchen', '@tui.coffee', '#795548', NULL),
('66666666-6666-6666-6666-666666666665', 'Games', '@tui.gamepad-2', '#9C27B0', NULL),
('77777777-7777-7777-7777-777777777775', 'Garden', '@tui.flower', '#8BC34A', NULL),
('88888888-8888-8888-8888-888888888885', 'Music', '@tui.music', '#3F51B5', NULL),
('99999999-9999-9999-9999-999999999995', 'Art', '@tui.palette', '#FF5722', NULL);

-- Update items with categories
UPDATE items SET category_id = '11111111-1111-1111-1111-111111111115' WHERE name IN ('The Four Agreements', 'Ulysses');
UPDATE items SET category_id = '22222222-2222-2222-2222-222222222225' WHERE name LIKE '%Tool%' OR name LIKE '%Metal%' OR name LIKE '%Steel%';
UPDATE items SET category_id = '33333333-3333-3333-3333-333333333335' WHERE name LIKE '%Computer%' OR name LIKE '%Keyboard%' OR name LIKE '%Electronic%' OR name LIKE '%Vacuum%';
UPDATE items SET category_id = '44444444-4444-4444-4444-444444444445' WHERE name LIKE '%Ball%' OR name LIKE '%Sport%';
UPDATE items SET category_id = '55555555-5555-5555-5555-555555555555' WHERE name LIKE '%Kitchen%' OR name LIKE '%Food%' OR name LIKE '%Cook%' OR name LIKE '%Salad%' OR name LIKE '%Sausages%' OR name LIKE '%Pizza%';
UPDATE items SET category_id = '66666666-6666-6666-6666-666666666665' WHERE name LIKE '%Game%' OR name LIKE '%Play%';
UPDATE items SET category_id = '77777777-7777-7777-7777-777777777775' WHERE name LIKE '%Garden%' OR name LIKE '%Plant%' OR name LIKE '%Outdoor%';
UPDATE items SET category_id = '88888888-8888-8888-8888-888888888885' WHERE name LIKE '%Music%' OR name LIKE '%Audio%' OR name LIKE '%Sound%';
UPDATE items SET category_id = '99999999-9999-9999-9999-999999999995' WHERE name LIKE '%Art%' OR name LIKE '%Paint%' OR name LIKE '%Draw%';

-- Catch remaining uncategorized items with sensible defaults
UPDATE items SET category_id = '55555555-5555-5555-5555-555555555555' WHERE name LIKE '%Cheese%' OR name LIKE '%Bacon%';
UPDATE items SET category_id = '22222222-2222-2222-2222-222222222225' WHERE name LIKE '%Concrete%' OR name LIKE '%Plastic%' OR name LIKE '%Granite%';
UPDATE items SET category_id = '33333333-3333-3333-3333-333333333335' WHERE name LIKE '%Mouse%';
UPDATE items SET category_id = '55555555-5555-5555-5555-555555555555' WHERE name LIKE '%Chicken%';
UPDATE items SET category_id = '99999999-9999-9999-9999-999999999995' WHERE name LIKE '%Bikini%';

-- Set default category for any remaining items
UPDATE items SET category_id = '22222222-2222-2222-2222-222222222225' WHERE category_id IS NULL;