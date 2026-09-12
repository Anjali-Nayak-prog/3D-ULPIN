use anyhow::Result;
use sqlx::PgPool;

pub struct DbQueries;

impl DbQueries {
    /// Perform database connection check
    pub async fn check_health(pool: &PgPool) -> Result<()> {
        sqlx::query("SELECT 1")
            .execute(pool)
            .await?;
        Ok(())
    }

    /// Record an audit log entry in the database
    pub async fn log_audit(
        pool: &PgPool,
        action: &str,
        entity_type: &str,
        entity_id: &str,
        details: Option<&serde_json::Value>,
    ) -> Result<()> {
        sqlx::query(
            r#"
            INSERT INTO audit_logs (id, action, entity_type, entity_id, details, created_at)
            VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())
            "#,
        )
        .bind(action)
        .bind(entity_type)
        .bind(entity_id)
        .bind(details)
        .execute(pool)
        .await?;

        Ok(())
    }

    /// Persist a newly generated 3D ULPIN property record in PostGIS
    pub async fn insert_property(
        pool: &PgPool,
        id: &str,
        ulpin: &str,
        name: &str,
        property_type: &str,
        status: &str,
        district: &str,
        taluka: &str,
        ward: &str,
        address: &str,
        owner_json: &serde_json::Value,
        spatial_json: &serde_json::Value,
        z_min: f64,
        z_max: f64,
        volume: f64,
    ) -> Result<()> {
        sqlx::query(
            r#"
            INSERT INTO properties (
                id, ulpin, name, property_type, status,
                district, taluka, ward, address,
                owner, spatial, z_min, z_max, volume_3d,
                created_at, updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW())
            ON CONFLICT (id) DO UPDATE SET
                status = EXCLUDED.status,
                updated_at = NOW()
            "#,
        )
        .bind(id)
        .bind(ulpin)
        .bind(name)
        .bind(property_type)
        .bind(status)
        .bind(district)
        .bind(taluka)
        .bind(ward)
        .bind(address)
        .bind(owner_json)
        .bind(spatial_json)
        .bind(z_min)
        .bind(z_max)
        .bind(volume)
        .execute(pool)
        .await?;

        Ok(())
    }
}
