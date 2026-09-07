import { generateSequenceULPIN, uid } from '../utils/helpers'
import type { ULPINGenerationRequest, ULPINResult } from '../types/ulpin'
import { api, apiOrMock } from './api'

let sequenceCounter = 12847

export async function generateULPIN(
  request: ULPINGenerationRequest,
): Promise<ULPINResult> {
  return apiOrMock(
    api.post('/ulpin/generate', request),
    () => {
      sequenceCounter += 1
      const generatedAt = new Date().toISOString()
      const confidence =
        96.5 + Math.min(request.volume / 400000, 2.9) + Math.random() * 0.4

      return {
        ulpin: generateSequenceULPIN(
          request.district,
          sequenceCounter,
          new Date().getFullYear(),
        ),
        generatedAt,
        latitude: request.latitude,
        longitude: request.longitude,
        propertyType: request.propertyType,
        district: request.district,
        confidence: Number(confidence.toFixed(1)),
        sequence: sequenceCounter,
      }
    },
  )
}

export async function validateULPIN(ulpin: string): Promise<boolean> {
  return apiOrMock(
    api.get(`/ulpin/validate/${ulpin}`),
    () => /^ULPIN-[A-Z]{2}-\d{4}-\d{7}$/.test(ulpin),
  )
}

export interface RecentULPIN {
  id: string
  ulpin: string
  district: string
  propertyType: string
  generatedAt: string
  status: 'uploaded' | 'draft' | 'verified'
}

export async function getRecentULPINs(limit = 5): Promise<RecentULPIN[]> {
  return apiOrMock(
    api.get('/ulpin/recent', { params: { limit } }),
    () => {
      const types = ['building', 'apartment', 'land parcel', 'underground']
      const statuses: RecentULPIN['status'][] = ['uploaded', 'draft', 'verified']
      return Array.from({ length: limit }, (_, i) => ({
        id: uid('rup'),
        ulpin: generateSequenceULPIN('Pune City', 12420 + i),
        district: ['Hinjewadi', 'Kothrud', 'Pune City', 'Wakad', 'Baner'][i % 5],
        propertyType: types[i % types.length],
        generatedAt: new Date(
          Date.now() - (i + 1) * 1000 * 60 * 40,
        ).toISOString(),
        status: statuses[i % statuses.length],
      }))
    },
  )
}