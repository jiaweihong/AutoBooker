CREATE TABLE autobooker_local_db;

CREATE TABLE to_book(
    to_book_id SERIAL PRIMARY KEY,
    sports_centre VARCHAR(255) NOT NULL,
    activity VARCHAR(255) NOT NULL,
    activity_date VARCHAR(255) NOT NULL,
    activity_time VARCHAR(255) NOT NULL
);