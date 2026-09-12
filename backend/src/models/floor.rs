use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Floor {
    pub id: Uuid,
    pub building_id: Uuid,
    pub floor_number: i32,
    pub label: String,
    pub z_min: f64,
    pub z_max: f64,
    pub area: f64,
    pub unit_count: i32,
    pub geometry: serde_json::Value,
    pub status: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FrontendFloor {
    pub id: String,
    pub level: i32,
    pub label: String,
    pub units: i32,
    pub area: f64,
    pub status: String,
}
