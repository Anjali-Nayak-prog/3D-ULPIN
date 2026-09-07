import { conflicts, validationReports } from '../data/validationData'
import type {
  Conflict,
  ConflictFilters,
  ConflictStatus,
  ValidationReport,
} from '../types/validation'
import { api, apiOrMock } from './api'

export async function getConflicts(
  filters?: ConflictFilters,
): Promise<Conflict[]> {
  return apiOrMock(
    api.get('/validation/conflicts', { params: filters }),
    () => {
      let result = [...conflicts]
      if (!filters) return result
      if (filters.severity && filters.severity !== 'all') {
        result = result.filter((c) => c.severity === filters.severity)
      }
      if (filters.status && filters.status !== 'all') {
        result = result.filter((c) => c.status === filters.status)
      }
      if (filters.type && filters.type !== 'all') {
        result = result.filter((c) => c.type === filters.type)
      }
      if (filters.dateFrom) {
        result = result.filter((c) => c.createdAt >= `${filters.dateFrom!}T00:00:00Z`)
      }
      if (filters.dateTo) {
        result = result.filter((c) => c.createdAt <= `${filters.dateTo!}T23:59:59Z`)
      }
      return result
    },
  )
}

export async function updateConflictStatus(
  id: string,
  status: ConflictStatus,
): Promise<Conflict> {
  return apiOrMock(
    api.patch(`/validation/conflicts/${id}`, { status }),
    () => {
      const conflict = conflicts.find((c) => c.id === id)
      if (!conflict) throw new Error(`Conflict ${id} not found`)
      return { ...conflict, status }
    },
  )
}

export async function getValidationReports(): Promise<ValidationReport[]> {
  return apiOrMock(api.get('/validation/reports'), () => validationReports)
}

export async function validateProperty(propertyId: string): Promise<ValidationReport> {
  return apiOrMock(
    api.post(`/validation/validate`, { propertyId }),
    () => ({
      id: `vr-${Date.now()}`,
      propertyId,
      propertyName: 'Property',
      ulpin: 'ULPIN-PN-2026-000000',
      checksPassed: 19,
      checksFailed: 1,
      checksTotal: 20,
      score: 95,
      ranAt: new Date().toISOString(),
      status: 'in-progress',
      summary: 'Minor boundary deviation flagged for review.',
    }),
  )
}