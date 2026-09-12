use crate::config::Config;
use crate::services::property::PropertyService;
use crate::services::ulpin::UlpinService;
use crate::services::validation::ValidationEngine;
use sqlx::PgPool;
use std::sync::Arc;

#[derive(Clone)]
pub struct AppState {
    pub config: Config,
    pub pool: Option<PgPool>,
    pub property_service: Arc<PropertyService>,
    pub ulpin_service: Arc<UlpinService>,
    pub validation_engine: Arc<ValidationEngine>,
    pub http_client: reqwest::Client,
}

impl AppState {
    pub fn new(config: Config, pool: Option<PgPool>) -> Self {
        Self {
            config,
            pool,
            property_service: Arc::new(PropertyService::new()),
            ulpin_service: Arc::new(UlpinService::new()),
            validation_engine: Arc::new(ValidationEngine::new()),
            http_client: reqwest::Client::builder()
                .timeout(std::time::Duration::from_secs(10))
                .build()
                .unwrap_or_default(),
        }
    }
}
