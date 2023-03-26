use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use sqlx::{self, FromRow};

#[derive(Deserialize)]
pub struct CreateDeckBody {
    pub title: String,
    pub description: String
}

#[derive(Deserialize, Serialize)]
pub struct DeckIdentifier {
    pub deck_id: String
}

#[derive(Serialize, FromRow)]
pub struct Deck {
    pub deck_id: i32,
    pub title: String,
    pub description: String,
    pub published_by: i32,
    pub published_on: Option<NaiveDateTime>
}
