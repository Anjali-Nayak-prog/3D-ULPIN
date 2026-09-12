use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Building {
    pub id: Uuid,
    pub parcel_id: Uuid,
    pub building_identifier: String,
    pub name: String,
    pub geometry: serde_json::Value,
    pub footprint: serde_json::Value,
    pub height: f64,
    pub floors: i32,
    pub built_up_area: f64,
    pub district: String,
    pub confidence: f64,
    pub status: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MapBuilding {
    pub id: String,
    pub name: String,
    pub ulpin: String,
    pub property_type: String,
    pub status: String,
    pub floors: i32,
    pub height: f64,
    pub land_area: f64,
    pub grid_x: f64,
    pub grid_z: f64,
    pub width: f64,
    pub depth: f64,
    pub district: String,
}
