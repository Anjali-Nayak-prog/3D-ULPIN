import type {
  MapBuilding,
  MapLayer,
  UndergroundAsset,
} from '../types/map'
import type { PropertyStatus } from '../types/property'
import {
  cadastralBuildings,
  cadastralUnderground,
  undergroundAssets,
} from './spatialData'

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
    propertyId: 'prp-001',
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
    propertyId: 'prp-007',
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
    propertyId: 'prp-005',
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
    propertyId: 'prp-010',
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
    propertyId: 'prp-012',
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

export { undergroundAssets }

export const cityExtent = { minX: -0.5, maxX: 14.5, minZ: -0.5, maxZ: 10.5 }

export interface CadastralBlock {
  buildings: MapBuilding[]
  underground: UndergroundAsset[]
}

export const SELECTED_PROPERTY_ULPIN = 'IND-PN-1024-V07-8F3A21'

export const cadastralBlockBuildings: MapBuilding[] = cadastralBuildings

export const cadastralBlockUnderground: UndergroundAsset[] = cadastralUnderground

export function getCadastralBlock(): CadastralBlock {
  return {
    buildings: cadastralBlockBuildings,
    underground: cadastralBlockUnderground,
  }
}