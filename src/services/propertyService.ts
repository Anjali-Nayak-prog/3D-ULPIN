import {
  properties,
  getPropertyById as findPropertyById,
  getPropertyByULPIN as findPropertyByULPIN,
} from '../data/propertiesData'
import type { Property, PropertyFilters } from '../types/property'
import { api, apiOrMock } from './api'

export async function getProperties(
  filters?: PropertyFilters,
): Promise<Property[]> {
  return apiOrMock(
    api.get('/properties', { params: filters }),
    () => {
      let result = [...properties]
      if (!filters) return result

      const q = filters.query?.toLowerCase()
      if (q) {
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.ulpin.toLowerCase().includes(q) ||
            p.owner.name.toLowerCase().includes(q) ||
            p.address.toLowerCase().includes(q) ||
            p.land?.surveyNumber.toLowerCase().includes(q),
        )
      }
      if (filters.type && filters.type !== 'all') {
        result = result.filter((p) => p.type === filters.type)
      }
      if (filters.status && filters.status !== 'all') {
        result = result.filter((p) => p.status === filters.status)
      }
      if (filters.district) {
        result = result.filter((p) => p.district === filters.district)
      }
      if (filters.maxFloors && filters.maxFloors > 0) {
        result = result.filter((p) => (p.building?.floors ?? 1) <= filters.maxFloors!)
      }
      return result
    },
  )
}

export async function getPropertyById(id: string): Promise<Property> {
  return apiOrMock(
    api.get(`/properties/${id}`),
    () => {
      const found = findPropertyById(id)
      if (!found) throw new Error(`Property ${id} not found`)
      return found
    },
  )
}

export async function getPropertyByULPIN(ulpin: string): Promise<Property> {
  return apiOrMock(
    api.get(`/properties/ulpin/${ulpin}`),
    () => {
      const found = findPropertyByULPIN(ulpin)
      if (!found) throw new Error(`Property ${ulpin} not found`)
      return found
    },
  )
}

export async function updatePropertyStatus(
  id: string,
  status: Property['status'],
): Promise<Property> {
  return apiOrMock(
    api.patch(`/properties/${id}`, { status }),
    () => {
      const prop = findPropertyById(id)
      if (!prop) throw new Error(`Property ${id} not found`)
      return { ...prop, status }
    },
  )
}