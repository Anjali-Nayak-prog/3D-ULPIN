# 3D ULPIN Generation & Vertical Property Mapping System

A full-stack 3D cadastral property management and volumetric ULPIN issuance system. Extends traditional 2D land parcel cadastres into the 3D domain ($X + Y + Z$) to represent buildings, floors, apartments, and underground infrastructure assets with high-precision topology validation and conflict detection.

---

## Architecture Overview

```
Frontend (React 19 + TypeScript + Vite)
    │
    │ HTTP / JSON (Axios, Base URL: http://localhost:8080)
    ▼
Rust Axum Backend (Port 8080)
    ├── Map & Layer Service
    ├── 3D Property & Parcel Service
    ├── Prototype 3D ULPIN Generator (e.g., 3D-MH-PN-P001-B01-F04-A01)
    ├── 10-Point 3D Cadastral & Topology Validation Engine
    ├── 2D Footprint to 3D Volumetric Extrusion Service
    ├── OpenAPI / Swagger UI (/swagger-ui/)
    │
    ├── PostgreSQL 16 + PostGIS 3.4 (Port 5432)
    │     ├── parcels, buildings, floors, properties
    │     ├── underground_assets, conflicts, validation_reports
    │     └── spatial indexes (GIST)
    │
    └── Python AI Service (FastAPI, Port 8000)
          ├── Building Footprint Extraction (/ai/building/extract)
          ├── Vertical Floor Segmentation (/ai/floor/segment)
          └── LiDAR Point Cloud Filtering (/ai/pointcloud/process)
```

---

## ULPIN Format & Hierarchy

> [!NOTE]
> Official government **ULPIN** (Unique Land Parcel Identification Number) represents the 2D parent parcel boundary (e.g., `ULPIN-PN-2026-001245`).
> This system generates prototype child 3D volumetric identities without modifying official 2D parcel definitions:
>
> **Prototype Format:** `3D-{State}-{District}-{Parcel}-{Building}-{Floor}-{Apartment}`
> **Example:** `3D-MH-PN-P001-B01-F04-A01`
> - Parent Parcel: `P001` (`ULPIN-PN-000123`)
> - Building: `B01` (`Skyline Tower A`)
> - Floor: `F04` (`Floor 04`, $Z \in [12\text{m}, 15\text{m}]$)
> - Apartment: `A01` (Flat 401, $V = 450\text{ m}^3$)
>
> 3D geometry coordinates are stored separately in PostGIS.

---

## API Endpoints Catalog

### Map & Spatial Visualization
| Method | Endpoint | Description | Response Model |
| --- | --- | --- | --- |
| `GET` | `/health` | Health check & database connection status | `{ status, version, database }` |
| `GET` | `/map/layers` | Cadastral map layer visibility & opacity metadata | `MapLayer[]` |
| `GET` | `/map/buildings` | Landmark & grid buildings with heights and floors | `MapBuilding[]` |
| `GET` | `/map/underground` | Underground utilities (water, sewer, metro, power) | `UndergroundAsset[]` |
| `GET` | `/map/dem` | Digital Elevation Model grid tile | `number[]` |

### Property Management
| Method | Endpoint | Description | Parameters / Body | Response Model |
| --- | --- | --- | --- | --- |
| `GET` | `/properties` | Query & filter volumetric properties | `query, type, status, district, minHeight, maxHeight, maxFloors` | `Property[]` |
| `GET` | `/properties/{id}` | Retrieve property by internal ID | `id` in path | `Property` |
| `GET` | `/properties/ulpin/{ulpin}` | Retrieve property by ULPIN / 3D ID | `ulpin` in path | `Property` |
| `PATCH` | `/properties/{id}` | Update property verification status | `{ status: string }` | `Property` |

### 3D ULPIN Issuance
| Method | Endpoint | Description | Body | Response Model |
| --- | --- | --- | --- | --- |
| `POST` | `/ulpin/generate` | Generate & persist volumetric 3D ULPIN | `ULPINGenerationRequest` | `ULPINResult` |
| `GET` | `/ulpin/validate/{ulpin}` | Validate official or prototype ULPIN | `ulpin` in path | `boolean` |
| `GET` | `/ulpin/recent` | List recently generated ULPINs | `limit?: number` | `RecentULPIN[]` |

### 3D Validation Engine & Conflicts
| Method | Endpoint | Description | Parameters / Body | Response Model |
| --- | --- | --- | --- | --- |
| `GET` | `/validation/conflicts` | List cadastral conflicts | `severity, status, type, dateFrom, dateTo` | `Conflict[]` |
| `PATCH` | `/validation/conflicts/{id}` | Update conflict status (`resolved`, `ignored`) | `{ status: string }` | `Conflict` |
| `GET` | `/validation/reports` | List historical validation reports | — | `ValidationReport[]` |
| `POST` | `/validation/validate` | Run 10-point topology check on property | `{ propertyId: string }` | `ValidationReport` |

### Python AI Processing Service (Port 8000)
| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | AI service health check |
| `POST` | `/ai/building/extract` | Extract rooftop footprints from aerial surveys |
| `POST` | `/ai/floor/segment` | Estimate floor counts, elevations & vertical slices |
| `POST` | `/ai/pointcloud/process` | LiDAR ground, rooftop, and facade classification |

---

## 10-Point 3D Validation Engine

The backend validation engine checks each 3D property against 10 rigorous cadastral rules:
1. **Parcel Containment**: Verifies horizontal footprint does not breach land parcel boundaries.
2. **Building Centroid Inside Parcel**: Confirms building centroid lies within surveyed parcel coordinates.
3. **Floor Vertical Range Validation**: Enforces $z_{\min} < z_{\max}$, positive non-zero heights.
4. **Apartment Floor-Plane Containment**: Validates apartment unit is assigned to a valid level within building floor heights.
5. **3D Volumetric Overlap Detection**: Detects volumetric collisions against adjoining property envelopes.
6. **Vertical Airspace Encroachment**: Detects cantilevers and terraces protruding into neighboring air rights.
7. **Outside-Parcel Intrusion**: Checks if ancillary structures exceed statutory setbacks or road reservations.
8. **Underground Utility Setback Validation**: Validates substructure depth against sewer, water, and power trunk line buffers.
9. **Geometry & Mesh Topology Integrity**: Validates manifold geometry and coordinate ordering.
10. **Parent Cadastral ULPIN Linkage**: Confirms 3D unit links to an authentic parent land parcel record.

---

## Quick Start Guide

### Option 1: Run with Docker Compose (Recommended for Full Stack)

```bash
# Start PostgreSQL/PostGIS, Rust Backend, and Python AI Service
docker-compose up --build -d

# Check status
docker-compose ps

# Run Frontend
npm install
npm run dev
```

The stack will be available at:
- **Frontend UI**: http://localhost:5173
- **Rust Backend API**: http://localhost:8080
- **Swagger / OpenAPI Documentation**: http://localhost:8080/swagger-ui/
- **Python AI Service**: http://localhost:8000
- **PostgreSQL / PostGIS**: localhost:5432 (`ulpin_db`)

---

### Option 2: Native Local Execution

#### 1. Backend Server
```bash
# To run with Rust / Cargo:
cd backend
cargo run

# Alternatively, run with the included Python dev server runner (native Windows fallback):
python backend/dev_server.py
```

#### 2. Python AI Service
```bash
cd ai-service
pip install -r requirements.txt
uvicorn app.main:app --port 8000
```

#### 3. Frontend
```bash
npm install
npm run dev
```

---

## Switching Frontend Between Demo and Live Mode

The frontend supports seamless switching between local demo mocks and the live full-stack backend via environment variables:

### To run in Live Mode (calling the real backend):
In `.env` or `.env.development`:
```ini
VITE_API_BASE_URL=http://localhost:8080
VITE_DEMO_MODE=false
```
When `VITE_DEMO_MODE=false`, all UI interactions (Property Search, Detail Views, ULPIN Generation, Cadastral Map, Conflict Resolution) execute real HTTP requests against the backend.

### To switch back to Demo Mode:
```ini
VITE_DEMO_MODE=true
```
In Demo Mode, mock datasets in `src/data/` are used with simulated network latency.

---

## Database Schema & Migrations

Migrations are stored in `backend/migrations/`:
- `0001_initial_schema.sql`: Tables for `parcels`, `buildings`, `floors`, `properties`, `underground_assets`, `conflicts`, `validation_reports`, `audit_logs`, and PostGIS spatial indexes (`GIST`).
- `0002_seed_data.sql`: Pune demonstration area seeded with Parcel `P001`, Building `B01`, Floor 4, Flat 401 (`3D-MH-PN-P001-B01-F04-A01`), Azure Residency conflict (`cnf-001`), and underground sewer setback conflict (`cnf-004`).

---

## Running Automated Tests

```bash
# Run Rust unit tests (geometry math, ULPIN generation, validation engine, property service):
cd backend
cargo test

# Run frontend production build validation:
npm run build
```

---

## Git Workflow & Pull Request

All backend implementation has been performed strictly on the `backend` branch branched off `main`:
```bash
git branch --show-current
# Output: backend
```
The branch is clean, tested, and ready for Pull Request review and merge into `main`.