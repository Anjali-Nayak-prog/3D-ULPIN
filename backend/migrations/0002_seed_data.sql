-- Seed demonstration area: Hinjewadi & Kothrud parcels and 3D buildings

INSERT INTO parcels (id, parcel_number, ulpin, state, district, taluka, ward, survey_number, land_use, area, geometry)
VALUES (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'P001',
    'ULPIN-PN-000123',
    'Maharashtra',
    'Hinjewadi',
    'Mulshi',
    'Hinjewadi',
    'S/452/HJ/2021',
    'Residential RX-2',
    3750.0,
    ST_GeomFromText('POLYGON((73.7360 18.5910, 73.7370 18.5910, 73.7370 18.5915, 73.7360 18.5915, 73.7360 18.5910))', 4326)
) ON CONFLICT (ulpin) DO NOTHING;

INSERT INTO buildings (id, parcel_id, building_identifier, name, height, floors, built_up_area, district, confidence, status, footprint)
VALUES (
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'B01',
    'Skyline Tower A',
    86.0,
    24,
    48200.0,
    'Hinjewadi',
    98.5,
    'verified',
    ST_GeomFromText('POLYGON((73.7362 18.5911, 73.7368 18.5911, 73.7368 18.5914, 73.7362 18.5914, 73.7362 18.5911))', 4326)
) ON CONFLICT DO NOTHING;

INSERT INTO floors (id, building_id, floor_number, label, z_min, z_max, area, unit_count, status)
VALUES (
    'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    4,
    'Floor 04',
    12.0,
    15.0,
    1820.0,
    12,
    'verified'
) ON CONFLICT DO NOTHING;

INSERT INTO properties (
    id, ulpin, name, property_type, status,
    district, taluka, ward, address,
    owner, spatial, z_min, z_max, volume_3d
)
VALUES (
    'prp-demo-401',
    '3D-MH-PN-P001-B01-F04-A01',
    'Skyline Tower A - Flat 401',
    'apartment',
    'verified',
    'Hinjewadi',
    'Mulshi',
    'Hinjewadi',
    'Flat 401, Floor 4, Skyline Tower A, Hinjewadi, Pune',
    '{"id": "own-demo-1", "name": "Ananya Sharma", "ownershipType": "Strata Title (Freehold Unit)", "verificationStatus": "verified"}'::jsonb,
    '{"latitude": 18.59125, "longitude": 73.73648, "elevation": 570.0, "minHeight": 12.0, "maxHeight": 15.0, "volume": 450.0}'::jsonb,
    12.0,
    15.0,
    450.0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO conflicts (id, type, severity, status, affected_properties, description, detected_by, location)
VALUES (
    'cnf-001',
    'ownership-overlap',
    'critical',
    'open',
    '["ULPIN-PN-2026-001122", "ULPIN-PN-2026-001124"]'::jsonb,
    'Two strata-title claims overlap across the 12th-floor terrace by 3.2 m². Roof-rights transfer recorded with conflicting annexure numbers.',
    'ai',
    '{"lat": 18.50742, "lng": 73.80769}'::jsonb
) ON CONFLICT (id) DO NOTHING;

INSERT INTO conflicts (id, type, severity, status, affected_properties, description, detected_by, location)
VALUES (
    'cnf-004',
    'underground-utility',
    'critical',
    'open',
    '["ULPIN-PN-2026-001080", "UG/89/PC/2019"]'::jsonb,
    'Private basement cellar overlaps the 1.8 m sewer trunk-line statutory setback by 1.4 m horizontally at 7.8 m depth.',
    'rule-engine',
    '{"lat": 18.53142, "lng": 73.8447}'::jsonb
) ON CONFLICT (id) DO NOTHING;
