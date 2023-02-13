use rocket::{serde::json::{ Value, json}, response::status::{NoContent, self}};
#[macro_use] extern crate rocket;

mod auth;
use auth::BasicAuth;

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
    .launch().await;
}

