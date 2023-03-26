use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use sqlx::{self, FromRow};

#[derive(Deserialize)]
pub struct AddCardsInsideDeck {
    pub deck_id: i32,
    pub front: String,
    pub back: String
}

#[derive(Serialize, FromRow)]
pub struct Card {
    pub card_id: i32,
    pub deck_id: i32,
    pub front: String,
    pub back: String,
    pub published_on: Option<NaiveDateTime>
}

