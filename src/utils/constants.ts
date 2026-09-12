import type { PropertyType } from '../types/property'

export const STATUS_LABELS = {
  verified: 'Verified',
  pending: 'Pending',
  conflict: 'Conflict',
  new: 'New',
} as const

export const STATUS_COLORS = {
  verified: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-400',
    hex: '#10b981',
    solid: 'bg-emerald-500',
  },
  pending: {
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    dot: 'bg-amber-400',
    hex: '#f59e0b',
    solid: 'bg-amber-500',
  },
  conflict: {
    text: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    dot: 'bg-red-400',
    hex: '#ef4444',
    solid: 'bg-red-500',
  },
  new: {
    text: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30',
    dot: 'bg-sky-400',
    hex: '#38bdf8',
    solid: 'bg-sky-500',
  },
} as const

export type StatusKey = keyof typeof STATUS_COLORS

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  land: 'Land Parcel',
  building: 'Building',
  apartment: 'Apartment',
  parking: 'Parking',
  underground: 'Underground Asset',
  infrastructure: 'Infrastructure',
}

export const PROPERTY_TYPE_HEX: Record<PropertyType, string> = {
  land: '#4ade80',
  building: '#60a5fa',
  apartment: '#38bdf8',
  parking: '#f472b6',
  underground: '#c084fc',
  infrastructure: '#f59e0b',
}

export const COORDINATE_SYSTEM = 'WGS 84 / UTM 43N'
export const ELEVATION_DATUM = 'MSL (Mean Sea Level)'

export const CONFLICT_TYPES: Record<string, { label: string; hex: string }> = {
  'ownership-overlap': { label: 'Ownership Overlap', hex: '#ef4444' },
  'vertical-overlap': { label: 'Vertical Overlap', hex: '#f59e0b' },
  'boundary-error': { label: 'Boundary Error', hex: '#eab308' },
  'underground-utility': {
    label: 'Underground Utility Conflict',
    hex: '#a855f7',
  },
  'outside-parcel': { label: 'Building Outside Parcel', hex: '#f97316' },
}

export const CONFLICT_SEVERITY: Record<
  string,
  { label: string; text: string; bg: string; border: string; hex: string }
> = {
  critical: {
    label: 'Critical',
    text: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    hex: '#ef4444',
  },
  high: {
    label: 'High',
    text: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    hex: '#f97316',
  },
  medium: {
    label: 'Medium',
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    hex: '#f59e0b',
  },
  low: {
    label: 'Low',
    text: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30',
    hex: '#38bdf8',
  },
}

export const CONFLICT_STATUS: Record<
  string,
  { label: string; text: string; bg: string; border: string; dot: string }
> = {
  open: {
    label: 'Open',
    text: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    dot: 'bg-red-400',
  },
  'in-progress': {
    label: 'In Progress',
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    dot: 'bg-amber-400',
  },
  resolved: {
    label: 'Resolved',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-400',
  },
  ignored: {
    label: 'Ignored',
    text: 'text-slate-400',
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/30',
    dot: 'bg-slate-400',
  },
}

export const DISTRICTS = [
  'Pune City',
  'Hinjewadi',
  'Kothrud',
  'Hadapsar',
  'Wakad',
  'Baner',
  'Viman Nagar',
  'Kharadi',
  'Aundh',
  'Bibwewadi',
] as const

export const WARDS = [
  'Aundh-Baner',
  'Hinjewadi',
  'Kalas-Visrantwadi',
  'Karve Nagar',
  'Kothrud',
  'Mundhwa-Hadapsar',
  'Tilak Road',
  'Viman Nagar',
  'Wakad',
  'Yerawada-Wadgaon',
] as const

export const TALUKAS = ['Haveli', 'Pune City', 'Mulshi'] as const

export const CHART_COLORS = {
  blue: '#60a5fa',
  indigo: '#818cf8',
  purple: '#c084fc',
  cyan: '#22d3ee',
  emerald: '#34d399',
  green: '#10b981',
  amber: '#fbbf24',
  orange: '#fb923c',
  red: '#f87171',
  pink: '#f472b6',
  slate: '#64748b',
}

export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export const DEMO_MODE: boolean = import.meta.env.VITE_DEMO_MODE === 'true'