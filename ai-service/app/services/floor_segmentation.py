from typing import List
from ..models.schemas import FloorSegmentationRequest, FloorSegmentationResponse, SegmentedFloor

class FloorSegmentationService:
    @staticmethod
    def segment_floors(req: FloorSegmentationRequest) -> FloorSegmentationResponse:
        total_height = req.building_height
        num_floors = req.target_floors or max(1, round(total_height / 3.2))
        avg_floor_height = round(total_height / num_floors, 2)
        
        floors: List[SegmentedFloor] = []
        for i in range(num_floors):
            z_min = round(i * avg_floor_height, 2)
            z_max = round((i + 1) * avg_floor_height, 2)
            level = i + 1
            label = "Floor 01" if level == 1 else f"Floor {level:02d}"
            
            floors.append(
                SegmentedFloor(
                    floor_level=level,
                    label=label,
                    z_min=z_min,
                    z_max=z_max,
                    floor_height=avg_floor_height,
                    confidence=round(96.0 + (level % 3) * 1.1, 1)
                )
            )
            
        return FloorSegmentationResponse(
            building_height=total_height,
            total_floors=num_floors,
            floors=floors
        )
