use serde_json::json;
use actix_web::{
    get,
    HttpResponse, Responder
};

#[get("/api/status")]
pub async fn health_checker_handler() -> impl Responder {
    const MESSAGE: &str = "✅ Server's up and running";
    HttpResponse::Ok().json(json!({
        "status": "success",
        "message": MESSAGE
    }))
}
