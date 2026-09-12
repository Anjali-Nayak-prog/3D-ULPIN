use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PathPoint {
    pub x: f64,
    pub z: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UndergroundAsset {
    pub id: String,
    pub name: String,
    pub kind: String,
    pub depth: f64,
    pub status: String,
    pub path: Vec<PathPoint>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MapLayer {
    pub id: String,
    pub name: String,
    #[serde(rename = "type")]
    pub layer_type: String,
    pub category: String,
    pub visible: bool,
    pub opacity: f64,
    pub color: String,
}
