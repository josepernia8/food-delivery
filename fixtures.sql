/* BEGIN RESTAURANTS */

/* RESTAURANT 1 */

INSERT INTO restaurant (logo, commercialname, legalname, commercialemail, adminnumber, address, lat, lng)
  VALUES (
  'https://getbento.imgix.net/accounts/5bdf243f7488e73a91f6e23651f1977c/media/accounts/media/aydHul4Ta0mKlAUUSQwg_decoybar-logo.png',
  'Decoy Bar',
  'Red Farm',
  'events@redfarmnyc.com',
  '+1 212-691-9700',
  '529 1/2 Hudson St, New York City, NY 10014-2601',
  40.7341939,
  -74.0086827
);

/* RESTAURANT 2 */

INSERT INTO restaurant (logo, commercialname, legalname, commercialemail, adminnumber, address, lat, lng)
  VALUES (
  'https://static.beyondmenu.com/UploadFiles/41997/Logo/41997.jpg',
  'AA Japanese Noodle',
  'AA Japanese Noodle',
  'aanoodles@gmail.com',
  '+1 212-233-8700',
  '45 Bayard St, New York City, NY 10013-4929',
  40.7150701,
  -73.999539
);

/* RESTAURANT 3 */

INSERT INTO restaurant (logo, commercialname, legalname, commercialemail, adminnumber, address, lat, lng)
  VALUES (
  'https://static.tacdn.com/img2/branding/rebrand/TA_logo_secondary.svg',
  'Aanchal Indian Restaurant',
  'Aanchal Indian Restaurant',
  'anchalrestaurant@gmail.com',
  '+1 718-349-9060',
  '4512 23rd St, Long Island City, NY 11101-4348',
  40.7465803,
  -73.9478721
);

/* END RESTAURANTS */


/* BEGIN REVIEWS */

/* REVIEWS FOR RESTAURANT 1*/

INSERT INTO review (name, review, rating, restaurantid)
  VALUES (
  'QuebecGe',
  'If you’re a little worried about typical restaurants in Chinatown, go for Decoy, you will have an amazing experience and the service is excellent ! Great Taste , great spot!',
  5,
  1
);

INSERT INTO review (name, review, rating, restaurantid)
  VALUES (
  'Georgina S',
  'We had the most wonderful evening at Decoy on Sunday. Everything was absolutely delicious! As part of the prix fixe menu, in addition to the Peking duck, as a party of four you also select 4 starters and two main courses.',
  5,
  1
);

/* REVIEWS FOR RESTAURANT 2*/

INSERT INTO review (name, review, rating, restaurantid)
  VALUES (
  'Marciahi',
  'In addition to being able to watch the noodles being made, the food was fresh and tasty. They offer skewers of beef and lamb and other accompaniments to the noodles. All in all, a very reasonably priced lunch.',
  4,
  2
);

INSERT INTO review (name, review, rating, restaurantid)
  VALUES (
  'KKua',
  'This establishment is a reincarnation of HK Station. Now, they have a noodlemaker in the storefront hand pulling the noodles. This is their only redeemable quality. At 7:30pm on a Thursday night, this place is desolate. More than half of the menu is no longer available.',
  1,
  2
);

/* END REVIEWS */




/* BEGIN MEALS */

/* MEALS FOR RESTAURANT 1*/

INSERT INTO meal (name, description, price, restaurantid)
  VALUES (
  'Hot Noodles',
  'Common Noodles',
  25,
  1
);

INSERT INTO meal (name, description, price, restaurantid)
  VALUES (
  'Hot Noodles with vegetables',
  'Common Noodles with extra vegetables',
  29.95,
  1
);

/* MEALS FOR RESTAURANT 2*/

INSERT INTO meal (name, description, price, restaurantid)
  VALUES (
  'PEKING DUCK',
  'Ducks Are Served With Consomme Shots, 10 Pancakes, & 3 Sauces',
  85,
  1
);

INSERT INTO meal (name, description, price, restaurantid)
  VALUES (
  'MARINATED & GRILLED CREEKSTONE RIB STEAK',
  'Marinated and grilled rib steak made of creekstone',
  49.95,
  1
);

/* END MEALS */




/* USERS */

INSERT INTO users (username, name, password, address, lat, lng)
  VALUES (
  'jdoe',
  'John Doe',
  '123456',
  '529 1/2 Hudson St, New York City, NY 10014-2602',
  40.7311722,
  -74.0090754
);