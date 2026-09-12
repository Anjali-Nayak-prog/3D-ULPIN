use crate::models::floor::FrontendFloor;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Owner {
    pub id: String,
    pub name: String,
    pub ownership_type: String,
    pub verification_status: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub cid_number: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub co_owners: Option<Vec<String>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SpatialInfo {
    pub latitude: f64,
    pub longitude: f64,
    pub elevation: f64,
    pub min_height: f64,
    pub max_height: f64,
    pub volume: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BuildingInfo {
    pub floors: i32,
    pub units: i32,
    pub height: f64,
    pub built_up_area: f64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub year_built: Option<i32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_high_rise: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ApartmentInfo {
    pub unit_number: String,
    pub floor: i32,
    pub building_id: String,
    pub built_up_area: f64,
    pub carpet_area: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UndergroundAssetInfo {
    pub asset_type: String,
    pub depth: f64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub diameter: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub material: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub utility_owner: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LandInfo {
    pub parcel_area: f64,
    pub survey_number: String,
    pub district: String,
    pub taluka: String,
    pub ward: String,
    pub zone: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DataSource {
    pub id: String,
    #[serde(rename = "type")]
    pub source_type: String,
    pub status: String,
    pub last_updated: String,
    pub provider: String,
    pub confidence: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Property {
    pub id: String,
    pub ulpin: String,
    pub name: String,
    #[serde(rename = "type")]
    pub property_type: String,
    pub status: String,
    pub district: String,
    pub taluka: String,
    pub ward: String,
    pub address: String,
    pub owner: Owner,
    pub spatial: SpatialInfo,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub building: Option<BuildingInfo>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub apartment: Option<ApartmentInfo>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub underground: Option<UndergroundAssetInfo>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub land: Option<LandInfo>,
    pub data_sources: Vec<DataSource>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub floors: Option<Vec<FrontendFloor>>,
    pub created_at: String,
    pub updated_at: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PropertyFilters {
    pub query: Option<String>,
    pub r#type: Option<String>,
    pub status: Option<String>,
    pub district: Option<String>,
    pub min_height: Option<f64>,
    pub max_height: Option<f64>,
    pub max_floors: Option<i32>,
    pub date_from: Option<String>,
    pub date_to: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdatePropertyStatusRequest {
    pub status: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ULPINGenerationRequest {
    pub latitude: f64,
    pub longitude: f64,
    pub elevation: f64,
    pub district: String,
    pub taluka: String,
    pub ward: String,
    pub property_type: String,
    pub min_elevation: f64,
    pub max_elevation: f64,
    pub height: f64,
    pub footprint_area: f64,
    pub volume: f64,
    pub notes: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ULPINResult {
    pub ulpin: String,
    pub generated_at: String,
    pub latitude: f64,
    pub longitude: f64,
    pub property_type: String,
    pub district: String,
    pub confidence: f64,
    pub sequence: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RecentULPIN {
    pub id: String,
    pub ulpin: String,
    pub district: String,
    pub property_type: String,
    pub generated_at: String,
    pub status: String,
}
