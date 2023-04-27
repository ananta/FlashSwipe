CREATE TABLE commits (
  commit_id SERIAL PRIMARY KEY NOT NULL UNIQUE,
  published_by INT,
  published_on DATE DEFAULT CURRENT_DATE,
  CONSTRAINT fk_decks_users FOREIGN KEY (published_by) REFERENCES users (user_id)
);
