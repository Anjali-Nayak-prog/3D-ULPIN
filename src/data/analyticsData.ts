import type { PropertyStatus, PropertyType } from '../types/property'

export const propertiesByType: { type: PropertyType; label: string; count: number }[] = [
  { type: 'land', label: 'Land Parcel', count: 3290 },
  { type: 'building', label: 'Building', count: 5231 },
  { type: 'apartment', label: 'Apartment', count: 18492 },
  { type: 'parking', label: 'Parking', count: 1187 },
  { type: 'underground', label: 'Underground', count: 1240 },
  { type: 'infrastructure', label: 'Infrastructure', count: 420 },
]

export const buildingsByHeight = [
  { range: '0–10m', count: 2140 },
  { range: '10–20m', count: 1685 },
  { range: '20–30m', count: 782 },
  { range: '30–50m', count: 424 },
  { range: '50–100m', count: 156 },
  { range: '100m+', count: 44 },
]

export const propertiesByDistrict = [
  { district: 'Pune City', count: 3245 },
  { district: 'Hinjewadi', count: 2145 },
  { district: 'Kothrud', count: 1785 },
  { district: 'Hadapsar', count: 1320 },
  { district: 'Wakad', count: 1102 },
  { district: 'Baner', count: 986 },
  { district: 'Viman Nagar', count: 742 },
  { district: 'Kharadi', count: 689 },
  { district: 'Aundh', count: 431 },
  { district: 'Bibwewadi', count: 305 },
]

export interface VerticalTrendPoint {
  month: string
  buildings: number
  volume: number
}

export const verticalDevelopment: VerticalTrendPoint[] = [
  { month: 'Dec 25', buildings: 4200, volume: 5.6 },
  { month: 'Jan 26', buildings: 4360, volume: 5.9 },
  { month: 'Feb 26', buildings: 4520, volume: 6.2 },
  { month: 'Mar 26', buildings: 4705, volume: 6.6 },
  { month: 'Apr 26', buildings: 4910, volume: 7.1 },
  { month: 'May 26', buildings: 5140, volume: 7.7 },
]

export const ownershipStatus: {
  status: PropertyStatus
  label: string
  count: number
}[] = [
  { status: 'verified', label: 'Verified', count: 7835 },
  { status: 'pending', label: 'Pending', count: 3142 },
  { status: 'new', label: 'New', count: 1449 },
  { status: 'conflict', label: 'Conflict', count: 24 },
]

export const conflictTrend = [
  { month: 'Dec 25', detected: 18, resolved: 11 },
  { month: 'Jan 26', detected: 26, resolved: 19 },
  { month: 'Feb 26', detected: 21, resolved: 16 },
  { month: 'Mar 26', detected: 34, resolved: 29 },
  { month: 'Apr 26', detected: 29, resolved: 30 },
  { month: 'May 26', detected: 24, resolved: 26 },
]

export const undergroundDistribution = [
  { name: 'Water Pipelines', value: 486, color: '#38bdf8' },
  { name: 'Sewer Network', value: 372, color: '#a855f7' },
  { name: 'Electrical Cables', value: 214, color: '#f59e0b' },
  { name: 'Metro Tunnels', value: 52, color: '#f87171' },
  { name: 'Underpasses', value: 68, color: '#34d399' },
  { name: 'Telecom Ducts', value: 48, color: '#818cf8' },
]

export const ulpinGenerationTrend = [
  { month: 'Dec 25', count: 1420 },
  { month: 'Jan 26', count: 1680 },
  { month: 'Feb 26', count: 1512 },
  { month: 'Mar 26', count: 1988 },
  { month: 'Apr 26', count: 2276 },
  { month: 'May 26', count: 2568 },
]

export const propertyDistribution = [
  { name: 'Residential', value: 47.2, color: '#60a5fa' },
  { name: 'Commercial', value: 22.8, color: '#c084fc' },
  { name: 'Industrial', value: 11.6, color: '#f59e0b' },
  { name: 'Government', value: 8.7, color: '#34d399' },
  { name: 'Mixed Use', value: 9.7, color: '#f472b6' },
]