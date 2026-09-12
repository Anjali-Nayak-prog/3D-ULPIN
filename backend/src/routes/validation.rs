use crate::errors::AppError;
use crate::models::validation::{
    ConflictFilters, UpdateConflictStatusRequest, ValidatePropertyRequest,
};
use crate::state::AppState;
use axum::{
    extract::{Path, Query, State},
    response::IntoResponse,
    Json,
};

pub async fn get_conflicts_handler(
    State(state): State<AppState>,
    Query(filters): Query<ConflictFilters>,
) -> impl IntoResponse {
    let conflicts = state.validation_engine.get_conflicts(Some(&filters));
    Json(conflicts)
}

pub async fn update_conflict_status_handler(
    State(state): State<AppState>,
    Path(id): Path<String>,
    Json(payload): Json<UpdateConflictStatusRequest>,
) -> Result<impl IntoResponse, AppError> {
    state
        .validation_engine
        .update_conflict_status(&id, &payload.status)
        .map(Json)
        .ok_or_else(|| AppError::NotFound(format!("Conflict '{}' was not found", id)))
}

pub async fn get_reports_handler(State(state): State<AppState>) -> impl IntoResponse {
    let reports = state.validation_engine.get_reports();
    Json(reports)
}

pub async fn validate_property_handler(
    State(state): State<AppState>,
    Json(payload): Json<ValidatePropertyRequest>,
) -> Result<impl IntoResponse, AppError> {
    // Find property by id (or fallback to first property if 'all' or not found)
    let prop = state
        .property_service
        .get_by_id(&payload.property_id)
        .or_else(|| state.property_service.get_all(None).into_iter().next())
        .ok_or_else(|| {
            AppError::NotFound(format!("Property '{}' not found for validation", payload.property_id))
        })?;

    let report = state.validation_engine.validate_property(&prop);
    Ok(Json(report))
}
