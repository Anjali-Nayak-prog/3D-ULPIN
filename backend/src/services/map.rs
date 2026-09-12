use crate::models::building::MapBuilding;
use crate::models::underground::{MapLayer, PathPoint, UndergroundAsset};

pub struct MapService;

impl MapService {
    pub fn get_layers() -> Vec<MapLayer> {
        vec![
            MapLayer {
                id: "lyr-parcels".to_string(),
                name: "Land Parcels".to_string(),
                layer_type: "parcels".to_string(),
                category: "surface".to_string(),
                visible: true,
                opacity: 0.55,
                color: "#38bdf8".to_string(),
            },
            MapLayer {
                id: "lyr-buildings".to_string(),
                name: "Buildings".to_string(),
                layer_type: "buildings".to_string(),
                category: "surface".to_string(),
                visible: true,
                opacity: 1.0,
                color: "#60a5fa".to_string(),
            },
            MapLayer {
                id: "lyr-apartments".to_string(),
                name: "Apartments".to_string(),
                layer_type: "apartments".to_string(),
                category: "surface".to_string(),
                visible: false,
                opacity: 0.8,
                color: "#34d399".to_string(),
            },
            MapLayer {
                id: "lyr-roads".to_string(),
                name: "Roads".to_string(),
                layer_type: "roads".to_string(),
                category: "base".to_string(),
                visible: true,
                opacity: 0.9,
                color: "#64748b".to_string(),
            },
            MapLayer {
                id: "lyr-underground".to_string(),
                name: "Underground Utilities".to_string(),
                layer_type: "underground".to_string(),
                category: "underground".to_string(),
                visible: true,
                opacity: 0.85,
                color: "#c084fc".to_string(),
            },
            MapLayer {
                id: "lyr-water".to_string(),
                name: "Water Pipelines".to_string(),
                layer_type: "water".to_string(),
                category: "underground".to_string(),
                visible: true,
                opacity: 0.9,
                color: "#38bdf8".to_string(),
            },
            MapLayer {
                id: "lyr-sewer".to_string(),
                name: "Sewer Network".to_string(),
                layer_type: "sewer".to_string(),
                category: "underground".to_string(),
                visible: true,
                opacity: 0.9,
                color: "#a855f7".to_string(),
            },
            MapLayer {
                id: "lyr-electricity".to_string(),
                name: "Electricity".to_string(),
                layer_type: "electricity".to_string(),
                category: "underground".to_string(),
                visible: false,
                opacity: 0.85,
                color: "#f59e0b".to_string(),
            },
            MapLayer {
                id: "lyr-dem".to_string(),
                name: "DEM".to_string(),
                layer_type: "dem".to_string(),
                category: "base".to_string(),
                visible: false,
                opacity: 0.4,
                color: "#4ade80".to_string(),
            },
            MapLayer {
                id: "lyr-lidar".to_string(),
                name: "LiDAR".to_string(),
                layer_type: "lidar".to_string(),
                category: "base".to_string(),
                visible: false,
                opacity: 0.3,
                color: "#f472b6".to_string(),
            },
        ]
    }

    pub fn get_landmark_buildings() -> Vec<MapBuilding> {
        vec![
            MapBuilding {
                id: "prp-001".to_string(),
                name: "Skyline Tower A".to_string(),
                ulpin: "ULPIN-PN-2026-001245".to_string(),
                property_type: "building".to_string(),
                status: "verified".to_string(),
                floors: 24,
                height: 86.0,
                land_area: 3750.0,
                grid_x: 4.0,
                grid_z: 2.0,
                width: 1.6,
                depth: 1.3,
                district: "Hinjewadi".to_string(),
            },
            MapBuilding {
                id: "prp-002".to_string(),
                name: "Azure Residency Apartment 12B".to_string(),
                ulpin: "ULPIN-PN-2026-001122".to_string(),
                property_type: "apartment".to_string(),
                status: "conflict".to_string(),
                floors: 14,
                height: 46.0,
                land_area: 1350.0,
                grid_x: 7.0,
                grid_z: 8.0,
                width: 1.3,
                depth: 1.1,
                district: "Kothrud".to_string(),
            },
            MapBuilding {
                id: "prp-003".to_string(),
                name: "Westline Warehouse Unit 4".to_string(),
                ulpin: "ULPIN-PN-2026-001188".to_string(),
                property_type: "land".to_string(),
                status: "pending".to_string(),
                floors: 1,
                height: 12.0,
                land_area: 8400.0,
                grid_x: 2.0,
                grid_z: 6.0,
                width: 2.2,
                depth: 2.0,
                district: "Hadapsar".to_string(),
            },
            MapBuilding {
                id: "prp-004".to_string(),
                name: "Metro Transit Multi-Level Parking".to_string(),
                ulpin: "ULPIN-PN-2026-001090".to_string(),
                property_type: "parking".to_string(),
                status: "verified".to_string(),
                floors: 8,
                height: 28.0,
                land_area: 2900.0,
                grid_x: 6.0,
                grid_z: 3.0,
                width: 1.8,
                depth: 1.5,
                district: "Pune City".to_string(),
            },
            MapBuilding {
                id: "prp-005".to_string(),
                name: "Kothrud Commercial Complex".to_string(),
                ulpin: "ULPIN-PN-2026-001080".to_string(),
                property_type: "building".to_string(),
                status: "conflict".to_string(),
                floors: 10,
                height: 34.0,
                land_area: 2100.0,
                grid_x: 8.0,
                grid_z: 5.0,
                width: 1.5,
                depth: 1.2,
                district: "Kothrud".to_string(),
            },
        ]
    }

    pub fn get_underground_assets() -> Vec<UndergroundAsset> {
        vec![
            UndergroundAsset {
                id: "ug-1".to_string(),
                name: "Trunk Water Main H-18".to_string(),
                kind: "water".to_string(),
                depth: 6.5,
                status: "verified".to_string(),
                path: vec![
                    PathPoint { x: 0.0, z: 1.5 },
                    PathPoint { x: 3.0, z: 1.5 },
                    PathPoint { x: 6.0, z: 2.8 },
                    PathPoint { x: 9.0, z: 2.8 },
                    PathPoint { x: 12.0, z: 4.0 },
                    PathPoint { x: 14.0, z: 4.0 },
                ],
            },
            UndergroundAsset {
                id: "ug-2".to_string(),
                name: "Metro Tunnel Segment T-12".to_string(),
                kind: "metro".to_string(),
                depth: 32.0,
                status: "verified".to_string(),
                path: vec![
                    PathPoint { x: 1.0, z: -0.5 },
                    PathPoint { x: 4.0, z: 1.0 },
                    PathPoint { x: 7.0, z: 2.5 },
                    PathPoint { x: 10.0, z: 4.0 },
                    PathPoint { x: 14.0, z: 5.5 },
                ],
            },
            UndergroundAsset {
                id: "ug-3".to_string(),
                name: "Sewer Trunk SN-88".to_string(),
                kind: "sewer".to_string(),
                depth: 11.0,
                status: "conflict".to_string(),
                path: vec![
                    PathPoint { x: 0.5, z: 6.0 },
                    PathPoint { x: 3.5, z: 6.5 },
                    PathPoint { x: 7.0, z: 7.0 },
                    PathPoint { x: 10.0, z: 8.2 },
                    PathPoint { x: 14.0, z: 9.0 },
                ],
            },
            UndergroundAsset {
                id: "ug-4".to_string(),
                name: "HT Power Cable Corridor".to_string(),
                kind: "power".to_string(),
                depth: 9.0,
                status: "verified".to_string(),
                path: vec![
                    PathPoint { x: 2.0, z: 0.0 },
                    PathPoint { x: 2.0, z: 3.0 },
                    PathPoint { x: 2.0, z: 6.0 },
                    PathPoint { x: 2.0, z: 9.0 },
                ],
            },
            UndergroundAsset {
                id: "ug-5".to_string(),
                name: "Basement Parking P-3".to_string(),
                kind: "parking".to_string(),
                depth: 6.0,
                status: "pending".to_string(),
                path: vec![
                    PathPoint { x: 10.0, z: 7.0 },
                    PathPoint { x: 11.2, z: 7.6 },
                    PathPoint { x: 12.4, z: 7.6 },
                    PathPoint { x: 13.6, z: 8.4 },
                ],
            },
            UndergroundAsset {
                id: "ug-6".to_string(),
                name: "Telecom Duct Bank".to_string(),
                kind: "telecom".to_string(),
                depth: 3.2,
                status: "verified".to_string(),
                path: vec![
                    PathPoint { x: 12.0, z: 0.5 },
                    PathPoint { x: 13.0, z: 2.2 },
                    PathPoint { x: 14.0, z: 4.0 },
                    PathPoint { x: 14.4, z: 6.0 },
                ],
            },
        ]
    }

    pub fn get_dem_tile(seed: i32) -> Vec<f64> {
        (0..100)
            .map(|i| 520.0 + (((seed * 13 + i * 7) % 10) * 8) as f64)
            .collect()
    }
}
