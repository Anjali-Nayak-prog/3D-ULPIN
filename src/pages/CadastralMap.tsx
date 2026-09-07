import { useEffect, useState } from 'react'
import { Box } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { MapViewer } from '../components/map/MapViewer'
import { MapControls } from '../components/map/MapControls'
import { LayerPanel } from '../components/map/LayerPanel'
import { FloorSelector } from '../components/map/FloorSelector'
import { UndergroundToggle } from '../components/map/UndergroundToggle'
import { PropertyPopup } from '../components/map/PropertyPopup'
import { SkeletonCard } from '../components/common/Loading'
import { Button } from '../components/common/Button'
import { useMap } from '../hooks/useMap'
import type { MapLayer, MeasureTool, UndergroundMode, ViewMode } from '../types/map'
import { PROPERTY_TYPE_HEX } from '../utils/constants'

export function CadastralMap() {
  const { layers, buildings, underground, loading } = useMap()
  const [layerState, setLayerState] = useState<MapLayer[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('3d')
  const [undergroundMode, setUndergroundMode] = useState<UndergroundMode>('surface')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null)
  const [measureTool, setMeasureTool] = useState<MeasureTool>(null)

  useEffect(() => {
    if (layers.length > 0) {
      const t = setTimeout(() => setLayerState(layers), 0)
      return () => clearTimeout(t)
    }
  }, [layers])

  const selected = buildings.find((b) => b.id === selectedId) ?? null

  const toggleLayer = (id: string) =>
    setLayerState((list) => list.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)))

  const changeOpacity = (id: string, opacity: number) =>
    setLayerState((list) => list.map((l) => (l.id === id ? { ...l, opacity } : l)))

  const toggleViewMode = () => setViewMode((v) => (v === '2d' ? '3d' : '2d'))
  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen()
    } else {
      void document.querySelector('[data-map-canvas]')?.requestFullscreen()
    }
  }

  if (loading) {
    return (
      <div className="space-y-5">
        <PageHeader title="Cadastral Map" subtitle="Loading spatial services…">
          <span className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-navy-900 px-3 py-1.5 text-[11px] text-slate-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
            Connecting to tile service…
          </span>
        </PageHeader>
        <SkeletonCard rows={8} />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Cadastral Map"
        subtitle="Interactive 2D / 3D map of vertical property volumes"
      >
        <Button variant="outline" size="sm" disabled>
          <Box size={14} />
          Tiles are seeded
        </Button>
      </PageHeader>

      <div className="flex flex-col-reverse gap-5 xl:grid xl:grid-cols-4">
        <div className="space-y-4 xl:col-span-1">
          <LayerPanel layers={layerState} onToggle={toggleLayer} onOpacityChange={changeOpacity} />
          <UndergroundToggle mode={undergroundMode} onChange={setUndergroundMode} />
          {selected ? (
            <FloorSelector
              building={selected}
              selectedFloor={selectedFloor}
              onSelectFloor={setSelectedFloor}
            />
          ) : (
            <p className="rounded-xl border border-dashed border-white/[0.08] bg-navy-900/40 px-4 py-3 text-[11px] leading-5 text-slate-600">
              Select a building on the map to inspect its floor-wise volumes and vertical status.
            </p>
          )}
        </div>

        <div data-map-canvas className="relative min-h-[560px] overflow-hidden rounded-2xl border border-white/[0.07] bg-navy-950 shadow-card xl:col-span-3">
          <MapViewer
            buildings={buildings}
            layers={layerState}
            underground={underground}
            selectedId={selectedId}
            onSelect={setSelectedId}
            viewMode={viewMode}
            undergroundMode={undergroundMode}
            selectedFloor={selectedFloor}
            measureTool={measureTool}
            onMeasured={() => void 0}
          />
          <div className="absolute right-3 top-3 z-10">
            <MapControls
              onHome={() => setSelectedId(null)}
              onZoomIn={() => void 0}
              onZoomOut={() => void 0}
              onRotate={() => void 0}
              onResetView={() => setSelectedId(null)}
              onToggleViewMode={toggleViewMode}
              onFullscreen={toggleFullscreen}
              viewMode={viewMode}
              measureTool={measureTool}
              onMeasureToolChange={setMeasureTool}
            />
          </div>
          <div className="pointer-events-none absolute bottom-3 left-3 z-10 flex flex-wrap items-center gap-2">
            <LegendChip color={PROPERTY_TYPE_HEX.building} label="Building" />
            <LegendChip color={PROPERTY_TYPE_HEX.apartment} label="Apartment" />
            <LegendChip color={PROPERTY_TYPE_HEX.underground} label="Underground" />
            <LegendChip color={PROPERTY_TYPE_HEX.land} label="Land" />
          </div>
          {selected && (
            <div className="absolute bottom-3 right-3 z-10 max-w-[300px]">
              <PropertyPopup building={selected} onClose={() => setSelectedId(null)} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function LegendChip({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-navy-900/80 px-2.5 py-1 text-[10px] font-medium text-slate-400">
      <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}