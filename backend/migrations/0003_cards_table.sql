CREATE TABLE cards (
  card_id UUID PRIMARY KEY,
  deck_id UUID NOT NULL,
  front VARCHAR(255),
  back VARCHAR(255),
  published_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cards_decks FOREIGN KEY (deck_id) REFERENCES decks (deck_id) ON DELETE CASCADE
);
