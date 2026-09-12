import uuid
from typing import List
from ..models.schemas import BuildingExtractionRequest, BuildingExtractionResponse, ExtractedBuilding

class BuildingExtractionService:
    @staticmethod
    def extract_buildings(req: BuildingExtractionRequest) -> BuildingExtractionResponse:
        # Deterministic simulation of YOLO / semantic building segmentation
        base_lat = req.latitude
        base_lng = req.longitude
        
        buildings: List[ExtractedBuilding] = [
            ExtractedBuilding(
                building_id="bld-ai-01",
                confidence=97.4,
                footprint_area=1450.0,
                estimated_height=48.0,
                estimated_floors=14,
                polygon_coordinates=[
                    [base_lng, base_lat],
                    [base_lng + 0.0004, base_lat],
                    [base_lng + 0.0004, base_lat + 0.0003],
                    [base_lng, base_lat + 0.0003],
                    [base_lng, base_lat]
                ],
                roof_type="flat"
            ),
            ExtractedBuilding(
                building_id="bld-ai-02",
                confidence=95.8,
                footprint_area=820.0,
                estimated_height=24.0,
                estimated_floors=7,
                polygon_coordinates=[
                    [base_lng + 0.0006, base_lat + 0.0001],
                    [base_lng + 0.0009, base_lat + 0.0001],
                    [base_lng + 0.0009, base_lat + 0.0003],
                    [base_lng + 0.0006, base_lat + 0.0003],
                    [base_lng + 0.0006, base_lat + 0.0001]
                ],
                roof_type="sloped"
            )
        ]
        
        avg_conf = sum(b.confidence for b in buildings) / len(buildings)
        
        return BuildingExtractionResponse(
            batch_id=f"batch-{uuid.uuid4().hex[:8]}",
            buildings_detected=len(buildings),
            average_confidence=round(avg_conf, 1),
            buildings=buildings
        )
