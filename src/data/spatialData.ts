import type { MapBuilding, UndergroundAsset } from '../types/map'
import { properties } from './propertiesData'

const FEET3 = 3.2

/**
 * Single shared spatial world.
 *
 * Every surface building volume and every subsurface asset rendered by the
 * Dashboard overview, the 3D Cadastral Map, the Property Search results and the
 * Property Details page resolves back to the canonical `properties` records.
 * IDs and ULPINs therefore match across the whole application instead of
 * living in two disconnected datasets.
 */

/** Plot definitions carved from the cadastral block, each bound to a property record. */
interface SpatialPlot {
  propertyId: string
  buildingId: string
  gridX: number
  gridZ: number
  width: number
  depth: number
}

const surfacePlots: SpatialPlot[] = [
  { propertyId: 'prp-001', buildingId: 'PROP-1020', gridX: 0.5, gridZ: 0.6, width: 1.5, depth: 1.3 },
  { propertyId: 'prp-003', buildingId: 'PROP-1023', gridX: 3.1, gridZ: 0.7, width: 2.2, depth: 1.3 },
  { propertyId: 'prp-005', buildingId: 'PROP-1021', gridX: 6.4, gridZ: 0.7, width: 1.5, depth: 1.3 },
  { propertyId: 'prp-007', buildingId: 'PROP-1022', gridX: 10.4, gridZ: 0.7, width: 1.5, depth: 1.3 },
  { propertyId: 'prp-008', buildingId: 'PROP-1027', gridX: 0.5, gridZ: 3.6, width: 1.5, depth: 1.2 },
  { propertyId: 'prp-010', buildingId: 'PROP-1025', gridX: 6.8, gridZ: 8.1, width: 1.5, depth: 1.3 },
  { propertyId: 'prp-012', buildingId: 'PROP-1026', gridX: 2.1, gridZ: 7.9, width: 1.8, depth: 1.5 },
]

/**
 * The featured vertical-volume showcase block. Unlike the other volumes it is a
 * generated demo artifact (burdened by an IND-PN "3D ULPIN") and intentionally
 * has no property record — it stays aligned with the landing vertical property
 * slice and the auto-highlighted floor in the cadastral scenes.
 */
export const verticalVolumePlot: MapBuilding = {
  id: 'PROP-1024',
  name: 'Vertical Property Volume',
  ulpin: 'IND-PN-1024-V07-8F3A21',
  propertyType: 'building',
  status: 'verified',
  floors: 8,
  height: Number((8 * FEET3).toFixed(1)),
  landArea: 2800,
  gridX: 5.2,
  gridZ: 5.6,
  width: 1.6,
  depth: 1.45,
  district: 'Hinjewadi',
}

function propertyRecord(id: string) {
  return properties.find((p) => p.id === id)
}

/** All surface building volumes rendered by dashboard + map (shared world). */
export const cadastralBuildings: MapBuilding[] = [
  ...surfacePlots.map((plot): MapBuilding => {
    const p = propertyRecord(plot.propertyId)
    if (!p) throw new Error(`spatialData: plot references unknown property ${plot.propertyId}`)
    const floors = p.building?.floors ?? (p.type === 'land' ? 2 : 1)
    const height = p.building?.height ?? floors * FEET3
    return {
      id: plot.buildingId,
      name: p.name,
      ulpin: p.ulpin,
      propertyType: p.type,
      status: p.status,
      floors,
      height: Number(height.toFixed(1)),
      landArea: p.land?.parcelArea ?? 0,
      gridX: plot.gridX,
      gridZ: plot.gridZ,
      width: plot.width,
      depth: plot.depth,
      district: p.district,
      propertyId: p.id,
    }
  }),
  verticalVolumePlot,
]

/**
 * All subsurface assets rendered by the map and the dashboard underground
 * layers. Property-owned utilities link back to their canonical records.
 */
export const undergroundAssets: UndergroundAsset[] = [
  {
    id: 'ug-1',
    name: 'Trunk Water Main H-18',
    kind: 'water',
    depth: 6.5,
    status: 'verified',
    propertyId: 'prp-009',
    path: [{ x: 0, z: 1.5 }, { x: 3, z: 1.5 }, { x: 6, z: 2.8 }, { x: 9, z: 2.8 }, { x: 12, z: 4 }, { x: 14, z: 4 }],
  },
  {
    id: 'ug-2',
    name: 'Metro Tunnel Segment T-12',
    kind: 'metro',
    depth: 32,
    status: 'verified',
    propertyId: 'prp-004',
    path: [{ x: 1, z: -0.5 }, { x: 4, z: 1 }, { x: 7, z: 2.5 }, { x: 10, z: 4 }, { x: 14, z: 5.5 }],
  },
  {
    id: 'ug-3',
    name: 'Sewer Trunk SN-88',
    kind: 'sewer',
    depth: 11,
    status: 'conflict',
    propertyId: 'prp-006',
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
    propertyId: 'prp-008',
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

/** The dashboard + map share the exact same subsurface world. */
export const cadastralUnderground: UndergroundAsset[] = undergroundAssets

/**
 * Resolve a map building volume for a property record, following apartment
 * unit records up to their host tower.
 */
export function buildingForPropertyId(propertyId: string): MapBuilding | null {
  const record = propertyRecord(propertyId)
  const hostId = record?.type === 'apartment' && record.apartment ? record.apartment.buildingId : propertyId
  if (!hostId) return null
  return cadastralBuildings.find((b) => b.propertyId === hostId) ?? null
}

export interface SpatialTarget {
  buildingId?: string
  assetId?: string
  floor?: number | null
}

/**
 * Normalize any locator — ULPIN, property id, building id, building name,
 * asset id or asset name — into a concrete building/asset + optional floor
 * on the shared map. Used by every "Open on 3D map" entry point.
 */
export function resolveSpatialTarget(target: string): SpatialTarget | null {
  const query = target.trim().toLowerCase()
  if (!query) return null

  const building = cadastralBuildings.find(
    (b) =>
      b.id.toLowerCase() === query ||
      b.ulpin.toLowerCase() === query ||
      b.propertyId?.toLowerCase() === query ||
      b.name.toLowerCase().includes(query),
  )
  if (building) return { buildingId: building.id }

  const property = properties.find(
    (p) => p.ulpin.toLowerCase() === query || p.id.toLowerCase() === query,
  )
  if (property) {
    if (property.type === 'apartment' && property.apartment) {
      const host = buildingForPropertyId(property.apartment.buildingId)
      return host ? { buildingId: host.id, floor: property.apartment.floor } : null
    }
    const host = buildingForPropertyId(property.id)
    if (host && property.type !== 'underground') {
      return { buildingId: host.id }
    }
    const asset = undergroundAssets.find((a) => a.propertyId === property.id)
    if (asset) return { assetId: asset.id }
  }

  const asset = undergroundAssets.find(
    (a) => a.id.toLowerCase() === query || a.name.toLowerCase().includes(query),
  )
  if (asset) return { assetId: asset.id }

  return null
}