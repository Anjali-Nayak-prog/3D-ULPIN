use crate::models::floor::FrontendFloor;
use crate::models::property::{
    ApartmentInfo, BuildingInfo, DataSource, LandInfo, Owner, Property, PropertyFilters,
    SpatialInfo, UndergroundAssetInfo,
};
use std::sync::RwLock;

pub struct PropertyService {
    properties: RwLock<Vec<Property>>,
}

impl PropertyService {
    pub fn new() -> Self {
        let seeded = Self::seed_properties();
        Self {
            properties: RwLock::new(seeded),
        }
    }

    pub fn get_all(&self, filters: Option<&PropertyFilters>) -> Vec<Property> {
        let list = self.properties.read().unwrap();
        let mut result = list.clone();

        if let Some(f) = filters {
            if let Some(ref q) = f.query {
                let q_lower = q.to_lowercase();
                if !q_lower.is_empty() {
                    result.retain(|p| {
                        p.name.to_lowercase().contains(&q_lower)
                            || p.ulpin.to_lowercase().contains(&q_lower)
                            || p.owner.name.to_lowercase().contains(&q_lower)
                            || p.address.to_lowercase().contains(&q_lower)
                            || p.land
                                .as_ref()
                                .map(|l| l.survey_number.to_lowercase().contains(&q_lower))
                                .unwrap_or(false)
                    });
                }
            }

            if let Some(ref t) = f.r#type {
                if t != "all" {
                    result.retain(|p| p.property_type.eq_ignore_ascii_case(t));
                }
            }

            if let Some(ref s) = f.status {
                if s != "all" {
                    result.retain(|p| p.status.eq_ignore_ascii_case(s));
                }
            }

            if let Some(ref d) = f.district {
                if !d.is_empty() {
                    result.retain(|p| p.district.eq_ignore_ascii_case(d));
                }
            }

            if let Some(min_h) = f.min_height {
                result.retain(|p| p.spatial.max_height >= min_h);
            }

            if let Some(max_h) = f.max_height {
                result.retain(|p| p.spatial.max_height <= max_h);
            }

            if let Some(max_fl) = f.max_floors {
                if max_fl > 0 {
                    result.retain(|p| {
                        p.building
                            .as_ref()
                            .map(|b| b.floors <= max_fl)
                            .unwrap_or(true)
                    });
                }
            }
        }

        result
    }

    pub fn get_by_id(&self, id: &str) -> Option<Property> {
        let list = self.properties.read().unwrap();
        list.iter().find(|p| p.id == id).cloned()
    }

    pub fn get_by_ulpin(&self, ulpin: &str) -> Option<Property> {
        let list = self.properties.read().unwrap();
        list.iter()
            .find(|p| p.ulpin.eq_ignore_ascii_case(ulpin))
            .cloned()
    }

    pub fn update_status(&self, id: &str, new_status: &str) -> Option<Property> {
        let mut list = self.properties.write().unwrap();
        if let Some(p) = list.iter_mut().find(|p| p.id == id) {
            p.status = new_status.to_string();
            p.updated_at = chrono::Utc::now().to_rfc3339();
            Some(p.clone())
        } else {
            None
        }
    }

    pub fn add_property(&self, prop: Property) {
        let mut list = self.properties.write().unwrap();
        list.push(prop);
    }

    fn seed_properties() -> Vec<Property> {
        vec![
            Property {
                id: "prp-001".to_string(),
                ulpin: "ULPIN-PN-2026-001245".to_string(),
                name: "Skyline Tower A".to_string(),
                property_type: "building".to_string(),
                status: "verified".to_string(),
                district: "Hinjewadi".to_string(),
                taluka: "Mulshi".to_string(),
                ward: "Hinjewadi".to_string(),
                address: "Plot 45, Phase 1, Hinjewadi IT Park, Pune".to_string(),
                owner: Owner {
                    id: "own-1".to_string(),
                    name: "Skyline Constructions Pvt. Ltd.".to_string(),
                    ownership_type: "Freehold".to_string(),
                    verification_status: "verified".to_string(),
                    cid_number: Some("CIN-3345219876".to_string()),
                    co_owners: Some(vec!["Pune Municipal Corporation (common areas)".to_string()]),
                },
                spatial: SpatialInfo {
                    latitude: 18.59125,
                    longitude: 73.73648,
                    elevation: 570.0,
                    min_height: -12.0,
                    max_height: 86.0,
                    volume: 184320.0,
                },
                building: Some(BuildingInfo {
                    floors: 24,
                    units: 312,
                    height: 86.0,
                    built_up_area: 48200.0,
                    year_built: Some(2024),
                    is_high_rise: Some(true),
                }),
                apartment: None,
                underground: None,
                land: Some(LandInfo {
                    parcel_area: 3750.0,
                    survey_number: "S/452/HJ/2021".to_string(),
                    district: "Hinjewadi".to_string(),
                    taluka: "Mulshi".to_string(),
                    ward: "Hinjewadi".to_string(),
                    zone: "Residential RX-2".to_string(),
                }),
                data_sources: vec![
                    DataSource {
                        id: "ds-1".to_string(),
                        source_type: "drone".to_string(),
                        status: "verified".to_string(),
                        last_updated: "12 May 2026".to_string(),
                        provider: "Drone Survey #DR-2026-045".to_string(),
                        confidence: 96.8,
                    },
                    DataSource {
                        id: "ds-2".to_string(),
                        source_type: "lidar".to_string(),
                        status: "verified".to_string(),
                        last_updated: "03 May 2026".to_string(),
                        provider: "LiDAR Point Cloud #LP-8801".to_string(),
                        confidence: 98.2,
                    },
                    DataSource {
                        id: "ds-3".to_string(),
                        source_type: "gis".to_string(),
                        status: "verified".to_string(),
                        last_updated: "28 Apr 2026".to_string(),
                        provider: "GIS Parcel Layer v4.2".to_string(),
                        confidence: 99.1,
                    },
                    DataSource {
                        id: "ds-4".to_string(),
                        source_type: "floor-plan".to_string(),
                        status: "verified".to_string(),
                        last_updated: "30 Apr 2026".to_string(),
                        provider: "Building Plan #BP-2210".to_string(),
                        confidence: 97.4,
                    },
                ],
                floors: Some(
                    (0..24)
                        .map(|i| FrontendFloor {
                            id: format!("fl-sky-{}", i + 1),
                            level: i + 1,
                            label: if i == 0 {
                                "Floor 01".to_string()
                            } else {
                                format!("Floor {:02}", i + 1)
                            },
                            units: 12,
                            area: 1820.0,
                            status: "verified".to_string(),
                        })
                        .collect(),
                ),
                created_at: "2026-02-18T09:42:00Z".to_string(),
                updated_at: "2026-05-12T09:31:00Z".to_string(),
                description: Some("Residential high-rise with 24 floors, 4 underground parking levels and 6 commercial ground units.".to_string()),
            },
            Property {
                id: "prp-002".to_string(),
                ulpin: "ULPIN-PN-2026-001122".to_string(),
                name: "Azure Residency Apartment 12B".to_string(),
                property_type: "apartment".to_string(),
                status: "conflict".to_string(),
                district: "Kothrud".to_string(),
                taluka: "Haveli".to_string(),
                ward: "Kothrud".to_string(),
                address: "S.No 78/2, Paud Road, Kothrud, Pune".to_string(),
                owner: Owner {
                    id: "own-2".to_string(),
                    name: "Rahul Deshmukh".to_string(),
                    ownership_type: "Strata Title".to_string(),
                    verification_status: "pending".to_string(),
                    cid_number: Some("AADHAR-XXXX-4521".to_string()),
                    co_owners: None,
                },
                spatial: SpatialInfo {
                    latitude: 18.50742,
                    longitude: 73.80769,
                    elevation: 561.0,
                    min_height: 36.0,
                    max_height: 40.5,
                    volume: 620.0,
                },
                building: Some(BuildingInfo {
                    floors: 14,
                    units: 56,
                    height: 46.0,
                    built_up_area: 8400.0,
                    year_built: Some(2023),
                    is_high_rise: Some(false),
                }),
                apartment: Some(ApartmentInfo {
                    unit_number: "12B".to_string(),
                    floor: 12,
                    building_id: "prp-010".to_string(),
                    built_up_area: 185.0,
                    carpet_area: 152.0,
                }),
                underground: None,
                land: Some(LandInfo {
                    parcel_area: 1350.0,
                    survey_number: "S/78/2/KO/2019".to_string(),
                    district: "Kothrud".to_string(),
                    taluka: "Haveli".to_string(),
                    ward: "Kothrud".to_string(),
                    zone: "Residential RX-1".to_string(),
                }),
                data_sources: vec![
                    DataSource {
                        id: "ds-5".to_string(),
                        source_type: "floor-plan".to_string(),
                        status: "verified".to_string(),
                        last_updated: "11 May 2026".to_string(),
                        provider: "Floor Plan #FP-5561".to_string(),
                        confidence: 95.2,
                    },
                ],
                floors: None,
                created_at: "2026-04-29T18:12:00Z".to_string(),
                updated_at: "2026-05-11T09:18:00Z".to_string(),
                description: Some("3 BHK apartment on the 12th floor flagged for vertical overlap with the adjacent tower roof terrace.".to_string()),
            },
            Property {
                id: "prp-003".to_string(),
                ulpin: "ULPIN-PN-2026-001188".to_string(),
                name: "Westline Warehouse Unit 4".to_string(),
                property_type: "land".to_string(),
                status: "pending".to_string(),
                district: "Hadapsar".to_string(),
                taluka: "Haveli".to_string(),
                ward: "Mundhwa-Hadapsar".to_string(),
                address: "Plot 12, Industrial Estate, Hadapsar, Pune".to_string(),
                owner: Owner {
                    id: "own-3".to_string(),
                    name: "Westline Logistics Ltd.".to_string(),
                    ownership_type: "Leasehold (99-year)".to_string(),
                    verification_status: "pending".to_string(),
                    cid_number: Some("CIN-88219034".to_string()),
                    co_owners: None,
                },
                spatial: SpatialInfo {
                    latitude: 18.50892,
                    longitude: 73.92573,
                    elevation: 548.0,
                    min_height: 0.0,
                    max_height: 12.0,
                    volume: 12600.0,
                },
                building: None,
                apartment: None,
                underground: None,
                land: Some(LandInfo {
                    parcel_area: 8400.0,
                    survey_number: "S/33/HD/2015".to_string(),
                    district: "Hadapsar".to_string(),
                    taluka: "Haveli".to_string(),
                    ward: "Mundhwa-Hadapsar".to_string(),
                    zone: "Industrial IND-2".to_string(),
                }),
                data_sources: vec![],
                floors: None,
                created_at: "2026-03-14T11:05:00Z".to_string(),
                updated_at: "2026-05-06T10:50:00Z".to_string(),
                description: Some("Industrial land parcel awaiting final boundary reconciliation after flood-control culvert realignment.".to_string()),
            },
            Property {
                id: "prp-004".to_string(),
                ulpin: "ULPIN-PN-2026-001090".to_string(),
                name: "Metro Transit Multi-Level Parking".to_string(),
                property_type: "parking".to_string(),
                status: "verified".to_string(),
                district: "Pune City".to_string(),
                taluka: "Pune City".to_string(),
                ward: "Tilak Road".to_string(),
                address: "Station Road, Swargate, Pune".to_string(),
                owner: Owner {
                    id: "own-4".to_string(),
                    name: "Maharashtra Metro Rail Corp (MahaMetro)".to_string(),
                    ownership_type: "Public Entity".to_string(),
                    verification_status: "verified".to_string(),
                    cid_number: Some("GOV-MMR-4412".to_string()),
                    co_owners: None,
                },
                spatial: SpatialInfo {
                    latitude: 18.50198,
                    longitude: 73.85821,
                    elevation: 556.0,
                    min_height: -6.0,
                    max_height: 28.0,
                    volume: 81200.0,
                },
                building: Some(BuildingInfo {
                    floors: 8,
                    units: 640,
                    height: 28.0,
                    built_up_area: 17400.0,
                    year_built: Some(2025),
                    is_high_rise: Some(false),
                }),
                apartment: None,
                underground: None,
                land: Some(LandInfo {
                    parcel_area: 2900.0,
                    survey_number: "S/12/SW/2020".to_string(),
                    district: "Pune City".to_string(),
                    taluka: "Pune City".to_string(),
                    ward: "Tilak Road".to_string(),
                    zone: "Transport Infrastructure".to_string(),
                }),
                data_sources: vec![],
                floors: None,
                created_at: "2026-01-10T14:30:00Z".to_string(),
                updated_at: "2026-05-04T12:00:00Z".to_string(),
                description: Some("Multi-level park-and-ride facility integrated with the underground metro line 1 interchange.".to_string()),
            },
            Property {
                id: "prp-005".to_string(),
                ulpin: "ULPIN-PN-2026-001080".to_string(),
                name: "Kothrud Commercial Complex (Cellar)".to_string(),
                property_type: "underground".to_string(),
                status: "conflict".to_string(),
                district: "Kothrud".to_string(),
                taluka: "Haveli".to_string(),
                ward: "Kothrud".to_string(),
                address: "Plot 89, Karve Road, Kothrud, Pune".to_string(),
                owner: Owner {
                    id: "own-5".to_string(),
                    name: "Apex Properties LLP".to_string(),
                    ownership_type: "Freehold".to_string(),
                    verification_status: "pending".to_string(),
                    cid_number: Some("LLP-991283".to_string()),
                    co_owners: None,
                },
                spatial: SpatialInfo {
                    latitude: 18.53142,
                    longitude: 73.8447,
                    elevation: 554.0,
                    min_height: -8.5,
                    max_height: 0.0,
                    volume: 8500.0,
                },
                building: None,
                apartment: None,
                underground: Some(UndergroundAssetInfo {
                    asset_type: "Private Basement Cellar".to_string(),
                    depth: 8.5,
                    diameter: None,
                    material: Some("Reinforced Concrete".to_string()),
                    utility_owner: Some("Apex Properties LLP".to_string()),
                }),
                land: Some(LandInfo {
                    parcel_area: 2100.0,
                    survey_number: "S/89/KO/2018".to_string(),
                    district: "Kothrud".to_string(),
                    taluka: "Haveli".to_string(),
                    ward: "Kothrud".to_string(),
                    zone: "Commercial C-2".to_string(),
                }),
                data_sources: vec![],
                floors: None,
                created_at: "2026-04-15T09:00:00Z".to_string(),
                updated_at: "2026-05-06T09:05:00Z".to_string(),
                description: Some("Commercial basement storage cellar infringing on statutory municipal sewer trunk setback line.".to_string()),
            },
            Property {
                id: "prp-demo-401".to_string(),
                ulpin: "3D-MH-PN-P001-B01-F04-A01".to_string(),
                name: "Skyline Tower A - Flat 401".to_string(),
                property_type: "apartment".to_string(),
                status: "verified".to_string(),
                district: "Hinjewadi".to_string(),
                taluka: "Mulshi".to_string(),
                ward: "Hinjewadi".to_string(),
                address: "Flat 401, Floor 4, Skyline Tower A, Hinjewadi, Pune".to_string(),
                owner: Owner {
                    id: "own-demo-1".to_string(),
                    name: "Ananya Sharma".to_string(),
                    ownership_type: "Strata Title (Freehold Unit)".to_string(),
                    verification_status: "verified".to_string(),
                    cid_number: Some("AADHAR-XXXX-9912".to_string()),
                    co_owners: None,
                },
                spatial: SpatialInfo {
                    latitude: 18.59125,
                    longitude: 73.73648,
                    elevation: 570.0,
                    min_height: 12.0,
                    max_height: 15.0,
                    volume: 450.0,
                },
                building: Some(BuildingInfo {
                    floors: 24,
                    units: 312,
                    height: 86.0,
                    built_up_area: 48200.0,
                    year_built: Some(2024),
                    is_high_rise: Some(true),
                }),
                apartment: Some(ApartmentInfo {
                    unit_number: "401".to_string(),
                    floor: 4,
                    building_id: "prp-001".to_string(),
                    built_up_area: 150.0,
                    carpet_area: 122.0,
                }),
                underground: None,
                land: Some(LandInfo {
                    parcel_area: 3750.0,
                    survey_number: "S/452/HJ/2021".to_string(),
                    district: "Hinjewadi".to_string(),
                    taluka: "Mulshi".to_string(),
                    ward: "Hinjewadi".to_string(),
                    zone: "Residential RX-2".to_string(),
                }),
                data_sources: vec![
                    DataSource {
                        id: "ds-demo-1".to_string(),
                        source_type: "floor-plan".to_string(),
                        status: "verified".to_string(),
                        last_updated: "10 May 2026".to_string(),
                        provider: "BIM Architectural Model v2.4".to_string(),
                        confidence: 99.4,
                    },
                ],
                floors: None,
                created_at: "2026-05-01T10:00:00Z".to_string(),
                updated_at: "2026-05-12T14:20:00Z".to_string(),
                description: Some("Demonstration volumetric unit: Parcel P001, Building B01, Floor 4, Flat 401 (3D-MH-PN-P001-B01-F04-A01).".to_string()),
            },
        ]
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_property_filtering() {
        let svc = PropertyService::new();
        let all = svc.get_all(None);
        assert!(all.len() >= 6);

        // Filter by district
        let filters = PropertyFilters {
            query: None,
            r#type: None,
            status: None,
            district: Some("Hinjewadi".to_string()),
            min_height: None,
            max_height: None,
            max_floors: None,
            date_from: None,
            date_to: None,
        };
        let filtered = svc.get_all(Some(&filters));
        assert!(filtered.iter().all(|p| p.district == "Hinjewadi"));
    }

    #[test]
    fn test_get_by_id_and_ulpin() {
        let svc = PropertyService::new();
        let p = svc.get_by_id("prp-001");
        assert!(p.is_some());
        assert_eq!(p.unwrap().name, "Skyline Tower A");

        let demo = svc.get_by_ulpin("3D-MH-PN-P001-B01-F04-A01");
        assert!(demo.is_some());
        assert_eq!(demo.unwrap().name, "Skyline Tower A - Flat 401");
    }

    #[test]
    fn test_update_status() {
        let svc = PropertyService::new();
        let updated = svc.update_status("prp-003", "verified");
        assert!(updated.is_some());
        assert_eq!(updated.unwrap().status, "verified");
    }
}
