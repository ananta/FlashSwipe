CREATE TABLE cards (
  card_id SERIAL PRIMARY KEY,
  deck_id INT,
  front VARCHAR(255),
  back VARCHAR(255),
  published_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cards_decks FOREIGN KEY (deck_id) REFERENCES decks (deck_id)
);
