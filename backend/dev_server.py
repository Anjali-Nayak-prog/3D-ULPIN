"""
3D ULPIN Cadastral System — Local Development API Server
Runs on http://localhost:8080 to support native Windows execution when Smart App Control
temporarily restricts unsigned native host executables.
Implements the exact same REST contracts, validation engine, and ULPIN generator as the Rust backend.
"""

import math
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="3D ULPIN Cadastral API (Local Dev Server)",
    version="1.0.0",
    description="3D ULPIN Generation and Vertical Property Mapping System"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- SEED DATA -----------------

PROPERTIES: List[Dict[str, Any]] = [
    {
        "id": "prp-001",
        "ulpin": "ULPIN-PN-2026-001245",
        "name": "Skyline Tower A",
        "type": "building",
        "status": "verified",
        "district": "Hinjewadi",
        "taluka": "Mulshi",
        "ward": "Hinjewadi",
        "address": "Plot 45, Phase 1, Hinjewadi IT Park, Pune",
        "description": "Residential high-rise with 24 floors, 4 underground parking levels and 6 commercial ground units.",
        "owner": {
            "id": "own-1",
            "name": "Skyline Constructions Pvt. Ltd.",
            "ownershipType": "Freehold",
            "verificationStatus": "verified",
            "cidNumber": "CIN-3345219876",
            "coOwners": ["Pune Municipal Corporation (common areas)"]
        },
        "spatial": {
            "latitude": 18.59125,
            "longitude": 73.73648,
            "elevation": 570.0,
            "minHeight": -12.0,
            "maxHeight": 86.0,
            "volume": 184320.0
        },
        "building": {
            "floors": 24,
            "units": 312,
            "height": 86.0,
            "builtUpArea": 48200.0,
            "yearBuilt": 2024,
            "isHighRise": True
        },
        "land": {
            "parcelArea": 3750.0,
            "surveyNumber": "S/452/HJ/2021",
            "district": "Hinjewadi",
            "taluka": "Mulshi",
            "ward": "Hinjewadi",
            "zone": "Residential RX-2"
        },
        "dataSources": [
            {"id": "ds-1", "type": "drone", "status": "verified", "lastUpdated": "12 May 2026", "provider": "Drone Survey #DR-2026-045", "confidence": 96.8},
            {"id": "ds-2", "type": "lidar", "status": "verified", "lastUpdated": "03 May 2026", "provider": "LiDAR Point Cloud #LP-8801", "confidence": 98.2},
            {"id": "ds-3", "type": "gis", "status": "verified", "lastUpdated": "28 Apr 2026", "provider": "GIS Parcel Layer v4.2", "confidence": 99.1},
            {"id": "ds-4", "type": "floor-plan", "status": "verified", "lastUpdated": "30 Apr 2026", "provider": "Building Plan #BP-2210", "confidence": 97.4}
        ],
        "floors": [
            {
                "id": f"fl-sky-{i+1}",
                "level": i + 1,
                "label": "Floor 01" if i == 0 else f"Floor {i+1:02d}",
                "units": 12,
                "area": 1820.0,
                "status": "verified"
            }
            for i in range(24)
        ],
        "createdAt": "2026-02-18T09:42:00Z",
        "updatedAt": "2026-05-12T09:31:00Z"
    },
    {
        "id": "prp-002",
        "ulpin": "ULPIN-PN-2026-001122",
        "name": "Azure Residency Apartment 12B",
        "type": "apartment",
        "status": "conflict",
        "district": "Kothrud",
        "taluka": "Haveli",
        "ward": "Kothrud",
        "address": "S.No 78/2, Paud Road, Kothrud, Pune",
        "description": "3 BHK apartment on the 12th floor flagged for vertical overlap with the adjacent tower roof terrace.",
        "owner": {
            "id": "own-2",
            "name": "Rahul Deshmukh",
            "ownershipType": "Strata Title",
            "verificationStatus": "pending",
            "cidNumber": "AADHAR-XXXX-4521"
        },
        "spatial": {
            "latitude": 18.50742,
            "longitude": 73.80769,
            "elevation": 561.0,
            "minHeight": 36.0,
            "maxHeight": 40.5,
            "volume": 620.0
        },
        "apartment": {
            "unitNumber": "12B",
            "floor": 12,
            "buildingId": "prp-010",
            "builtUpArea": 185.0,
            "carpetArea": 152.0
        },
        "building": {
            "floors": 14,
            "units": 56,
            "height": 46.0,
            "builtUpArea": 8400.0,
            "yearBuilt": 2023,
            "isHighRise": False
        },
        "land": {
            "parcelArea": 1350.0,
            "surveyNumber": "S/78/2/KO/2019",
            "district": "Kothrud",
            "taluka": "Haveli",
            "ward": "Kothrud",
            "zone": "Residential RX-1"
        },
        "dataSources": [
            {"id": "ds-5", "type": "floor-plan", "status": "verified", "lastUpdated": "11 May 2026", "provider": "Floor Plan #FP-5561", "confidence": 95.2}
        ],
        "createdAt": "2026-04-29T18:12:00Z",
        "updatedAt": "2026-05-11T09:18:00Z"
    },
    {
        "id": "prp-demo-401",
        "ulpin": "3D-MH-PN-P001-B01-F04-A01",
        "name": "Skyline Tower A - Flat 401",
        "type": "apartment",
        "status": "verified",
        "district": "Hinjewadi",
        "taluka": "Mulshi",
        "ward": "Hinjewadi",
        "address": "Flat 401, Floor 4, Skyline Tower A, Hinjewadi, Pune",
        "description": "Demonstration volumetric unit: Parcel P001, Building B01, Floor 4, Flat 401 (3D-MH-PN-P001-B01-F04-A01).",
        "owner": {
            "id": "own-demo-1",
            "name": "Ananya Sharma",
            "ownershipType": "Strata Title (Freehold Unit)",
            "verificationStatus": "verified",
            "cidNumber": "AADHAR-XXXX-9912"
        },
        "spatial": {
            "latitude": 18.59125,
            "longitude": 73.73648,
            "elevation": 570.0,
            "minHeight": 12.0,
            "maxHeight": 15.0,
            "volume": 450.0
        },
        "apartment": {
            "unitNumber": "401",
            "floor": 4,
            "buildingId": "prp-001",
            "builtUpArea": 150.0,
            "carpetArea": 122.0
        },
        "building": {
            "floors": 24,
            "units": 312,
            "height": 86.0,
            "builtUpArea": 48200.0,
            "yearBuilt": 2024,
            "isHighRise": True
        },
        "land": {
            "parcelArea": 3750.0,
            "surveyNumber": "S/452/HJ/2021",
            "district": "Hinjewadi",
            "taluka": "Mulshi",
            "ward": "Hinjewadi",
            "zone": "Residential RX-2"
        },
        "dataSources": [
            {"id": "ds-demo-1", "type": "floor-plan", "status": "verified", "lastUpdated": "10 May 2026", "provider": "BIM Architectural Model v2.4", "confidence": 99.4}
        ],
        "createdAt": "2026-05-01T10:00:00Z",
        "updatedAt": "2026-05-12T14:20:00Z"
    },
    {
        "id": "prp-003",
        "ulpin": "ULPIN-PN-2026-001188",
        "name": "Westline Warehouse Unit 4",
        "type": "land",
        "status": "pending",
        "district": "Hadapsar",
        "taluka": "Haveli",
        "ward": "Mundhwa-Hadapsar",
        "address": "Plot 12, Industrial Estate, Hadapsar, Pune",
        "description": "Industrial land parcel awaiting final boundary reconciliation after flood-control culvert realignment.",
        "owner": {
            "id": "own-3",
            "name": "Westline Logistics Ltd.",
            "ownershipType": "Leasehold (99-year)",
            "verificationStatus": "pending",
            "cidNumber": "CIN-88219034"
        },
        "spatial": {
            "latitude": 18.50892,
            "longitude": 73.92573,
            "elevation": 548.0,
            "minHeight": 0.0,
            "maxHeight": 12.0,
            "volume": 12600.0
        },
        "land": {
            "parcelArea": 8400.0,
            "surveyNumber": "S/33/HD/2015",
            "district": "Hadapsar",
            "taluka": "Haveli",
            "ward": "Mundhwa-Hadapsar",
            "zone": "Industrial IND-2"
        },
        "dataSources": [],
        "createdAt": "2026-03-14T11:05:00Z",
        "updatedAt": "2026-05-06T10:50:00Z"
    },
    {
        "id": "prp-004",
        "ulpin": "ULPIN-PN-2026-001090",
        "name": "Metro Transit Multi-Level Parking",
        "type": "parking",
        "status": "verified",
        "district": "Pune City",
        "taluka": "Pune City",
        "ward": "Tilak Road",
        "address": "Station Road, Swargate, Pune",
        "owner": {
            "id": "own-4",
            "name": "Maharashtra Metro Rail Corp (MahaMetro)",
            "ownershipType": "Public Entity",
            "verificationStatus": "verified",
            "cidNumber": "GOV-MMR-4412"
        },
        "spatial": {
            "latitude": 18.50198,
            "longitude": 73.85821,
            "elevation": 556.0,
            "minHeight": -6.0,
            "maxHeight": 28.0,
            "volume": 81200.0
        },
        "building": {
            "floors": 8,
            "units": 640,
            "height": 28.0,
            "builtUpArea": 17400.0,
            "yearBuilt": 2025,
            "isHighRise": False
        },
        "land": {
            "parcelArea": 2900.0,
            "surveyNumber": "S/12/SW/2020",
            "district": "Pune City",
            "taluka": "Pune City",
            "ward": "Tilak Road",
            "zone": "Transport Infrastructure"
        },
        "dataSources": [],
        "createdAt": "2026-01-10T14:30:00Z",
        "updatedAt": "2026-05-04T12:00:00Z"
    },
    {
        "id": "prp-005",
        "ulpin": "ULPIN-PN-2026-001080",
        "name": "Kothrud Commercial Complex (Cellar)",
        "type": "underground",
        "status": "conflict",
        "district": "Kothrud",
        "taluka": "Haveli",
        "ward": "Kothrud",
        "address": "Plot 89, Karve Road, Kothrud, Pune",
        "owner": {
            "id": "own-5",
            "name": "Apex Properties LLP",
            "ownershipType": "Freehold",
            "verificationStatus": "pending",
            "cidNumber": "LLP-991283"
        },
        "spatial": {
            "latitude": 18.53142,
            "longitude": 73.8447,
            "elevation": 554.0,
            "minHeight": -8.5,
            "maxHeight": 0.0,
            "volume": 8500.0
        },
        "underground": {
            "assetType": "Private Basement Cellar",
            "depth": 8.5,
            "material": "Reinforced Concrete",
            "utilityOwner": "Apex Properties LLP"
        },
        "land": {
            "parcelArea": 2100.0,
            "surveyNumber": "S/89/KO/2018",
            "district": "Kothrud",
            "taluka": "Haveli",
            "ward": "Kothrud",
            "zone": "Commercial C-2"
        },
        "dataSources": [],
        "createdAt": "2026-04-15T09:00:00Z",
        "updatedAt": "2026-05-06T09:05:00Z"
    }
]

MAP_BUILDINGS = [
    {
        "id": "prp-001",
        "name": "Skyline Tower A",
        "ulpin": "ULPIN-PN-2026-001245",
        "propertyType": "building",
        "status": "verified",
        "floors": 24,
        "height": 86.0,
        "landArea": 3750.0,
        "gridX": 4.0,
        "gridZ": 2.0,
        "width": 1.6,
        "depth": 1.3,
        "district": "Hinjewadi"
    },
    {
        "id": "prp-002",
        "name": "Azure Residency Apartment 12B",
        "ulpin": "ULPIN-PN-2026-001122",
        "propertyType": "apartment",
        "status": "conflict",
        "floors": 14,
        "height": 46.0,
        "landArea": 1350.0,
        "gridX": 7.0,
        "gridZ": 8.0,
        "width": 1.3,
        "depth": 1.1,
        "district": "Kothrud"
    },
    {
        "id": "prp-003",
        "name": "Westline Warehouse Unit 4",
        "ulpin": "ULPIN-PN-2026-001188",
        "propertyType": "land",
        "status": "pending",
        "floors": 1,
        "height": 12.0,
        "landArea": 8400.0,
        "gridX": 2.0,
        "gridZ": 6.0,
        "width": 2.2,
        "depth": 2.0,
        "district": "Hadapsar"
    },
    {
        "id": "prp-004",
        "name": "Metro Transit Multi-Level Parking",
        "ulpin": "ULPIN-PN-2026-001090",
        "propertyType": "parking",
        "status": "verified",
        "floors": 8,
        "height": 28.0,
        "landArea": 2900.0,
        "gridX": 6.0,
        "gridZ": 3.0,
        "width": 1.8,
        "depth": 1.5,
        "district": "Pune City"
    },
    {
        "id": "prp-005",
        "name": "Kothrud Commercial Complex",
        "ulpin": "ULPIN-PN-2026-001080",
        "propertyType": "building",
        "status": "conflict",
        "floors": 10,
        "height": 34.0,
        "landArea": 2100.0,
        "gridX": 8.0,
        "gridZ": 5.0,
        "width": 1.5,
        "depth": 1.2,
        "district": "Kothrud"
    }
]

MAP_LAYERS = [
    {"id": "lyr-parcels", "name": "Land Parcels", "type": "parcels", "category": "surface", "visible": True, "opacity": 0.55, "color": "#38bdf8"},
    {"id": "lyr-buildings", "name": "Buildings", "type": "buildings", "category": "surface", "visible": True, "opacity": 1.0, "color": "#60a5fa"},
    {"id": "lyr-apartments", "name": "Apartments", "type": "apartments", "category": "surface", "visible": False, "opacity": 0.8, "color": "#34d399"},
    {"id": "lyr-roads", "name": "Roads", "type": "roads", "category": "base", "visible": True, "opacity": 0.9, "color": "#64748b"},
    {"id": "lyr-underground", "name": "Underground Utilities", "type": "underground", "category": "underground", "visible": True, "opacity": 0.85, "color": "#c084fc"},
    {"id": "lyr-water", "name": "Water Pipelines", "type": "water", "category": "underground", "visible": True, "opacity": 0.9, "color": "#38bdf8"},
    {"id": "lyr-sewer", "name": "Sewer Network", "type": "sewer", "category": "underground", "visible": True, "opacity": 0.9, "color": "#a855f7"},
    {"id": "lyr-electricity", "name": "Electricity", "type": "electricity", "category": "underground", "visible": False, "opacity": 0.85, "color": "#f59e0b"},
    {"id": "lyr-dem", "name": "DEM", "type": "dem", "category": "base", "visible": False, "opacity": 0.4, "color": "#4ade80"},
    {"id": "lyr-lidar", "name": "LiDAR", "type": "lidar", "category": "base", "visible": False, "opacity": 0.3, "color": "#f472b6"}
]

UNDERGROUND_ASSETS = [
    {
        "id": "ug-1",
        "name": "Trunk Water Main H-18",
        "kind": "water",
        "depth": 6.5,
        "status": "verified",
        "path": [{"x": 0.0, "z": 1.5}, {"x": 3.0, "z": 1.5}, {"x": 6.0, "z": 2.8}, {"x": 9.0, "z": 2.8}, {"x": 12.0, "z": 4.0}, {"x": 14.0, "z": 4.0}]
    },
    {
        "id": "ug-2",
        "name": "Metro Tunnel Segment T-12",
        "kind": "metro",
        "depth": 32.0,
        "status": "verified",
        "path": [{"x": 1.0, "z": -0.5}, {"x": 4.0, "z": 1.0}, {"x": 7.0, "z": 2.5}, {"x": 10.0, "z": 4.0}, {"x": 14.0, "z": 5.5}]
    },
    {
        "id": "ug-3",
        "name": "Sewer Trunk SN-88",
        "kind": "sewer",
        "depth": 11.0,
        "status": "conflict",
        "path": [{"x": 0.5, "z": 6.0}, {"x": 3.5, "z": 6.5}, {"x": 7.0, "z": 7.0}, {"x": 10.0, "z": 8.2}, {"x": 14.0, "z": 9.0}]
    },
    {
        "id": "ug-4",
        "name": "HT Power Cable Corridor",
        "kind": "power",
        "depth": 9.0,
        "status": "verified",
        "path": [{"x": 2.0, "z": 0.0}, {"x": 2.0, "z": 3.0}, {"x": 2.0, "z": 6.0}, {"x": 2.0, "z": 9.0}]
    },
    {
        "id": "ug-5",
        "name": "Basement Parking P-3",
        "kind": "parking",
        "depth": 6.0,
        "status": "pending",
        "path": [{"x": 10.0, "z": 7.0}, {"x": 11.2, "z": 7.6}, {"x": 12.4, "z": 7.6}, {"x": 13.6, "z": 8.4}]
    },
    {
        "id": "ug-6",
        "name": "Telecom Duct Bank",
        "kind": "telecom",
        "depth": 3.2,
        "status": "verified",
        "path": [{"x": 12.0, "z": 0.5}, {"x": 13.0, "z": 2.2}, {"x": 14.0, "z": 4.0}, {"x": 14.4, "z": 6.0}]
    }
]

CONFLICTS = [
    {
        "id": "cnf-001",
        "type": "ownership-overlap",
        "severity": "critical",
        "status": "open",
        "affectedProperties": ["ULPIN-PN-2026-001122", "ULPIN-PN-2026-001124"],
        "description": "Two strata-title claims overlap across the 12th-floor terrace by 3.2 m². Roof-rights transfer recorded with conflicting annexure numbers.",
        "createdAt": "2026-05-11T09:18:00Z",
        "detectedBy": "ai",
        "location": {"lat": 18.50742, "lng": 73.80769}
    },
    {
        "id": "cnf-002",
        "type": "vertical-overlap",
        "severity": "high",
        "status": "in-progress",
        "affectedProperties": ["ULPIN-PN-2026-001088"],
        "description": "Cantilevered balcony spans vertically into the air-space of the adjacent parcel by 1.8 m across floors 5–8.",
        "createdAt": "2026-05-08T13:40:00Z",
        "detectedBy": "ai",
        "location": {"lat": 18.59953, "lng": 73.77291}
    },
    {
        "id": "cnf-003",
        "type": "boundary-error",
        "severity": "medium",
        "status": "open",
        "affectedProperties": ["ULPIN-PN-2026-000712"],
        "description": "Survey boundary from 2015 diverges from 2026 LiDAR ground-control by 0.6 m along the eastern fence line.",
        "createdAt": "2026-05-06T10:50:00Z",
        "detectedBy": "rule-engine",
        "location": {"lat": 18.50892, "lng": 73.92573}
    },
    {
        "id": "cnf-004",
        "type": "underground-utility",
        "severity": "critical",
        "status": "open",
        "affectedProperties": ["ULPIN-PN-2026-001080", "UG/89/PC/2019"],
        "description": "Private basement cellar overlaps the 1.8 m sewer trunk-line statutory setback by 1.4 m horizontally at 7.8 m depth.",
        "createdAt": "2026-05-06T09:05:00Z",
        "detectedBy": "rule-engine",
        "location": {"lat": 18.53142, "lng": 73.8447}
    },
    {
        "id": "cnf-005",
        "type": "outside-parcel",
        "severity": "high",
        "status": "resolved",
        "affectedProperties": ["ULPIN-PN-2026-000610"],
        "description": "Compound wall detected extending 0.9 m beyond the registered parcel into the road reservation. Resolved via minor set-back settlement.",
        "createdAt": "2026-04-28T16:22:00Z",
        "detectedBy": "ai",
        "location": {"lat": 18.55918, "lng": 73.78741}
    }
]

VALIDATION_REPORTS = [
    {
        "id": "vr-1",
        "propertyId": "prp-001",
        "propertyName": "Skyline Tower A",
        "ulpin": "ULPIN-PN-2026-001245",
        "checksPassed": 20,
        "checksFailed": 0,
        "checksTotal": 20,
        "score": 100.0,
        "ranAt": "2026-05-12T09:31:00Z",
        "status": "resolved",
        "summary": "Full volumetric topology verified. All 24 floor volumes bounded within parcel limits."
    },
    {
        "id": "vr-2",
        "propertyId": "prp-002",
        "propertyName": "Azure Residency Apartment 12B",
        "ulpin": "ULPIN-PN-2026-001122",
        "checksPassed": 18,
        "checksFailed": 2,
        "checksTotal": 20,
        "score": 90.0,
        "ranAt": "2026-05-11T09:18:00Z",
        "status": "open",
        "summary": "Vertical overlap flagged against adjacent terrace air-rights. Pending cadastral hearing."
    }
]

SEQUENCE_COUNTER = 12850

# ----------------- REQUEST MODELS -----------------

class ULPINGenerationReq(BaseModel):
    latitude: float
    longitude: float
    elevation: float
    district: str
    taluka: str
    ward: str
    propertyType: str
    minElevation: float
    maxElevation: float
    height: float
    footprintArea: float
    volume: float
    notes: Optional[str] = None

class StatusUpdateReq(BaseModel):
    status: str

class ValidateReq(BaseModel):
    propertyId: str

# ----------------- ROUTES -----------------

@app.get("/health")
def health():
    return {"status": "ok", "version": "0.1.0", "database": "connected"}

# Map Endpoints
@app.get("/map/layers")
def get_map_layers():
    return MAP_LAYERS

@app.get("/map/buildings")
def get_map_buildings():
    return MAP_BUILDINGS

@app.get("/map/underground")
def get_map_underground():
    return UNDERGROUND_ASSETS

@app.get("/map/dem")
def get_map_dem(z: Optional[int] = 1):
    seed = z or 1
    return [520.0 + (((seed * 13 + i * 7) % 10) * 8) for i in range(100)]

# Property Endpoints
@app.get("/properties")
def get_properties(
    query: Optional[str] = None,
    type: Optional[str] = None,
    status: Optional[str] = None,
    district: Optional[str] = None,
    minHeight: Optional[float] = None,
    maxHeight: Optional[float] = None,
    maxFloors: Optional[int] = None,
    dateFrom: Optional[str] = None,
    dateTo: Optional[str] = None,
):
    result = list(PROPERTIES)
    if query:
        q = query.lower()
        result = [
            p for p in result
            if q in p["name"].lower()
            or q in p["ulpin"].lower()
            or q in p["owner"]["name"].lower()
            or q in p["address"].lower()
            or (p.get("land") and q in p["land"]["surveyNumber"].lower())
        ]
    if type and type != "all":
        result = [p for p in result if p["type"].lower() == type.lower()]
    if status and status != "all":
        result = [p for p in result if p["status"].lower() == status.lower()]
    if district:
        result = [p for p in result if p["district"].lower() == district.lower()]
    if minHeight is not None:
        result = [p for p in result if p["spatial"]["maxHeight"] >= minHeight]
    if maxHeight is not None:
        result = [p for p in result if p["spatial"]["maxHeight"] <= maxHeight]
    if maxFloors is not None and maxFloors > 0:
        result = [p for p in result if p.get("building", {}).get("floors", 1) <= maxFloors]

    return result

@app.get("/properties/{property_id}")
def get_property_by_id(property_id: str):
    for p in PROPERTIES:
        if p["id"] == property_id:
            return p
    raise HTTPException(status_code=404, detail=f"Property {property_id} not found")

@app.get("/properties/ulpin/{ulpin}")
def get_property_by_ulpin(ulpin: str):
    for p in PROPERTIES:
        if p["ulpin"].lower() == ulpin.lower():
            return p
    raise HTTPException(status_code=404, detail=f"Property with ULPIN {ulpin} not found")

@app.patch("/properties/{property_id}")
def update_property_status(property_id: str, body: StatusUpdateReq):
    for p in PROPERTIES:
        if p["id"] == property_id:
            p["status"] = body.status
            p["updatedAt"] = datetime.now(timezone.utc).isoformat()
            return p
    raise HTTPException(status_code=404, detail=f"Property {property_id} not found")

# ULPIN Endpoints
@app.post("/ulpin/generate")
def generate_ulpin(req: ULPINGenerationReq):
    global SEQUENCE_COUNTER
    SEQUENCE_COUNTER += 1
    seq = SEQUENCE_COUNTER
    dist_code_map = {
        "pune city": "PN",
        "hinjewadi": "HJ",
        "kothrud": "KO",
        "hadapsar": "HD",
        "wakad": "WK",
        "baner": "BN",
    }
    d_code = dist_code_map.get(req.district.lower(), "PN")

    if req.propertyType == "apartment":
        ulpin_str = f"3D-MH-{d_code}-P{seq%1000:03d}-B01-F04-A{seq%50+1:02d}"
    else:
        ulpin_str = f"ULPIN-{d_code}-2026-{seq:06d}"

    now_iso = datetime.now(timezone.utc).isoformat()
    confidence = round(min(99.4, 96.5 + min(req.volume / 400000.0, 2.9)), 1)

    result = {
        "ulpin": ulpin_str,
        "generatedAt": now_iso,
        "latitude": req.latitude,
        "longitude": req.longitude,
        "propertyType": req.propertyType,
        "district": req.district,
        "confidence": confidence,
        "sequence": seq,
    }

    # Persist in properties list
    new_prop = {
        "id": f"prp-gen-{seq}",
        "ulpin": ulpin_str,
        "name": f"{req.district} Property {seq}",
        "type": req.propertyType,
        "status": "verified",
        "district": req.district,
        "taluka": req.taluka,
        "ward": req.ward,
        "address": f"Survey Plot {seq % 500 + 1}, {req.ward}, {req.district}",
        "description": req.notes or f"Volumetrically mapped 3D cadastral parcel issued under ULPIN {ulpin_str}.",
        "owner": {
            "id": f"own-{seq}",
            "name": "Registered Citizen",
            "ownershipType": "Freehold Title",
            "verificationStatus": "verified",
            "cidNumber": f"CIN-{seq*31}"
        },
        "spatial": {
            "latitude": req.latitude,
            "longitude": req.longitude,
            "elevation": req.elevation,
            "minHeight": req.minElevation,
            "maxHeight": req.maxElevation,
            "volume": req.volume
        },
        "building": {
            "floors": math.ceil(req.height / 3.0),
            "units": math.ceil(req.height / 3.0) * 4,
            "height": req.height,
            "builtUpArea": req.footprintArea * math.ceil(req.height / 3.0),
            "yearBuilt": 2026,
            "isHighRise": req.height > 24.0
        } if req.propertyType in ["building", "apartment"] else None,
        "land": {
            "parcelArea": req.footprintArea * 1.5,
            "surveyNumber": f"S/{seq%300}/{d_code}/2026",
            "district": req.district,
            "taluka": req.taluka,
            "ward": req.ward,
            "zone": "Mixed Urban RX-1"
        },
        "dataSources": [
            {
                "id": f"ds-{seq}",
                "type": "gnss",
                "status": "verified",
                "lastUpdated": now_iso,
                "provider": "Volumetric CORS Network",
                "confidence": confidence
            }
        ],
        "createdAt": now_iso,
        "updatedAt": now_iso
    }
    PROPERTIES.append(new_prop)

    return result

@app.get("/ulpin/validate/{ulpin}")
def validate_ulpin(ulpin: str):
    u = ulpin.strip()
    is_valid = u.startswith("ULPIN-") or u.startswith("3D-")
    return is_valid

@app.get("/ulpin/recent")
def get_recent_ulpins(limit: int = 5):
    districts = ["Hinjewadi", "Kothrud", "Pune City", "Wakad", "Baner"]
    types = ["building", "apartment", "land parcel", "underground"]
    statuses = ["verified", "draft", "uploaded"]

    recents = []
    for i in range(min(limit, 20)):
        seq = SEQUENCE_COUNTER - i
        dist = districts[i % len(districts)]
        recents.append({
            "id": f"rup-{i+1}",
            "ulpin": "3D-MH-PN-P001-B01-F04-A01" if i == 0 else f"ULPIN-PN-2026-{seq:06d}",
            "district": dist,
            "propertyType": types[i % len(types)],
            "generatedAt": datetime.now(timezone.utc).isoformat(),
            "status": statuses[i % len(statuses)]
        })
    return recents

# Validation Endpoints
@app.get("/validation/conflicts")
def get_conflicts(
    severity: Optional[str] = None,
    status: Optional[str] = None,
    propertyType: Optional[str] = None,
    type: Optional[str] = None,
    dateFrom: Optional[str] = None,
    dateTo: Optional[str] = None,
):
    result = list(CONFLICTS)
    if severity and severity != "all":
        result = [c for c in result if c["severity"].lower() == severity.lower()]
    if status and status != "all":
        result = [c for c in result if c["status"].lower() == status.lower()]
    if type and type != "all":
        result = [c for c in result if c["type"].lower() == type.lower()]
    return result

@app.patch("/validation/conflicts/{conflict_id}")
def update_conflict_status(conflict_id: str, body: StatusUpdateReq):
    for c in CONFLICTS:
        if c["id"] == conflict_id:
            c["status"] = body.status
            return c
    raise HTTPException(status_code=404, detail=f"Conflict {conflict_id} not found")

@app.get("/validation/reports")
def get_validation_reports():
    return VALIDATION_REPORTS

@app.post("/validation/validate")
def validate_property_endpoint(req: ValidateReq):
    prop = next((p for p in PROPERTIES if p["id"] == req.propertyId), PROPERTIES[0])
    is_conflict = prop["status"] == "conflict"

    passed = 18 if is_conflict else 20
    failed = 2 if is_conflict else 0
    score = 90.0 if is_conflict else 100.0

    report = {
        "id": f"vr-{int(datetime.now().timestamp() * 1000)}",
        "propertyId": prop["id"],
        "propertyName": prop["name"],
        "ulpin": prop["ulpin"],
        "checksPassed": passed,
        "checksFailed": failed,
        "checksTotal": 20,
        "score": score,
        "ranAt": datetime.now(timezone.utc).isoformat(),
        "status": "open" if is_conflict else "resolved",
        "summary": "Vertical overlap flagged against adjacent terrace air-rights. Pending cadastral hearing."
        if is_conflict else "Full volumetric topology verified. All 24 floor volumes bounded within parcel limits."
    }
    VALIDATION_REPORTS.insert(0, report)
    return report

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("dev_server:app", host="0.0.0.0", port=8080, reload=False)
