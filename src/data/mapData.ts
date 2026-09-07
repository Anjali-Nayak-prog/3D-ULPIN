import type {
  MapBuilding,
  MapLayer,
  UndergroundAsset,
} from '../types/map'
import type { PropertyStatus } from '../types/property'

export const mapLayers: MapLayer[] = [
  { id: 'lyr-parcels', name: 'Land Parcels', type: 'parcels', category: 'surface', visible: true, opacity: 0.55, color: '#38bdf8' },
  { id: 'lyr-buildings', name: 'Buildings', type: 'buildings', category: 'surface', visible: true, opacity: 1, color: '#60a5fa' },
  { id: 'lyr-apartments', name: 'Apartments', type: 'apartments', category: 'surface', visible: false, opacity: 0.8, color: '#34d399' },
  { id: 'lyr-roads', name: 'Roads', type: 'roads', category: 'base', visible: true, opacity: 0.9, color: '#64748b' },
  { id: 'lyr-underground', name: 'Underground Utilities', type: 'underground', category: 'underground', visible: true, opacity: 0.85, color: '#c084fc' },
  { id: 'lyr-water', name: 'Water Pipelines', type: 'water', category: 'underground', visible: true, opacity: 0.9, color: '#38bdf8' },
  { id: 'lyr-sewer', name: 'Sewer Network', type: 'sewer', category: 'underground', visible: true, opacity: 0.9, color: '#a855f7' },
  { id: 'lyr-electricity', name: 'Electricity', type: 'electricity', category: 'underground', visible: false, opacity: 0.85, color: '#f59e0b' },
  { id: 'lyr-dem', name: 'DEM', type: 'dem', category: 'base', visible: false, opacity: 0.4, color: '#4ade80' },
  { id: 'lyr-lidar', name: 'LiDAR', type: 'lidar', category: 'base', visible: false, opacity: 0.3, color: '#f472b6' },
]

function mulberry32(seed: number): () => number {
  let t = seed
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

const STATUS_POOL: PropertyStatus[] = ['verified', 'verified', 'verified', 'pending', 'new', 'conflict']

export function generateCityBuildings(rows = 11, cols = 13): MapBuilding[] {
  const rand = mulberry32(20260520)
  const buildings: MapBuilding[] = []
  let uid = 0
  for (let gz = 0; gz < rows; gz++) {
    for (let gx = 0; gx < cols; gx++) {
      if (rand() < 0.32) continue
      const isHighRise = rand() < 0.18
      const floors = isHighRise ? 12 + Math.floor(rand() * 22) : 1 + Math.floor(rand() * 9)
      const height = floors * 3.2 + rand() * 4
      const width = 0.72 + rand() * 0.5
      const depth = 0.72 + rand() * 0.5
      uid += 1
      buildings.push({
        id: `bld-${uid}`,
        name: `Block ${String.fromCharCode(65 + (uid % 26))}-${uid}`,
        ulpin: `ULPIN-PN-2026-${String(104000 + uid).slice(1)}`,
        propertyType: isHighRise ? 'building' : (rand() < 0.4 ? 'apartment' : 'building'),
        status: STATUS_POOL[Math.floor(rand() * STATUS_POOL.length)],
        floors,
        height: Number(height.toFixed(1)),
        landArea: Math.round(width * depth * 1000),
        gridX: gx,
        gridZ: gz,
        width,
        depth,
        district: 'Pune City',
      })
    }
  }
  return buildings
}

export const landmarkBuildings: MapBuilding[] = [
  {
    id: 'landmark-1',
    name: 'Skyline Tower A',
    ulpin: 'ULPIN-PN-2026-001245',
    propertyType: 'building',
    status: 'verified',
    floors: 24,
    height: 86,
    landArea: 3750,
    gridX: 4,
    gridZ: 2,
    width: 1.6,
    depth: 1.3,
    district: 'Hinjewadi',
  },
  {
    id: 'landmark-2',
    name: 'Baner Commercial Tower B',
    ulpin: 'ULPIN-PN-2026-000954',
    propertyType: 'building',
    status: 'verified',
    floors: 21,
    height: 78,
    landArea: 3100,
    gridX: 9,
    gridZ: 3,
    width: 1.5,
    depth: 1.2,
    district: 'Baner',
  },
  {
    id: 'landmark-3',
    name: 'GreenValley Ph-3 Tower B',
    ulpin: 'ULPIN-PN-2026-001301',
    propertyType: 'building',
    status: 'new',
    floors: 18,
    height: 64,
    landArea: 2650,
    gridX: 2,
    gridZ: 6,
    width: 1.4,
    depth: 1.2,
    district: 'Wakad',
  },
  {
    id: 'landmark-4',
    name: 'Azure Residency Tower',
    ulpin: 'ULPIN-PN-2026-000866',
    propertyType: 'building',
    status: 'verified',
    floors: 14,
    height: 46,
    landArea: 1350,
    gridX: 7,
    gridZ: 8,
    width: 1.3,
    depth: 1.1,
    district: 'Kothrud',
  },
  {
    id: 'landmark-5',
    name: 'Innovation Hub Block-6',
    ulpin: 'ULPIN-PN-2026-001002',
    propertyType: 'building',
    status: 'verified',
    floors: 6,
    height: 21,
    landArea: 4200,
    gridX: 5,
    gridZ: 5,
    width: 1.7,
    depth: 1.4,
    district: 'Hinjewadi',
  },
]

export const undergroundAssets: UndergroundAsset[] = [
  {
    id: 'ug-1',
    name: 'Trunk Water Main H-18',
    kind: 'water',
    depth: 6.5,
    status: 'verified',
    path: [{ x: 0, z: 1.5 }, { x: 3, z: 1.5 }, { x: 6, z: 2.8 }, { x: 9, z: 2.8 }, { x: 12, z: 4 }, { x: 14, z: 4 }],
  },
  {
    id: 'ug-2',
    name: 'Metro Tunnel Segment T-12',
    kind: 'metro',
    depth: 32,
    status: 'verified',
    path: [{ x: 1, z: -0.5 }, { x: 4, z: 1 }, { x: 7, z: 2.5 }, { x: 10, z: 4 }, { x: 14, z: 5.5 }],
  },
  {
    id: 'ug-3',
    name: 'Sewer Trunk SN-88',
    kind: 'sewer',
    depth: 11,
    status: 'conflict',
    path: [{ x: 0.5, z: 6 }, { x: 3.5, z: 6.5 }, { x: 7, z: 7 }, { x: 10, z: 8.2 }, { x: 14, z: 9 }],
  },
  {
    id: 'ug-4',
    name: 'HT Power Cable Corridor',
    kind: 'power',
    depth: 9,
    status: 'verified',
    path: [{ x: 2, z: 0 }, { x: 2, z: 3 }, { x: 2, z: 6 }, { x: 2, z: 9 }],
  },
  {
    id: 'ug-5',
    name: 'Basement Parking P-3',
    kind: 'parking',
    depth: 6,
    status: 'pending',
    path: [{ x: 10, z: 7 }, { x: 11.2, z: 7.6 }, { x: 12.4, z: 7.6 }, { x: 13.6, z: 8.4 }],
  },
  {
    id: 'ug-6',
    name: 'Telecom Duct Bank',
    kind: 'telecom',
    depth: 3.2,
    status: 'verified',
    path: [{ x: 12, z: 0.5 }, { x: 13, z: 2.2 }, { x: 14, z: 4 }, { x: 14.4, z: 6 }],
  },
]

export const cityExtent = { minX: -0.5, maxX: 14.5, minZ: -0.5, maxZ: 10.5 }