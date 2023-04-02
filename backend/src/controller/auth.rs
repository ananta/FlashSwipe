use crate::{AppState, TokenClaims};
use crate::model::auth::{CreateUserBody, LoginUserBody, AuthUser, UserInfo, UserNoPassword};
use actix_web::{
    post,
    web::{Data, Json},
    HttpResponse, Responder
};
use actix_web_httpauth::headers::authorization::Basic;
use argonautica::{Hasher, Verifier};
use hmac::{Hmac, Mac};
use jwt::SignWithKey;
use sha2::Sha256;
use serde_json::json;



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
        "INSERT INTO users (username, password, first_name, last_name)
VALUES ($1, $2, $3, $4)
RETURNING user_id, username, first_name, last_name"
    )
        .bind(user.username)
        .bind(hash)
        .bind(user.first_name)
        .bind(user.last_name)
        .fetch_one(&state.db)
        .await
        {
            Ok(user) => HttpResponse::Ok().json(user),
            Err(error) => { 
                if error.to_string().contains("duplicate key"){
                    return HttpResponse::BadRequest().json(json!({"message": "Duplicate Key"}))
                }
                return HttpResponse::InternalServerError().json(format!("{:?}", error)) }
        }
}

#[post("/login")]
async fn login(state: Data<AppState>,  body: Json<LoginUserBody>) -> impl Responder {
    let jwt_secret: Hmac<Sha256> = Hmac::new_from_slice(
        std::env::var("JWT_SECRET")
            .expect("JWT_SECRET must be set!")
            .as_bytes()
    ).unwrap();

    let login_info: LoginUserBody = body.into_inner();
    let username_str = login_info.username;
    let password_str = login_info.password;

    let credentials = Basic::new(username_str, Some(password_str));
    let username = credentials.user_id();
    let password = credentials.password();

    match password {
        None => HttpResponse::Unauthorized().json("Must provide username and password"),
        Some(pass) => {
            match sqlx::query_as::<_, AuthUser>(
                "SELECT user_id, username, password, first_name, last_name FROM users WHERE username = $1",
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
                            let claims = TokenClaims { user_id: user.user_id };
                            let token_str = claims.sign_with_key(&jwt_secret).unwrap();
                            HttpResponse::Ok().json(UserInfo {
                                user_id: user.user_id,
                                username: user.username,
                                token:  token_str,
                                first_name: user.first_name,
                                last_name: user.last_name
                            })
                        } else {
                            HttpResponse::Unauthorized().json(json!({"message":"Incorrect username or password"}))
                        }
                    }
                    Err(error) => HttpResponse::InternalServerError().json(format!("{:?}", error)),
                }
        }
    }
}
