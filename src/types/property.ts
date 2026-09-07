export type PropertyStatus = 'verified' | 'pending' | 'conflict' | 'new'

export type PropertyType =
  | 'land'
  | 'building'
  | 'apartment'
  | 'parking'
  | 'underground'
  | 'infrastructure'

export type DataSourceType =
  | 'drone'
  | 'lidar'
  | 'gis'
  | 'gnss'
  | 'floor-plan'
  | 'survey'

export interface Owner {
  id: string
  name: string
  ownershipType: string
  verificationStatus: PropertyStatus
  cidNumber?: string
  coOwners?: string[]
}

export interface SpatialInfo {
  latitude: number
  longitude: number
  elevation: number
  minHeight: number
  maxHeight: number
  volume: number
}

export interface BuildingInfo {
  floors: number
  units: number
  height: number
  builtUpArea: number
  yearBuilt?: number
  isHighRise?: boolean
}

export interface ApartmentInfo {
  unitNumber: string
  floor: number
  buildingId: string
  builtUpArea: number
  carpetArea: number
}

export interface UndergroundAssetInfo {
  assetType: string
  depth: number
  diameter?: number
  material?: string
  utilityOwner?: string
}

export interface LandInfo {
  parcelArea: number
  surveyNumber: string
  district: string
  taluka: string
  ward: string
  zone: string
}

export interface DataSource {
  id: string
  type: DataSourceType
  status: 'verified' | 'processing' | 'pending'
  lastUpdated: string
  provider: string
  confidence: number
}

export interface Floor {
  id: string
  level: number
  label: string
  units: number
  area: number
  status: PropertyStatus
}

export interface Property {
  id: string
  ulpin: string
  name: string
  type: PropertyType
  status: PropertyStatus
  district: string
  taluka: string
  ward: string
  address: string
  owner: Owner
  spatial: SpatialInfo
  building?: BuildingInfo
  apartment?: ApartmentInfo
  underground?: UndergroundAssetInfo
  land?: LandInfo
  dataSources: DataSource[]
  floors?: Floor[]
  createdAt: string
  updatedAt: string
  description?: string
}

export interface Building extends Property {
  type: 'building'
}

export interface Apartment extends Property {
  type: 'apartment'
  apartment: ApartmentInfo
}

export interface UndergroundAsset extends Property {
  type: 'underground'
  underground: UndergroundAssetInfo
}

export interface PropertyFilters {
  query?: string
  type?: PropertyType | 'all'
  status?: PropertyStatus | 'all'
  district?: string
  minHeight?: number
  maxHeight?: number
  maxFloors?: number
  dateFrom?: string
  dateTo?: string
}