import type { PropertyStatus, PropertyType } from './property'

export type MapLayerCategory = 'surface' | 'underground' | 'base'

export type MapLayerType =
  | 'parcels'
  | 'buildings'
  | 'apartments'
  | 'roads'
  | 'underground'
  | 'water'
  | 'sewer'
  | 'electricity'
  | 'dem'
  | 'lidar'

export interface MapLayer {
  id: string
  name: string
  type: MapLayerType
  category: MapLayerCategory
  visible: boolean
  opacity: number
  color: string
}

export type ViewMode = '2d' | '3d'
export type UndergroundMode = 'surface' | 'underground' | 'combined'
export type MeasureTool = 'distance' | 'area' | 'height' | null

export interface MapBuilding {
  id: string
  name: string
  ulpin: string
  propertyType: PropertyType
  status: PropertyStatus
  floors: number
  height: number
  landArea: number
  gridX: number
  gridZ: number
  width: number
  depth: number
  district: string
}

export interface UndergroundAsset {
  id: string
  name: string
  kind: 'water' | 'sewer' | 'power' | 'metro' | 'parking' | 'telecom'
  depth: number
  status: PropertyStatus
  path: { x: number; z: number }[]
}

export interface MapLocation {
  id: string
  lat: number
  lng: number
  name: string
  type: PropertyType
  status: PropertyStatus
  height: number
}