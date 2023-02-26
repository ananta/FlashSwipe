#[macro_use] extern crate rocket;
#[macro_use] extern crate diesel;
#[macro_use] extern crate rocket_sync_db_pools;


mod auth;
mod models;
mod schema;

use auth::BasicAuth;
use diesel::QueryDsl;
use models::Rustacean;
use rocket::response::*;
use rocket::response::status::*;
use rocket::serde::json::*;
use rocket_sync_db_pools::diesel::SqliteConnection;
use schema::rustaceans;
use crate::diesel::RunQueryDsl;


#[database("sqlite_logs")]
struct LogsDbConn(SqliteConnection);

#[database("sqlite_path")]
struct DbConn(SqliteConnection);


#[get("/rustaceans")]
async fn get_rustaceans(_auth: BasicAuth, _conn: DbConn) -> Value {
    // use schema::rustaceans::dsl::*;
    _conn.run(|c| {
        let all = rustaceans::table.limit(100).load::<Rustacean>(c).expect("error loading rustaceans from db");
        json!(all)
    }).await
}

#[get("/decks")]
fn get_decks(_auth: BasicAuth) -> Value {
    json!([
        { "id": 1, "name": "First Deck"},
        { "id": 2, "name": "Second Deck"},
        { "id": 3, "name": "Third Deck"},
        { "id": 4, "name": "Fourth Deck"},
    ])
}

#[get("/decks/<id>")]
fn view_deck(id: i32, _auth: BasicAuth) -> Value {
    json!({ "id": id, "name": "First Deck"})
}

#[post("/decks", format = "json")]
fn create_deck(_auth: BasicAuth) -> Value {
    json!({ "id": 99, "name": "New Deck"})
}

#[put("/decks/<id>", format = "json")]
fn update_deck(id: i32, _auth: BasicAuth) -> Value {
    json!({ "id": id, "name": "Updated Deck"})
}

#[delete("/decks/<_id>", format = "json")]
fn delete_deck(_id: i32, _auth: BasicAuth) -> NoContent {
    // delete something in the database
    status::NoContent
}

#[catch(404)]
fn not_found() -> Value {
    json!("Not found!")
}

#[rocket::main]
async fn main() {
    let _ = rocket::build().mount("/", routes![
        get_decks,
        view_deck,
        create_deck,
        update_deck,
        delete_deck
    ])
    .register("/",catchers![not_found])
    .attach(DbConn::fairing())
    .launch().await;
}

