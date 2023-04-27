use crate::{AppState, TokenClaims};
use crate::model::commit::{Commit, Commits};
use actix_web::{
    get,
    post,
    web::{Data,  ReqData},
    HttpResponse, Responder
};
use serde_json::json;


#[get("/commits")]
pub async fn get_user_commits(state: Data<AppState>, req_user: Option<ReqData<TokenClaims>>) -> impl Responder {
    match req_user {
        Some(user) => {
            match sqlx::query_as::<_, Commits>(
                "SELECT count(*)::BIGINT as count, published_on as date from commits WHERE published_by = $1 GROUP BY published_on")
                .bind(user.user_id)
                .fetch_all(&state.db)
                .await
                {
                    Ok(commits) => HttpResponse::Ok().json(commits),
                    Err(error) => HttpResponse::InternalServerError().json(format!("{:?}", error)),
                }
        },
        None => {
            return HttpResponse::InternalServerError().json(json!({"message":"un-authorized"}));
        }
    }
}

#[post("/commits")]
async fn create_commit(state: Data<AppState>, req_user: Option<ReqData<TokenClaims>>) -> impl Responder {
    match req_user {
        Some(user) => {
            match sqlx::query(
                "INSERT INTO commits (published_by)
VALUES ($1)")
                .bind(&user.user_id)
                .execute(&state.db)
                .await
                {
                    Ok(_) => HttpResponse::Ok().json(json!({
                        "status": "success",
                        "message": "done"
                    })),
                    Err(error) => HttpResponse::InternalServerError().json(format!("{:?}", error)),
                }
        },
        _ => HttpResponse::Unauthorized().json("Unable to verify identity"),
    }
}

