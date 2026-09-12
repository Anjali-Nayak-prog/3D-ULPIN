use crate::db::DbQueries;
use crate::models::property::{
    BuildingInfo, DataSource, LandInfo, Owner, Property, SpatialInfo, ULPINGenerationRequest,
};
use crate::services::ulpin::UlpinService;
use crate::state::AppState;
use axum::{
    extract::{Path, Query, State},
    response::IntoResponse,
    Json,
};
use chrono::Utc;
use serde::Deserialize;

#[derive(Deserialize)]
pub struct RecentQuery {
    pub limit: Option<usize>,
}

pub async fn generate_ulpin_handler(
    State(state): State<AppState>,
    Json(request): Json<ULPINGenerationRequest>,
) -> impl IntoResponse {
    let result = state.ulpin_service.generate_ulpin(&request);

    // Create a new persistent Property entry in the registry
    let prop_id = format!("prp-gen-{}", result.sequence);
    let new_prop = Property {
        id: prop_id.clone(),
        ulpin: result.ulpin.clone(),
        name: format!("{} Property {}", request.district, result.sequence),
        property_type: request.property_type.clone(),
        status: "verified".to_string(),
        district: request.district.clone(),
        taluka: request.taluka.clone(),
        ward: request.ward.clone(),
        address: format!("Survey Plot {}, {}, {}", result.sequence % 500 + 1, request.ward, request.district),
        owner: Owner {
            id: format!("own-{}", result.sequence),
            name: "Registered Citizen".to_string(),
            ownership_type: "Freehold Title".to_string(),
            verification_status: "verified".to_string(),
            cid_number: Some(format!("CIN-{}", result.sequence * 31)),
            co_owners: None,
        },
        spatial: SpatialInfo {
            latitude: request.latitude,
            longitude: request.longitude,
            elevation: request.elevation,
            min_height: request.min_elevation,
            max_height: request.max_elevation,
            volume: request.volume,
        },
        building: if request.property_type == "building" || request.property_type == "apartment" {
            Some(BuildingInfo {
                floors: (request.height / 3.0).ceil() as i32,
                units: ((request.height / 3.0).ceil() as i32) * 4,
                height: request.height,
                built_up_area: request.footprint_area * (request.height / 3.0).ceil(),
                year_built: Some(2026),
                is_high_rise: Some(request.height > 24.0),
            })
        } else {
            None
        },
        apartment: None,
        underground: None,
        land: Some(LandInfo {
            parcel_area: request.footprint_area * 1.5,
            survey_number: format!("S/{}/{}/2026", result.sequence % 300, request.district.chars().take(2).collect::<String>().to_uppercase()),
            district: request.district.clone(),
            taluka: request.taluka.clone(),
            ward: request.ward.clone(),
            zone: "Mixed Urban RX-1".to_string(),
        }),
        data_sources: vec![DataSource {
            id: format!("ds-{}", result.sequence),
            source_type: "gnss".to_string(),
            status: "verified".to_string(),
            last_updated: Utc::now().to_rfc3339(),
            provider: "Volumetric CORS Network".to_string(),
            confidence: result.confidence,
        }],
        floors: None,
        created_at: Utc::now().to_rfc3339(),
        updated_at: Utc::now().to_rfc3339(),
        description: request.notes.clone().or_else(|| {
            Some(format!(
                "Volumetrically mapped 3D cadastral parcel issued under ULPIN {}.",
                result.ulpin
            ))
        }),
    };

    // Store in memory repository
    state.property_service.add_property(new_prop.clone());

    // If PostgreSQL pool is available, also insert into database
    if let Some(ref pool) = state.pool {
        let owner_json = serde_json::to_value(&new_prop.owner).unwrap_or_default();
        let spatial_json = serde_json::to_value(&new_prop.spatial).unwrap_or_default();
        let _ = DbQueries::insert_property(
            pool,
            &new_prop.id,
            &new_prop.ulpin,
            &new_prop.name,
            &new_prop.property_type,
            &new_prop.status,
            &new_prop.district,
            &new_prop.taluka,
            &new_prop.ward,
            &new_prop.address,
            &owner_json,
            &spatial_json,
            request.min_elevation,
            request.max_elevation,
            request.volume,
        )
        .await;
    }

    Json(result)
}

pub async fn validate_ulpin_handler(Path(ulpin): Path<String>) -> impl IntoResponse {
    let is_valid = UlpinService::validate_ulpin(&ulpin);
    Json(is_valid)
}

pub async fn get_recent_handler(
    State(state): State<AppState>,
    Query(query): Query<RecentQuery>,
) -> impl IntoResponse {
    let limit = query.limit.unwrap_or(5);
    let recents = state.ulpin_service.get_recent(limit);
    Json(recents)
}
