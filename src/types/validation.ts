import type { PropertyType } from './property'

export type ConflictType =
  | 'ownership-overlap'
  | 'vertical-overlap'
  | 'boundary-error'
  | 'underground-utility'
  | 'outside-parcel'

export type ConflictSeverity = 'critical' | 'high' | 'medium' | 'low'

export type ConflictStatus = 'open' | 'in-progress' | 'resolved' | 'ignored'

export interface ValidationReport {
  id: string
  propertyId: string
  propertyName: string
  ulpin: string
  checksPassed: number
  checksFailed: number
  checksTotal: number
  score: number
  ranAt: string
  status: ConflictStatus
  summary: string
}

export interface Conflict {
  id: string
  type: ConflictType
  severity: ConflictSeverity
  status: ConflictStatus
  affectedProperties: string[]
  description: string
  createdAt: string
  detectedBy: 'ai' | 'rule-engine' | 'manual'
  location?: { lat: number; lng: number }
}

export interface ConflictFilters {
  severity?: ConflictSeverity | 'all'
  status?: ConflictStatus | 'all'
  propertyType?: PropertyType | 'all'
  type?: ConflictType | 'all'
  dateFrom?: string
  dateTo?: string
}