mod config;
mod db;
mod errors;
mod models;
mod routes;
mod services;
mod state;

use config::Config;
use routes::create_router;
use sqlx::postgres::PgPoolOptions;
use state::AppState;
use std::net::SocketAddr;
use tracing::{error, info, warn};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Initialize tracing
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "ulpin_3d_backend=debug,tower_http=debug,axum=trace".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    info!("Starting 3D ULPIN Generation & Vertical Property Mapping Backend");

    let config = Config::from_env();
    info!("Configuration loaded: Host={}, Port={}", config.host, config.port);

    // Attempt PostgreSQL connection if configured
    let pool = if let Some(ref db_url) = config.database_url {
        info!("Connecting to PostgreSQL/PostGIS database...");
        match PgPoolOptions::new()
            .max_connections(10)
            .acquire_timeout(std::time::Duration::from_secs(5))
            .connect(db_url)
            .await
        {
            Ok(p) => {
                info!("Successfully connected to PostgreSQL/PostGIS");
                // Check health
                if let Err(e) = db::DbQueries::check_health(&p).await {
                    warn!("Database health check failed: {e}. Falling back to hybrid mode.");
                }
                Some(p)
            }
            Err(err) => {
                error!("Failed to connect to database ({}). Starting in in-memory mode.", err);
                None
            }
        }
    } else {
        info!("No DATABASE_URL provided. Operating with in-memory cadastral datastore.");
        None
    };

    let state = AppState::new(config.clone(), pool);
    let app = create_router(state);

    let addr: SocketAddr = format!("{}:{}", config.host, config.port).parse()?;
    info!("Server listening on http://{}", addr);
    info!("OpenAPI documentation available at http://{}/swagger-ui/", addr);

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}
