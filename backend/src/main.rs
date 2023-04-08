use actix_web::{
    dev::ServiceRequest,
    error::Error,
    web::{self, Data},
    App, HttpMessage, HttpServer,
    middleware::Logger
};
use dotenv::dotenv;
use sqlx::{postgres::PgPoolOptions, Pool, Postgres, migrate};

use actix_web_httpauth::{
    extractors::{
        bearer::{self, BearerAuth},
        AuthenticationError,
    },
    middleware::HttpAuthentication
};
use hmac::{Hmac, Mac};
use jwt::VerifyWithKey;
use serde::{Deserialize, Serialize};
use sha2::Sha256;

pub struct AppState {
    db: Pool<Postgres>
}

mod model;
mod controller;
use controller::auth::{login, register};
use controller::deck::{create_deck, get_decks,delete_deck, get_public_decks, get_deck_info, add_cards_in_deck, update_deck, remove_cards_in_deck};
use controller::health_route::health_checker_handler;

// define structure of our bearer token
// should be serializeable, deserialzable and cloneable
#[derive(Serialize, Deserialize, Clone)]
pub struct TokenClaims {
    user_id: i32,
}

// middleware to validate our token
async fn validator(req: ServiceRequest, credentials: BearerAuth) -> Result<ServiceRequest, (Error, ServiceRequest)> {
    let jwt_secret: String = std::env::var("JWT_SECRET").expect("JWT_SECRET must be set!");
    let key: Hmac<Sha256> = Hmac::new_from_slice(jwt_secret.as_bytes()).unwrap();
    let token_string = credentials.token();

    // verify the token,
    let claims: Result<TokenClaims, &str> = token_string.verify_with_key(&key)
        .map_err(|_| "Invalid token");
    match claims {
        // get the value if exists
        // and add the data into our request
        Ok(value) => {
            req.extensions_mut().insert(value);
            Ok(req)
        }
        Err(_) => {
            let config = req.app_data::<bearer::Config>()
                .cloned()
                .unwrap_or_default()
                .scope("");
            Err((AuthenticationError::from(config).into(), req))
        }
    }

}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // set up logging variables
    std::env::set_var("RUST_LOG", "debug");
    std::env::set_var("RUST_BACKTRACE", "1");
    env_logger::init();

    dotenv().ok();
    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool:Pool<Postgres> = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Error building a connection pool");
    migrate!("./migrations").run(&pool).await.expect("Error running migrations");

    HttpServer::new(move || {
        let logger:Logger =  Logger::default();
        let bearer_middleware = HttpAuthentication::bearer(validator);
        App::new()
            .wrap(logger)
            .app_data(Data::new(AppState { db: pool.clone() }))
            .service(health_checker_handler)
            .service(login)
            .service(register)
            .service(
                web::scope("")
                .wrap(bearer_middleware)
                    .service(create_deck)
                .service(get_decks)
                .service(get_deck_info)
                .service(delete_deck)
                .service(update_deck)
                .service(get_public_decks)
                .service(add_cards_in_deck)
                .service(remove_cards_in_deck),
            )
    })
        .bind(("0.0.0.0", 8080))?
        .run()
    .await
}
