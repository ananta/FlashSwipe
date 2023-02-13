use rocket::{serde::json::{ Value, json}, response::status::{NoContent, self}, request:: { Request, FromRequest, Outcome}, http::Status};
#[macro_use] extern crate rocket;

#[get("/decks")]
fn get_decks() -> Value {
    json!([
        { "id": 1, "name": "First Deck"},
        { "id": 2, "name": "Second Deck"},
        { "id": 3, "name": "Third Deck"},
        { "id": 4, "name": "Fourth Deck"},
    ])
}

#[get("/decks/<id>")]
fn view_deck(id: i32) -> Value {
    json!({ "id": id, "name": "First Deck"})
}

#[post("/decks", format = "json")]
fn create_deck() -> Value {
    json!({ "id": 99, "name": "New Deck"})
}

#[put("/decks/<id>", format = "json")]
fn update_deck(id: i32) -> Value {
    json!({ "id": id, "name": "Updated Deck"})
}

#[delete("/decks/<_id>", format = "json")]
fn delete_deck(_id: i32) -> NoContent {
    // delete something in the database
    status::NoContent
}

#[catch(404)]
fn not_found() -> Value {
    json!("Not found!")
}

pub struct BasicAuth {
    pub username: String,
    pub password: String,
}

impl BasicAuth {
    fn from_authorization_header(header : &str) -> Option<BasicAuth> {
        let split = header.split_whitespace().collect::<Vec<_>>();
        if split.len() != 2 {
            return None;
        }
        if split[0] != "Basic" {
            return None;
        }
        Self::from_base64_encoded(split[1])
    }

    fn from_base64_encoded(base64_string: &str) -> Option<BasicAuth> {
        let decoded = base64::decode(base64_string).ok()?;
        let decoded_str = String::from_utf8(decoded).ok()?;
        let split = decoded_str.split(":").collect::<Vec<_>>();
        if split.len() != 2 {
            return None;
        }
        let (username, password) = (split[0].to_string(), split[1].to_string());
        Some(BasicAuth { username, password })
    }

}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for BasicAuth {
    type Error = ();

    async fn from_request(request: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        let auth_header = request.headers().get_one("Authorization");
        if let Some(auth_header) = auth_header {
            if let Some(auth) = Self::from_authorization_header(auth_header) {
                return Outcome::Success(auth);
            }
        }
        Outcome::Failure((Status:: Unauthorized, ()))
    }
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

