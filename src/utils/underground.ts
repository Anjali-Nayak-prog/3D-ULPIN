import type { UndergroundAsset } from '../types/map'

export const UG_KIND_NAMES: Record<UndergroundAsset['kind'], string> = {
  water: 'Water',
  sewer: 'Sewer',
  power: 'Electricity',
  metro: 'Metro',
  parking: 'Parking',
  telecom: 'Telecom',
}

const UG_KIND_CODES: Record<UndergroundAsset['kind'], string> = {
  water: 'WA',
  sewer: 'SW',
  power: 'HT',
  metro: 'MT',
  parking: 'PK',
  telecom: 'TC',
}

export const ugSpatialId = (asset: UndergroundAsset) =>
  `UG-${UG_KIND_CODES[asset.kind]}${Math.round(asset.depth * 10)}-Z${String(Math.round(asset.depth * 10)).padStart(3, '0')}`