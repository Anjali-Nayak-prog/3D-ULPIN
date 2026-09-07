# 3D ULPIN — Vertical Property Mapping System

React + TypeScript frontend for issuing **volumetric ULPINs** (Unique Land Parcel Identification Numbers) that map property volumes across 2D, 3D and underground space, and for resolving vertical ownership conflicts in a modern cadastral register.

> **Note:** This is the demo build. It ships with realistic mock data behind an Axios service layer so it runs standalone — see [Architecture & Data Layer](#architecture--data-layer) for how to connect a live backend.

## Features

### Dashboard
- KPI stat cards (parcels, 3D volumes, buildings, units, underground assets, conflicts)
- Isometric 3D city overview rendered in pure SVG
- Recharts analytics (distribution, height bands, vertical growth trend, underground assets)
- Recent activity, alerts, quick actions and live system status

### Cadastral Map
- Interactive 2D / 3D isometric views of the vertical property graph
- Pan, zoom and measurement tools (distance / area / height)
- Toggleable layers with per-layer opacity
- Underground utilities, metro tunnels and underpasses
- Per-building floor volume inspection and status popups

### Property Search & Details
- Filtered search across ULPIN, owner, district, type, floors and dates
- Grid / list result views
- Detail page with 3D volume preview, spatial envelope, ownership and data-provenance panels

### 3D ULPIN Generator
- Five-step wizard: Location → Property Type → Vertical Extent → Geometry → Issuance
- Live vertical-envelope preview
- Geometric-hash issuance with neighboring-volume checks and conflict gating

### AI Processing
- Automated building extraction and floor segmentation visualizations
- End-to-end processing pipeline timeline (data input → ULPIN generation)

### Validation & Conflicts
- Topology status (horizontal / vertical / boundary / utility / ownership checks)
- Conflict cards with resolve/ignore workflows and validation report runs

### Administration
- Reports (PDF / CSV / XLSX / GeoJSON), notifications, user management
- Fine-grained roles & permissions matrix, immutable audit logs, system settings

## Tech Stack

| Layer | Choice |
| --- | --- |
| UI | React 19 |
| Language | TypeScript (strict) |
| Build tooling | Vite 8 |
| Styling | Tailwind CSS v4 (`@theme` tokens) |
| Routing | React Router v7 |
| Charts | Recharts 3 |
| Icons | lucide-react |
| HTTP | Axios |
| Utilities | clsx |

## Getting Started

**Prerequisites:** Node.js 20+ and npm.

```bash
npm install
npm run dev        # start the Vite dev server -> http://localhost:5173
```

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server with HMR |
| `npm run build` | Type-check (`tsc -b`) then production build via Vite |
| `npm run lint` | Run ESLint |
| `npm run preview` | Serve the production build locally |

## Architecture & Data Layer

The app is **demo-mode by default**: every service call funnels through a single pattern so the UI never knows whether it is talking to a network or a mock.

- `src/services/api.ts` — configured Axios instance (adds `Authorization` header from `localStorage`, clears it on `401`).
- `apiOrMock(request, mockFn)` — if `DEMO_MODE` is on, resolves `mockFn()` after a simulated 450 ms latency; otherwise performs the real HTTP request.
- Mock datasets live in `src/data/` and services in `src/services/` (property, ulpin, map, validation).

### Connecting a real backend

1. Set `DEMO_MODE = false` in `src/utils/constants.ts`.
2. Point the client at your API with the `VITE_API_BASE_URL` environment variable (defaults to `/api`).
3. That's it — no component-level changes required.

## Project Structure

```
src/
├── components/
│   ├── ai/          # AI processing cards, floor segmentation, pipeline timeline
│   ├── common/      # Button, Card, Badge, Modal, Toast, EmptyState, Loading, SearchInput
│   ├── dashboard/   # KPI cards, city overview, charts, activity, alerts
│   ├── layout/      # Sidebar, Header, MainLayout, PageHeader
│   ├── map/         # MapViewer, controls, layer panel, floor selector, popups
│   ├── property/    # Cards, search filters, 3D preview, details, ownership, provenance
│   ├── ulpin/       # 5-step generation wizard
│   └── validation/  # Conflict cards, validation results, topology status
├── data/            # Mock datasets (properties, dashboard, analytics, map, validation)
├── hooks/           # useProperties, useDashboard, useMap
├── pages/           # One module per route
├── services/        # Axios + domain services with apiOrMock
├── types/           # Domain models
└── utils/           # formatters, constants, helpers, isometric projection
```

## Routes

| Path | Page |
| --- | --- |
| `/` | Dashboard |
| `/map` | Cadastral Map |
| `/properties` | Property Search |
| `/properties/:id` | Property Details |
| `/ulpin-generator` | ULPIN Generator |
| `/data-management` | Data Management |
| `/ai-processing` | AI Processing |
| `/validation` | Validation & Conflicts |
| `/analytics` | Analytics |
| `/reports` | Reports |
| `/notifications` | Notifications |
| `/users` | User Management |
| `/roles` | Roles & Permissions |
| `/settings` | System Settings |
| `/audit-logs` | Audit Logs |
| `*` | 404 |

## Development Notes

- **Strict TypeScript**: `verbatimModuleSyntax` requires `import type` for type-only imports; no TS enums (`erasableSyntaxOnly`); `noUnusedLocals` / `noUnusedParameters` are enforced.
- **Design system**: Tailwind v4 theme defined in `src/index.css` via `@theme`. Status semantics: verified = emerald, pending = amber, conflict = red, AI = purple. Dark navy cadastral palette.
- **Mock 3D rendering**: isometric building boxes are computed with `src/utils/isometric.ts` (`isoProject`, `isoBoxGeometry`, `shadeHex`).