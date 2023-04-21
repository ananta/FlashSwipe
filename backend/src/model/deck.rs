use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use sqlx::{self, FromRow};
use sqlx::types::Uuid;



#[derive(Deserialize)]
pub struct CreateDeckBody {
    pub deck_id: Option<Uuid>,
    pub title: String,
    pub description: String,
}

#[derive(Deserialize)]
pub struct CreateDeckBodyWithId {
    pub deck_id: Uuid,
    pub title: String,
    pub description: String,
}


#[derive(Deserialize)]
pub struct UpdateDeckBody {
    pub title: Option<String>,
    pub description: Option<String>,
}

#[derive(Deserialize, Serialize)]
pub struct DeckIdentifier {
    pub deck_id: String
}

#[derive(Deserialize, Serialize)]
pub struct DeckAndCardIdentifier {
    pub deck_id: String,
    pub card_id: String
}

#[derive(Debug, Serialize, FromRow)]
pub struct Deck {
    pub deck_id: Uuid,
    pub title: String,
    pub description: String,
    pub published_by: i32,
    pub published_on: Option<NaiveDateTime>
}

