from fastapi import APIRouter
from ..models.schemas import (
    BuildingExtractionRequest, BuildingExtractionResponse,
    FloorSegmentationRequest, FloorSegmentationResponse,
    PointCloudProcessRequest, PointCloudProcessResponse
)
from ..services.building_extraction import BuildingExtractionService
from ..services.floor_segmentation import FloorSegmentationService
from ..services.pointcloud_processor import PointCloudProcessor

router = APIRouter(prefix="/ai", tags=["AI Processing"])

@router.post("/building/extract", response_model=BuildingExtractionResponse)
async def extract_building(request: BuildingExtractionRequest):
    return BuildingExtractionService.extract_buildings(request)

@router.post("/floor/segment", response_model=FloorSegmentationResponse)
async def segment_floor(request: FloorSegmentationRequest):
    return FloorSegmentationService.segment_floors(request)

@router.post("/pointcloud/process", response_model=PointCloudProcessResponse)
async def process_pointcloud(request: PointCloudProcessRequest):
    return PointCloudProcessor.process(request)
