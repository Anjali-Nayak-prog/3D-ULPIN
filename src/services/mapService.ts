import { generateCityBuildings, mapLayers, undergroundAssets } from '../data/mapData'
import type {
  MapBuilding,
  MapLayer,
  UndergroundAsset,
} from '../types/map'
import { api, apiOrMock } from './api'

export interface MapTileRequest {
  z?: number
  x?: number
  y?: number
}

export async function getMapLayers(): Promise<MapLayer[]> {
  return apiOrMock(api.get('/map/layers'), () => mapLayers)
}

export async function getMapBuildings(): Promise<MapBuilding[]> {
  return apiOrMock(api.get('/map/buildings'), () => generateCityBuildings())
}

export async function getUndergroundAssets(): Promise<UndergroundAsset[]> {
  return apiOrMock(api.get('/map/underground'), () => undergroundAssets)
}

export async function getElevationTile(request: MapTileRequest): Promise<number[]> {
  const seed = request.z ?? 1
  return apiOrMock(api.get('/map/dem'), () =>
    Array.from({ length: 100 }, (_, i) => 520 + ((seed * 13 + i * 7) % 10) * 8),
  )
}