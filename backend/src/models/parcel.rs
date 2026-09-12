use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Parcel {
    pub id: Uuid,
    pub parcel_number: String,
    pub ulpin: String,
    pub state: String,
    pub district: String,
    pub taluka: String,
    pub ward: String,
    pub survey_number: String,
    pub land_use: String,
    pub area: f64,
    pub geometry: serde_json::Value,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
