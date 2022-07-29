CREATE TABLE autobooker_local_db;

CREATE TABLE to_book(
    to_book_id SERIAL PRIMARY KEY,
    sports_centre VARCHAR(255) NOT NULL,
    activity VARCHAR(255) NOT NULL,
    activity_day int NOT NULL,
    activity_month INT NOT NULL,
    activity_year INT NOT NULL,
    activity_hour INT NOT NULL,
);
