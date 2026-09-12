use geo::{Contains, Coordinate, Polygon};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BoundingBox3D {
    pub min_x: f64,
    pub max_x: f64,
    pub min_y: f64,
    pub max_y: f64,
    pub z_min: f64,
    pub z_max: f64,
}

impl BoundingBox3D {
    pub fn intersects(&self, other: &BoundingBox3D) -> bool {
        let x_overlap = self.min_x <= other.max_x && self.max_x >= other.min_x;
        let y_overlap = self.min_y <= other.max_y && self.max_y >= other.min_y;
        let z_overlap = self.z_min < other.z_max && self.z_max > other.z_min;
        x_overlap && y_overlap && z_overlap
    }

    pub fn volume(&self) -> f64 {
        let dx = (self.max_x - self.min_x).abs();
        let dy = (self.max_y - self.min_y).abs();
        let dz = (self.z_max - self.z_min).abs();
        dx * dy * dz
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GeneratedFloorRange {
    pub floor_number: i32,
    pub label: String,
    pub z_min: f64,
    pub z_max: f64,
    pub height: f64,
}

pub struct GeometryService;

impl GeometryService {
    /// Calculate 3D volume from a 2D area and vertical range [z_min, z_max]
    pub fn calculate_volume(area_2d: f64, z_min: f64, z_max: f64) -> f64 {
        let dz = (z_max - z_min).abs();
        (area_2d * dz).max(0.0)
    }

    /// Extrude building height into vertical floor bands.
    /// Example: Building height = 30m, 10 floors => approx 3m per floor.
    /// Ground floor can optionally have standard retail/lobby clearance (e.g. 3.5m or proportional).
    pub fn generate_floor_ranges(total_height: f64, num_floors: i32) -> Vec<GeneratedFloorRange> {
        if num_floors <= 0 || total_height <= 0.0 {
            return vec![];
        }

        let floor_height = total_height / (num_floors as f64);
        let mut ranges = Vec::with_capacity(num_floors as usize);

        for i in 0..num_floors {
            let z_min = (i as f64) * floor_height;
            let z_max = ((i + 1) as f64) * floor_height;
            let floor_number = i + 1;
            let label = if floor_number == 1 {
                "Floor 01".to_string()
            } else {
                format!("Floor {:02}", floor_number)
            };

            ranges.push(GeneratedFloorRange {
                floor_number,
                label,
                z_min: (z_min * 100.0).round() / 100.0,
                z_max: (z_max * 100.0).round() / 100.0,
                height: (floor_height * 100.0).round() / 100.0,
            });
        }

        ranges
    }

    /// Check whether a 2D point (lat, lon) is contained in a polygon of coordinates.
    pub fn point_in_polygon(point_x: f64, point_y: f64, polygon_coords: &[(f64, f64)]) -> bool {
        if polygon_coords.len() < 3 {
            return false;
        }

        let coords: Vec<Coordinate<f64>> = polygon_coords
            .iter()
            .map(|(x, y)| Coordinate { x: *x, y: *y })
            .collect();

        let line_string = geo::LineString::from(coords);
        let poly = Polygon::new(line_string, vec![]);
        let pt = geo::Point::new(point_x, point_y);

        poly.contains(&pt)
    }

    /// Check if child polygon points are fully inside parent parcel polygon.
    pub fn polygon_contained_in_parcel(
        child_coords: &[(f64, f64)],
        parent_coords: &[(f64, f64)],
    ) -> bool {
        if child_coords.is_empty() || parent_coords.len() < 3 {
            return false;
        }

        // Each vertex of the child must be inside or on boundary of parent
        for &(cx, cy) in child_coords {
            if !Self::point_in_polygon(cx, cy, parent_coords) {
                return false;
            }
        }
        true
    }

    /// Detect vertical airspace overlap between two properties with bounding boxes or vertical ranges
    pub fn check_vertical_overlap(
        prop_a_z_min: f64,
        prop_a_z_max: f64,
        prop_b_z_min: f64,
        prop_b_z_max: f64,
        horizontal_overlap: bool,
    ) -> bool {
        if !horizontal_overlap {
            return false;
        }
        // Vertical interval overlap: max(start) < min(end)
        prop_a_z_min < prop_b_z_max && prop_a_z_max > prop_b_z_min
    }

    /// Detect underground utility buffer breach.
    /// If an underground asset is at depth `asset_depth`, and a building basement
    /// reaches depth `basement_depth` (represented as negative or positive depth),
    /// checks if the buffer distance is violated.
    pub fn check_underground_conflict(
        basement_depth: f64,
        asset_depth: f64,
        horizontal_distance_m: f64,
        statutory_setback_m: f64,
    ) -> bool {
        let depth_delta = (basement_depth.abs() - asset_depth.abs()).abs();
        let depth_overlap = depth_delta < 2.0; // within 2 meters vertically
        let horizontal_breach = horizontal_distance_m < statutory_setback_m;
        depth_overlap && horizontal_breach
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_volume_calculation() {
        let vol = GeometryService::calculate_volume(100.0, 0.0, 3.0);
        assert_eq!(vol, 300.0);
    }

    #[test]
    fn test_floor_generation() {
        let floors = GeometryService::generate_floor_ranges(30.0, 10);
        assert_eq!(floors.len(), 10);
        assert_eq!(floors[0].z_min, 0.0);
        assert_eq!(floors[0].z_max, 3.0);
        assert_eq!(floors[9].z_min, 27.0);
        assert_eq!(floors[9].z_max, 30.0);
        assert_eq!(floors[0].label, "Floor 01");
        assert_eq!(floors[9].label, "Floor 10");
    }

    #[test]
    fn test_point_in_polygon() {
        let parcel = vec![
            (0.0, 0.0),
            (10.0, 0.0),
            (10.0, 10.0),
            (0.0, 10.0),
            (0.0, 0.0),
        ];
        assert!(GeometryService::point_in_polygon(5.0, 5.0, &parcel));
        assert!(!GeometryService::point_in_polygon(15.0, 5.0, &parcel));
    }

    #[test]
    fn test_vertical_overlap() {
        // Floor 4: 12-15m
        // Neighbor cantilever: 14-16m
        assert!(GeometryService::check_vertical_overlap(12.0, 15.0, 14.0, 16.0, true));
        // No overlap
        assert!(!GeometryService::check_vertical_overlap(12.0, 15.0, 15.0, 18.0, true));
        // No horizontal overlap
        assert!(!GeometryService::check_vertical_overlap(12.0, 15.0, 14.0, 16.0, false));
    }

    #[test]
    fn test_underground_conflict() {
        // Basement 7.8m deep, sewer at 7.0m, distance 1.0m, statutory setback 1.8m -> conflict!
        assert!(GeometryService::check_underground_conflict(7.8, 7.0, 1.0, 1.8));
        // Far away horizontally -> safe
        assert!(!GeometryService::check_underground_conflict(7.8, 7.0, 5.0, 1.8));
    }
}
