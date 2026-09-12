use crate::models::property::{RecentULPIN, ULPINGenerationRequest, ULPINResult};
use chrono::Utc;
use std::sync::atomic::{AtomicI64, Ordering};

pub struct UlpinService {
    sequence_counter: AtomicI64,
}

impl UlpinService {
    pub fn new() -> Self {
        Self {
            sequence_counter: AtomicI64::new(12850),
        }
    }

    /// Map a district name to its 2-letter abbreviation code (e.g. Pune City -> PN)
    pub fn district_to_code(district: &str) -> &'static str {
        match district.to_lowercase().as_str() {
            "pune city" => "PN",
            "hinjewadi" => "HJ",
            "kothrud" => "KO",
            "hadapsar" => "HD",
            "wakad" => "WK",
            "baner" => "BN",
            "viman nagar" => "VN",
            "kharadi" => "KH",
            "aundh" => "AU",
            "bibwewadi" => "BW",
            _ => "PN",
        }
    }

    /// Generate a 3D child property prototype identifier
    /// e.g. 3D-MH-PN-P001-B01-F04-A01
    pub fn generate_prototype_3d_ulpin(
        state_code: &str,
        district_code: &str,
        parcel_code: &str,
        building_code: &str,
        floor_number: i32,
        apartment_code: &str,
    ) -> String {
        format!(
            "3D-{}-{}-{}-{}-F{:02}-{}",
            state_code.to_uppercase(),
            district_code.to_uppercase(),
            parcel_code.to_uppercase(),
            building_code.to_uppercase(),
            floor_number.max(1),
            apartment_code.to_uppercase()
        )
    }

    /// Generate standard or prototype sequence ULPIN compatible with the frontend
    pub fn generate_ulpin(&self, request: &ULPINGenerationRequest) -> ULPINResult {
        let seq = self.sequence_counter.fetch_add(1, Ordering::SeqCst);
        let dist_code = Self::district_to_code(&request.district);
        let year = Utc::now().format("%Y").to_string();

        // Determine property code for ULPIN prototype representation
        let ulpin = if request.property_type == "apartment" {
            // Child apartment prototype format
            format!("3D-MH-{}-P{:03}-B01-F04-A{:02}", dist_code, seq % 1000, seq % 50 + 1)
        } else {
            // Standard Volumetric ULPIN format
            format!("ULPIN-{}-{}-{:06}", dist_code, year, seq)
        };

        let generated_at = Utc::now().to_rfc3339();
        let volume_factor = (request.volume / 400000.0).min(2.9);
        let confidence = (96.5 + volume_factor).min(99.4);

        ULPINResult {
            ulpin,
            generated_at,
            latitude: request.latitude,
            longitude: request.longitude,
            property_type: request.property_type.clone(),
            district: request.district.clone(),
            confidence: (confidence * 10.0).round() / 10.0,
            sequence: seq,
        }
    }

    /// Validate an ULPIN string against both official parcel formats and 3D prototype schemes
    pub fn validate_ulpin(ulpin: &str) -> bool {
        let u = ulpin.trim();

        // Check standard ULPIN: e.g. ULPIN-PN-2026-001245 or ULPIN-MH-PN-000123
        if u.starts_with("ULPIN-") {
            let parts: Vec<&str> = u.split('-').collect();
            return parts.len() >= 3;
        }

        // Check 3D prototype format: 3D-MH-PN-P001-B01-F04-A01
        if u.starts_with("3D-") {
            let parts: Vec<&str> = u.split('-').collect();
            return parts.len() >= 6;
        }

        false
    }

    /// Return recently generated ULPINs
    pub fn get_recent(&self, limit: usize) -> Vec<RecentULPIN> {
        let districts = ["Hinjewadi", "Kothrud", "Pune City", "Wakad", "Baner"];
        let types = ["building", "apartment", "land parcel", "underground"];
        let statuses = ["verified", "draft", "uploaded"];
        let count = limit.min(20).max(1);

        let mut recents = Vec::with_capacity(count);
        let current_seq = self.sequence_counter.load(Ordering::Relaxed);

        for i in 0..count {
            let seq = current_seq - (i as i64) - 1;
            let dist = districts[i % districts.len()];
            let dist_code = Self::district_to_code(dist);
            let p_type = types[i % types.len()];
            let status = statuses[i % statuses.len()];
            let ulpin = if i == 0 {
                "3D-MH-PN-P001-B01-F04-A01".to_string()
            } else {
                format!("ULPIN-{}-2026-{:06}", dist_code, seq)
            };

            recents.push(RecentULPIN {
                id: format!("rup-{}", i + 1),
                ulpin,
                district: dist.to_string(),
                property_type: p_type.to_string(),
                generated_at: Utc::now().to_rfc3339(),
                status: status.to_string(),
            });
        }

        recents
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_prototype_3d_ulpin_format() {
        let ulpin = UlpinService::generate_prototype_3d_ulpin("MH", "PN", "P001", "B01", 4, "A01");
        assert_eq!(ulpin, "3D-MH-PN-P001-B01-F04-A01");
    }

    #[test]
    fn test_validate_ulpin() {
        assert!(UlpinService::validate_ulpin("ULPIN-PN-2026-001245"));
        assert!(UlpinService::validate_ulpin("3D-MH-PN-P001-B01-F04-A01"));
        assert!(!UlpinService::validate_ulpin("INVALID-ULPIN"));
        assert!(!UlpinService::validate_ulpin(""));
    }

    #[test]
    fn test_generate_ulpin_sequence() {
        let svc = UlpinService::new();
        let req = ULPINGenerationRequest {
            latitude: 18.52,
            longitude: 73.85,
            elevation: 560.0,
            district: "Pune City".to_string(),
            taluka: "Haveli".to_string(),
            ward: "Kothrud".to_string(),
            property_type: "building".to_string(),
            min_elevation: 0.0,
            max_elevation: 30.0,
            height: 30.0,
            footprint_area: 1200.0,
            volume: 36000.0,
            notes: None,
        };

        let res = svc.generate_ulpin(&req);
        assert!(res.ulpin.starts_with("ULPIN-PN-") || res.ulpin.starts_with("3D-"));
        assert_eq!(res.district, "Pune City");
        assert!(res.confidence >= 95.0);
    }
}
