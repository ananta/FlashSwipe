use crate::{AppState, TokenClaims};
use crate::model::deck::{CreateDeckBody, Deck, DeckIdentifier, UpdateDeckBody};
use crate::model::card::{AddCardsInsideDeck, Card};
use actix_web::{
    get,
    post,
    delete,
    patch,
    web::{Data, Json, ReqData, Path},
    HttpResponse, Responder
};
use serde_json::json;
use log::debug;


#[get("/decks")]
pub async fn get_public_decks(state: Data<AppState>, _: Option<ReqData<TokenClaims>>) -> impl Responder {
    match sqlx::query_as::<_, Deck>(
        "SELECT * from decks")
        .fetch_all(&state.db)
        .await
        {
            Ok(decks) => HttpResponse::Ok().json(decks),
            Err(error) => HttpResponse::InternalServerError().json(format!("{:?}", error)),
        }
}

#[get("/decks/{deck_id}")]
async fn get_deck_info(state: Data<AppState>, deck_identifier: Path<DeckIdentifier> ) -> impl Responder {

    debug!("HERE: {}",&deck_identifier.deck_id);

    match sqlx::query_as::<_, Deck>(
        "SELECT * from decks where deck_id = $1::INTEGER")
        .bind(&deck_identifier.deck_id)
        .fetch_one(&state.db)
        .await
        {
            Ok(deck) => HttpResponse::Ok().json(deck),
            Err(error) => HttpResponse::InternalServerError().json(format!("{:?}", error)),
        }
}


#[patch("/decks/{deck_id}")]
async fn update_deck(state: Data<AppState>, req_user: Option<ReqData<TokenClaims>>, deck_identifier: Path<DeckIdentifier>, body: Json<UpdateDeckBody>) -> impl Responder {
    match req_user {
        Some(user) => {
            let deck_id:i32 = deck_identifier.deck_id.parse::<i32>().unwrap();
            let is_valid_deck = sqlx::query_as::<_,Deck>("SELECT * FROM decks WHERE deck_id = $1 AND published_by = $2").bind(deck_id).bind(user.user_id).fetch_one(&state.db).await;
            if is_valid_deck.is_err() {
                return HttpResponse::InternalServerError().json(json!({"message":"Deck not found!"}));
            }

            let current_deck = is_valid_deck.unwrap();
            let update_info: UpdateDeckBody = body.into_inner();

            debug!("title: {}", current_deck.title.clone());
            debug!("here: {}",format!("{:?}",update_info.title ));

            let update_result = sqlx::query_as::<_, Deck>(
                "UPDATE decks SET title = $1, description = $2 WHERE deck_id = $3 RETURNING *",
            )
                .bind(update_info.title.to_owned().unwrap_or_else(|| current_deck.title.clone() ))
                .bind(
                    update_info.description.to_owned().unwrap_or_else(|| current_deck.description.clone()))
                .bind(deck_id.to_owned())
                .fetch_one(&state.db)
            .await;

            match update_result {

                Ok(deck) => HttpResponse::Ok().json(deck),
                Err(e) => {
                    let message = format!("Internal server error: {}", e);
                    debug!("{}",message);
                    return HttpResponse::InternalServerError()
                        .json(json!({"status": "error","message": message}));
                }
            }

        },
        None => {
            return HttpResponse::InternalServerError().json(json!({"message":"un-authorized"}));
        }
    }
}

#[delete("/decks/{deck_id}")]
async fn delete_deck(state: Data<AppState>, req_user: Option<ReqData<TokenClaims>>, deck_identifier: Path<DeckIdentifier>) -> impl Responder {
    match req_user {
        Some(user) => {
            let deck_id:i32 = deck_identifier.deck_id.parse::<i32>().unwrap();
            let is_valid_deck = sqlx::query_as::<_,Deck>("SELECT * FROM decks WHERE deck_id = $1 AND published_by = $2").bind(deck_id).bind(user.user_id).fetch_one(&state.db).await;
            if is_valid_deck.is_err() {
                return HttpResponse::InternalServerError().json(json!({"message":"Deck not found!"}));
            }
            let rows_affected = sqlx::query!(r#"DELETE FROM decks where deck_id = $1"#, &deck_identifier.deck_id.parse::<i32>().unwrap()).execute(
                &state.db
            ).await
                .unwrap().rows_affected();
            if rows_affected == 0 {
                return HttpResponse::InternalServerError().json("failed");
            }
            HttpResponse::Ok().json("success")
        },
        None => {
            return HttpResponse::InternalServerError().json(json!({"message":"un-authorized"}));
        }
    }
}



#[get("/decks/user")]
async fn get_decks(state: Data<AppState>, req_user: Option<ReqData<TokenClaims>>) -> impl Responder {
    match req_user {
        Some(user) => {
            match sqlx::query_as::<_, Deck>(
                "SELECT * from decks where published_by = $1")
                .bind(user.user_id)
                .fetch_all(&state.db)
                .await
                {
                    Ok(decks) => HttpResponse::Ok().json(decks),
                    Err(error) => HttpResponse::InternalServerError().json(format!("{:?}", error)),
                }
        },
        _ => HttpResponse::Unauthorized().json("Unable to verify identity"),
    }
}

#[post("/decks")]
async fn create_deck(state: Data<AppState>, req_user: Option<ReqData<TokenClaims>>, body: Json<CreateDeckBody>) -> impl Responder {
    match req_user {
        Some(user) => {
            let deck_info: CreateDeckBody = body.into_inner();
            match sqlx::query_as::<_, Deck>(
                "INSERT INTO decks (title, description, published_by)
                    VALUES ($1, $2, $3)
                    RETURNING deck_id, title, description, published_by, published_on")
                .bind(deck_info.title)
                .bind(deck_info.description)
                .bind(user.user_id)
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


// TODO
#[post("/decks/cards")]
async fn add_cards_in_deck(state: Data<AppState>, req_user: Option<ReqData<TokenClaims>>, body: Json<AddCardsInsideDeck>) -> impl Responder {
    match req_user {
        Some(user) => {
            // TODO: Check if the user has permission to the deck
            let card_info: AddCardsInsideDeck = body.into_inner();
            match sqlx::query_as::<_, Card>(
                "INSERT INTO cards (deck_id, front, back)
                    VALUES ($1, $2, $3)
                    RETURNING card_id, deck_id, front, back, published_on")
                .bind(card_info.deck_id)
                .bind(card_info.front)
                .bind(card_info.back)
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
