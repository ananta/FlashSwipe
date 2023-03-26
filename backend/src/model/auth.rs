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
    pub user_id: i32,
    pub first_name: String,
    pub last_name: String,
    pub username: String,
    pub token: String
}

// the return object
#[derive(Serialize, FromRow)]
pub struct UserNoPassword {
    pub user_id: i32,
    pub first_name: String,
    pub last_name: String,
    pub username: String
}

#[derive(Serialize, FromRow)]
pub struct AuthUser {
    pub user_id: i32,
    pub username: String,
    pub password: String,
    pub first_name: String,
    pub last_name: String
}
