import { useCallback, useEffect, useState } from 'react'
import { getProperties } from '../services/propertyService'
import type { Property, PropertyFilters } from '../types/property'

export function useProperties(filters?: PropertyFilters) {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setError(null)
    try {
      const data = await getProperties(filters)
      setProperties(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load properties')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [load])

  return { properties, loading, error, reload: load }
}