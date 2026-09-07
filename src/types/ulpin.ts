import type { PropertyType } from './property'

export interface ULPINGenerationRequest {
  latitude: number
  longitude: number
  elevation: number
  district: string
  taluka: string
  ward: string
  propertyType: PropertyType
  minElevation: number
  maxElevation: number
  height: number
  footprintArea: number
  volume: number
  notes?: string
}

export interface ULPINResult {
  ulpin: string
  generatedAt: string
  latitude: number
  longitude: number
  propertyType: PropertyType
  district: string
  confidence: number
  sequence: number
}

export interface GenerationStep {
  id: string
  label: string
  description: string
  status: 'completed' | 'current' | 'pending'
}