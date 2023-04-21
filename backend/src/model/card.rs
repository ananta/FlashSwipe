use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use sqlx::{self, FromRow};
use sqlx::types::Uuid;

#[derive(Deserialize)]
pub struct AddCardsInsideDeck {
    pub card_id: Option<Uuid>,
    pub front: String,
    pub back: String
}

#[derive(Serialize, FromRow)]
pub struct Card {
    pub card_id: Uuid,
    pub deck_id: Uuid,
    pub front: String,
    pub back: String,
    pub published_on: Option<NaiveDateTime>
}

