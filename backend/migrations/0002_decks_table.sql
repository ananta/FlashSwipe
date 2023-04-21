CREATE TABLE decks (
  deck_id UUID PRIMARY KEY NOT NULL,
  title VARCHAR(255),
  description VARCHAR(255),
  published_by INT,
  published_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_decks_users FOREIGN KEY (published_by) REFERENCES users (user_id)
);
