use std::env;

#[derive(Debug, Clone)]
pub struct Config {
    pub host: String,
    pub port: u16,
    pub database_url: Option<String>,
    pub cors_allowed_origins: Vec<String>,
    pub ai_service_url: String,
}

impl Config {
    pub fn from_env() -> Self {
        let host = env::var("HOST").unwrap_or_else(|_| "0.0.0.0".to_string());
        let port = env::var("PORT")
            .ok()
            .and_then(|p| p.parse().ok())
            .unwrap_or(8080);
        let database_url = env::var("DATABASE_URL").ok();
        let cors_str = env::var("CORS_ALLOWED_ORIGINS")
            .unwrap_or_else(|_| "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173".to_string());
        let cors_allowed_origins = cors_str
            .split(',')
            .map(|s| s.trim().to_string())
            .filter(|s| !s.is_empty())
            .collect();
        let ai_service_url = env::var("AI_SERVICE_URL")
            .unwrap_or_else(|_| "http://localhost:8000".to_string());

        Self {
            host,
            port,
            database_url,
            cors_allowed_origins,
            ai_service_url,
        }
    }
}
