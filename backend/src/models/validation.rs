use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ConflictLocation {
    pub lat: f64,
    pub lng: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Conflict {
    pub id: String,
    #[serde(rename = "type")]
    pub conflict_type: String,
    pub severity: String,
    pub status: String,
    pub affected_properties: Vec<String>,
    pub description: String,
    pub created_at: String,
    pub detected_by: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub location: Option<ConflictLocation>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ValidationReport {
    pub id: String,
    pub property_id: String,
    pub property_name: String,
    pub ulpin: String,
    pub checks_passed: i32,
    pub checks_failed: i32,
    pub checks_total: i32,
    pub score: f64,
    pub ran_at: String,
    pub status: String,
    pub summary: String,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ValidatePropertyRequest {
    pub property_id: String,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ConflictFilters {
    pub severity: Option<String>,
    pub status: Option<String>,
    pub property_type: Option<String>,
    pub r#type: Option<String>,
    pub date_from: Option<String>,
    pub date_to: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateConflictStatusRequest {
    pub status: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ValidationCheckResult {
    pub check_id: String,
    pub name: String,
    pub passed: bool,
    pub description: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub issue_detail: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DetailedValidationResult {
    pub valid: bool,
    pub score: f64,
    pub checks_passed: i32,
    pub checks_failed: i32,
    pub checks_total: i32,
    pub issues: Vec<String>,
    pub checks: Vec<ValidationCheckResult>,
}
