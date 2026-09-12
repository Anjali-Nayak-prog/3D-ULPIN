use crate::db::DbQueries;
use crate::state::AppState;
use axum::{extract::State, response::IntoResponse, Json};
use serde::Serialize;

#[derive(Serialize)]
pub struct HealthResponse {
    pub status: &'static str,
    pub version: &'static str,
    pub database: &'static str,
}

pub async fn health_handler(State(state): State<AppState>) -> impl IntoResponse {
    let db_status = if let Some(ref pool) = state.pool {
        match DbQueries::check_health(pool).await {
            Ok(_) => "connected",
            Err(_) => "error",
        }
    } else {
        "memory_store"
    };

    Json(HealthResponse {
        status: "ok",
        version: "0.1.0",
        database: db_status,
    })
}
