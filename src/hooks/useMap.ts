import { useEffect, useState } from 'react'
import { getMapBuildings, getMapLayers, getUndergroundAssets } from '../services/mapService'
import type {
  MapBuilding,
  MapLayer,
  UndergroundAsset,
} from '../types/map'

export interface MapData {
  layers: MapLayer[]
  buildings: MapBuilding[]
  underground: UndergroundAsset[]
  loading: boolean
}

export function useMap(): MapData {
  const [layers, setLayers] = useState<MapLayer[]>([])
  const [buildings, setBuildings] = useState<MapBuilding[]>([])
  const [underground, setUnderground] = useState<UndergroundAsset[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function loadAll() {
      const [layerData, buildingData, undergroundData] = await Promise.all([
        getMapLayers(),
        getMapBuildings(),
        getUndergroundAssets(),
      ])
      if (mounted) {
        setLayers(layerData)
        setBuildings(buildingData)
        setUnderground(undergroundData)
        setLoading(false)
      }
    }
    void loadAll()
    return () => {
      mounted = false
    }
  }, [])

  return { layers, buildings, underground, loading }
}