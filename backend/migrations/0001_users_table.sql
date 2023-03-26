CREATE TABLE users (
  user_id SERIAL PRIMARY KEY NOT NULL UNIQUE,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  username VARCHAR(255) UNIQUE,
  password VARCHAR(255)
);
