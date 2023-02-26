use crate::{AppState, TokenClaims};
use actix_web::{
    get,
    post,
    web::{Data, Json, ReqData},
    HttpResponse, Responder
};
use actix_web_httpauth::{extractors::basic::BasicAuth, headers::authorization::Basic};
use argonautica::{Hasher, Verifier};
use chrono::NaiveDateTime;
use hmac::{Hmac, Mac};
use jwt::SignWithKey;
use serde::{Deserialize, Serialize};
use sha2::Sha256;
use sqlx::{self, FromRow};


#[derive(Deserialize)]
struct CreateUserBody {
    username: String,
    password: String,
}

#[derive(Deserialize)]
struct LoginUserBody {
    username: String,
    password: String,
}

#[derive(Serialize, FromRow)]
struct UserInfo {
    id: i32,
    username: String,
    token: String
}

// the return object
#[derive(Serialize, FromRow)]
struct UserNoPassword {
    id: i32,
    username: String
}

#[derive(Serialize, FromRow)]
struct AuthUser {
    id: i32,
    username: String,
    password: String
}

#[derive(Deserialize)]
struct CreateDeckBody {
    title: String,
    description: String
}

#[derive(Serialize, FromRow)]
struct Deck {
    id: i32,
    title: String,
    description: String,
    published_by: i32,
    published_on: Option<NaiveDateTime>
}


#[post("/register")]
async fn register(state: Data<AppState>, body: Json<CreateUserBody>) -> impl Responder {
    let user: CreateUserBody = body.into_inner();
    let hash_secret = std::env::var("HASH_SECRET").expect("HASH_SECRET must be set!");
    let mut hasher = Hasher::default();
    let hash = hasher
        .with_password(user.password)
        .with_secret_key(hash_secret)
        .hash()
        .unwrap();

    match sqlx::query_as::<_, UserNoPassword>(
        "INSERT INTO users (username, password)
VALUES ($1, $2)
RETURNING id, username"
    )
        .bind(user.username)
        .bind(hash)
        .fetch_one(&state.db)
        .await
        {
            Ok(user) => HttpResponse::Ok().json(user),
            Err(error) => HttpResponse::InternalServerError().json(format!("{:?}", error))
        }

}

#[post("/login")]
async fn login(state: Data<AppState>,  body: Json<LoginUserBody>) -> impl Responder {
    let jwt_secret: Hmac<Sha256> = Hmac::new_from_slice(
        std::env::var("JWT_SECRET")
        .expect("JWT_SECRET must be set!")
            .as_bytes()
    ).unwrap();

    let loginInfo: LoginUserBody = body.into_inner();
    let username_str = loginInfo.username;
    let password_str = loginInfo.password;

    let credentials = Basic::new(username_str, Some(password_str));
    let username = credentials.user_id();
    let password = credentials.password();

    match password {
        None => HttpResponse::Unauthorized().json("Must provide username and password"),
        Some(pass) => {
            match sqlx::query_as::<_, AuthUser>(
                "SELECT id, username, password FROM users WHERE username = $1",
            ).bind(username.to_string())
                .fetch_one(&state.db)
                .await 
            {
                    Ok(user) => {
                        let hash_secret = std::env::var("HASH_SECRET").expect("HASH_SECRET must be set!");
                        let mut verifier = Verifier::default();
                        let is_valid = verifier.with_hash(user.password)
                            .with_password(pass)
                            .with_secret_key(hash_secret)
                            .verify()
                            .unwrap();

                        if is_valid {
                            let claims = TokenClaims { id: user.id };
                            let token_str = claims.sign_with_key(&jwt_secret).unwrap();
                            HttpResponse::Ok().json(UserInfo {
                                id: user.id,
                                username: user.username ,
                                token:  token_str
                            })
                        } else {
                            HttpResponse::Unauthorized().json("Incorrect username or password")
                        }
                    }
                    Err(error) => HttpResponse::InternalServerError().json(format!("{:?}", error)),
                }
        }
    }
}

#[post("/decks")]
async fn create_deck(state: Data<AppState>, req_user: Option<ReqData<TokenClaims>>, body: Json<CreateDeckBody>) -> impl Responder {
    match req_user {
        Some(user) => {
            let deckInfo: CreateDeckBody = body.into_inner();
            match sqlx::query_as::<_, Deck>(
                "INSERT INTO decks (title, description, published_by)
                VALUES ($1, $2, $3)
                RETURNING id, title, description, published_by, published_on")
                .bind(deckInfo.title)
                .bind(deckInfo.description)
                .bind(user.id)
                .fetch_one(&state.db)
                .await
                {
                    Ok(decks) => HttpResponse::Ok().json(decks),
                    Err(error) => HttpResponse::InternalServerError().json(format!("{:?}", error)),
                }
        },
        _ => HttpResponse::Unauthorized().json("Unable to verify identity"),
    }
}
