use crate::errors::AppError;
use crate::models::property::{PropertyFilters, UpdatePropertyStatusRequest};
use crate::state::AppState;
use axum::{
    extract::{Path, Query, State},
    response::IntoResponse,
    Json,
};

pub async fn get_properties_handler(
    State(state): State<AppState>,
    Query(filters): Query<PropertyFilters>,
) -> impl IntoResponse {
    let properties = state.property_service.get_all(Some(&filters));
    Json(properties)
}

pub async fn get_property_by_id_handler(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Result<impl IntoResponse, AppError> {
    state
        .property_service
        .get_by_id(&id)
        .map(Json)
        .ok_or_else(|| AppError::NotFound(format!("Property '{}' was not found", id)))
}

pub async fn get_property_by_ulpin_handler(
    State(state): State<AppState>,
    Path(ulpin): Path<String>,
) -> Result<impl IntoResponse, AppError> {
    state
        .property_service
        .get_by_ulpin(&ulpin)
        .map(Json)
        .ok_or_else(|| AppError::NotFound(format!("Property with ULPIN '{}' was not found", ulpin)))
}

pub async fn update_property_status_handler(
    State(state): State<AppState>,
    Path(id): Path<String>,
    Json(payload): Json<UpdatePropertyStatusRequest>,
) -> Result<impl IntoResponse, AppError> {
    state
        .property_service
        .update_status(&id, &payload.status)
        .map(Json)
        .ok_or_else(|| AppError::NotFound(format!("Property '{}' was not found", id)))
}
