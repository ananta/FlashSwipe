use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use sqlx::{self, FromRow};

#[derive(Deserialize)]
pub struct CreateUserBody {
    pub first_name: String,
    pub last_name: String,
    pub username: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct LoginUserBody {
    pub username: String,
    pub password: String,
}

#[derive(Serialize, FromRow)]
pub struct UserInfo {
    pub id: i32,
    pub first_name: String,
    pub last_name: String,
    pub username: String,
    pub token: String
}

// the return object
#[derive(Serialize, FromRow)]
pub struct UserNoPassword {
    pub id: i32,
    pub first_name: String,
    pub last_name: String,
    pub username: String
}

#[derive(Serialize, FromRow)]
pub struct AuthUser {
    pub id: i32,
    pub username: String,
    pub password: String,
    pub first_name: String,
    pub last_name: String
}

#[derive(Deserialize)]
pub struct CreateDeckBody {
    pub title: String,
    pub description: String
}

#[derive(Serialize, FromRow)]
pub struct Deck {
    pub id: i32,
    pub title: String,
    pub description: String,
    pub published_by: i32,
    pub published_on: Option<NaiveDateTime>
}

