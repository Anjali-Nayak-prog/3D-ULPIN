pub mod health;
pub mod map;
pub mod properties;
pub mod ulpin;
pub mod validation;

use crate::state::AppState;
use axum::{
    routing::{get, patch, post},
    Router,
};
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

#[derive(OpenApi)]
#[openapi(
    paths(
        // OpenAPI doc tags & paths
    ),
    tags(
        (name = "3D-ULPIN", description = "3D ULPIN Generation & Vertical Property Mapping System API")
    ),
    info(
        title = "3D ULPIN Cadastral API",
        version = "1.0.0",
        description = "High-precision 3D cadastral property volumes, prototype ULPIN issuance, and 3D topology validation"
    )
)]
struct ApiDoc;

pub fn create_router(state: AppState) -> Router {
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    Router::new()
        // Swagger UI
        .merge(SwaggerUi::new("/swagger-ui").url("/api-docs/openapi.json", ApiDoc::openapi()))
        // Health check
        .route("/health", get(health::health_handler))
        // Map routes
        .route("/map/layers", get(map::get_layers_handler))
        .route("/map/buildings", get(map::get_buildings_handler))
        .route("/map/underground", get(map::get_underground_handler))
        .route("/map/dem", get(map::get_dem_handler))
        // Property routes
        .route("/properties", get(properties::get_properties_handler))
        .route(
            "/properties/:id",
            get(properties::get_property_by_id_handler)
                .patch(properties::update_property_status_handler),
        )
        .route(
            "/properties/ulpin/:ulpin",
            get(properties::get_property_by_ulpin_handler),
        )
        // ULPIN routes
        .route("/ulpin/generate", post(ulpin::generate_ulpin_handler))
        .route(
            "/ulpin/validate/:ulpin",
            get(ulpin::validate_ulpin_handler),
        )
        .route("/ulpin/recent", get(ulpin::get_recent_handler))
        // Validation routes
        .route(
            "/validation/conflicts",
            get(validation::get_conflicts_handler),
        )
        .route(
            "/validation/conflicts/:id",
            patch(validation::update_conflict_status_handler),
        )
        .route(
            "/validation/reports",
            get(validation::get_reports_handler),
        )
        .route(
            "/validation/validate",
            post(validation::validate_property_handler),
        )
        .layer(cors)
        .layer(TraceLayer::new_for_http())
        .with_state(state)
}
