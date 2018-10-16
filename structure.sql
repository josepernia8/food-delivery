CREATE DATABASE delivery;

\c delivery;

CREATE TABLE restaurant (
  id SERIAL PRIMARY KEY,
  logo TEXT,
  commercialname TEXT,
  legalname TEXT,
  commercialemail TEXT,
  adminnumber TEXT,
  address TEXT,
  lat NUMERIC,
  lng NUMERIC
);

CREATE TABLE review (
  id SERIAL PRIMARY KEY,
  name TEXT,
  review TEXT,
  rating FLOAT,
  constraint rating_range_check check(rating >= 1 and rating <= 5),
  restaurantid INTEGER REFERENCES restaurant(id)
);

create function rating(restaurant) returns numeric as $$
	select ROUND(AVG(rating)::numeric,1) from review where restaurantid=$1.id;
$$ language sql;

CREATE TABLE meal (
  id SERIAL PRIMARY KEY,
  name TEXT,
  description TEXT,
  price FLOAT,
  restaurantid INTEGER REFERENCES restaurant(id)
);

CREATE TABLE rest_order (
  id SERIAL PRIMARY KEY,
  orderedby TEXT,
  address TEXT,
  lat NUMERIC,
  lng NUMERIC,
  restaurantid INTEGER REFERENCES restaurant(id)
);

CREATE TABLE ordered_meal (
  id SERIAL PRIMARY KEY,
  quantity INTEGER,
  mealid INTEGER REFERENCES meal(id),
  orderid INTEGER REFERENCES rest_order(id)
);

create function total_cost(rest_order) returns float as $$
	select SUM(price) from meal where id IN (select id from ordered_meal where orderid = $1.id);
$$ language sql;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT,
  name TEXT,
  password TEXT,
  address TEXT,
  lat NUMERIC,
  lng NUMERIC
);