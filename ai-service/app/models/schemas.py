from typing import List, Optional
from pydantic import BaseModel, Field

class BuildingExtractionRequest(BaseModel):
    image_url: Optional[str] = None
    drone_survey_id: Optional[str] = None
    district: str = "Pune City"
    latitude: float = 18.5204
    longitude: float = 73.8567
    resolution_m: float = 0.05

class ExtractedBuilding(BaseModel):
    building_id: str
    confidence: float
    footprint_area: float
    estimated_height: float
    estimated_floors: int
    polygon_coordinates: List[List[float]]
    roof_type: str = "flat"

class BuildingExtractionResponse(BaseModel):
    batch_id: str
    buildings_detected: int
    average_confidence: float
    buildings: List[ExtractedBuilding]

class FloorSegmentationRequest(BaseModel):
    building_height: float
    target_floors: Optional[int] = None
    elevation_datum: str = "MSL"
    ground_elevation: float = 560.0

class SegmentedFloor(BaseModel):
    floor_level: int
    label: str
    z_min: float
    z_max: float
    floor_height: float
    confidence: float

class FloorSegmentationResponse(BaseModel):
    building_height: float
    total_floors: int
    floors: List[SegmentedFloor]

class PointCloudProcessRequest(BaseModel):
    dataset_id: Optional[str] = None
    point_count: int = Field(default=50000, description="Number of points in LiDAR sample")
    crop_bounds: Optional[List[float]] = None

class PointCloudProcessResponse(BaseModel):
    processed_points: int
    ground_plane_elevation: float
    rooftop_max_elevation: float
    vegetation_noise_filtered: int
    facade_clusters_found: int
    confidence: float
