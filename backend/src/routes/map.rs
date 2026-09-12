use crate::services::map::MapService;
use axum::{extract::Query, response::IntoResponse, Json};
use serde::Deserialize;

#[derive(Deserialize)]
pub struct DemQuery {
    pub z: Option<i32>,
}

pub async fn get_layers_handler() -> impl IntoResponse {
    let layers = MapService::get_layers();
    Json(layers)
}

pub async fn get_buildings_handler() -> impl IntoResponse {
    let buildings = MapService::get_landmark_buildings();
    Json(buildings)
}

pub async fn get_underground_handler() -> impl IntoResponse {
    let assets = MapService::get_underground_assets();
    Json(assets)
}

pub async fn get_dem_handler(Query(query): Query<DemQuery>) -> impl IntoResponse {
    let seed = query.z.unwrap_or(1);
    let dem_data = MapService::get_dem_tile(seed);
    Json(dem_data)
}
