-- Enable PostGIS extension if available
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Parcels Table (2D Cadastral Base)
CREATE TABLE IF NOT EXISTS parcels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parcel_number VARCHAR(100) NOT NULL,
    ulpin VARCHAR(100) UNIQUE NOT NULL,
    state VARCHAR(100) NOT NULL DEFAULT 'Maharashtra',
    district VARCHAR(100) NOT NULL,
    taluka VARCHAR(100) NOT NULL,
    ward VARCHAR(100) NOT NULL,
    survey_number VARCHAR(100) NOT NULL,
    land_use VARCHAR(100) NOT NULL,
    area DOUBLE PRECISION NOT NULL,
    geometry GEOMETRY(Polygon, 4326),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Buildings Table
CREATE TABLE IF NOT EXISTS buildings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parcel_id UUID REFERENCES parcels(id) ON DELETE CASCADE,
    building_identifier VARCHAR(50) NOT NULL,
    name VARCHAR(200) NOT NULL,
    footprint GEOMETRY(Polygon, 4326),
    height DOUBLE PRECISION NOT NULL,
    floors INT NOT NULL,
    built_up_area DOUBLE PRECISION NOT NULL,
    district VARCHAR(100) NOT NULL,
    confidence DOUBLE PRECISION NOT NULL DEFAULT 95.0,
    status VARCHAR(50) NOT NULL DEFAULT 'verified',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Floors Table (Vertical bands)
CREATE TABLE IF NOT EXISTS floors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
    floor_number INT NOT NULL,
    label VARCHAR(50) NOT NULL,
    z_min DOUBLE PRECISION NOT NULL,
    z_max DOUBLE PRECISION NOT NULL,
    area DOUBLE PRECISION NOT NULL,
    unit_count INT NOT NULL DEFAULT 1,
    geometry GEOMETRY(Polygon, 4326),
    status VARCHAR(50) NOT NULL DEFAULT 'verified',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Properties / Volumetric Units Table
CREATE TABLE IF NOT EXISTS properties (
    id VARCHAR(100) PRIMARY KEY,
    ulpin VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    property_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'verified',
    district VARCHAR(100) NOT NULL,
    taluka VARCHAR(100) NOT NULL,
    ward VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    owner JSONB NOT NULL,
    spatial JSONB NOT NULL,
    building_id UUID REFERENCES buildings(id) ON DELETE SET NULL,
    floor_id UUID REFERENCES floors(id) ON DELETE SET NULL,
    flat_number VARCHAR(50),
    z_min DOUBLE PRECISION NOT NULL,
    z_max DOUBLE PRECISION NOT NULL,
    area_2d DOUBLE PRECISION,
    volume_3d DOUBLE PRECISION NOT NULL,
    geometry GEOMETRY(GeometryZ, 4326),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Underground Assets Table
CREATE TABLE IF NOT EXISTS underground_assets (
    id VARCHAR(100) PRIMARY KEY,
    identity VARCHAR(100),
    name VARCHAR(200) NOT NULL,
    kind VARCHAR(50) NOT NULL,
    depth DOUBLE PRECISION NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'verified',
    path JSONB NOT NULL,
    geometry GEOMETRY(LineStringZ, 4326),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conflicts Table
CREATE TABLE IF NOT EXISTS conflicts (
    id VARCHAR(100) PRIMARY KEY,
    type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'open',
    affected_properties JSONB NOT NULL,
    description TEXT NOT NULL,
    detected_by VARCHAR(50) NOT NULL,
    location JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Validation Reports Table
CREATE TABLE IF NOT EXISTS validation_reports (
    id VARCHAR(100) PRIMARY KEY,
    property_id VARCHAR(100) NOT NULL,
    property_name VARCHAR(200) NOT NULL,
    ulpin VARCHAR(100) NOT NULL,
    checks_passed INT NOT NULL,
    checks_failed INT NOT NULL,
    checks_total INT NOT NULL,
    score DOUBLE PRECISION NOT NULL,
    status VARCHAR(50) NOT NULL,
    summary TEXT NOT NULL,
    ran_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spatial Indexes
CREATE INDEX IF NOT EXISTS idx_parcels_geom ON parcels USING GIST (geometry);
CREATE INDEX IF NOT EXISTS idx_buildings_footprint ON buildings USING GIST (footprint);
CREATE INDEX IF NOT EXISTS idx_properties_geom ON properties USING GIST (geometry);
CREATE INDEX IF NOT EXISTS idx_underground_geom ON underground_assets USING GIST (geometry);
CREATE INDEX IF NOT EXISTS idx_properties_ulpin ON properties(ulpin);
CREATE INDEX IF NOT EXISTS idx_properties_district ON properties(district);
