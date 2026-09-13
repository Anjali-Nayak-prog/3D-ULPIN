import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CadastralScene, type CadastralSceneHandle } from '../components/cadastral/CadastralScene'
import {
  MapCameraControls,
  MapHeaderBar,
  MapToolControls,
} from '../components/map/MapControls'
import { LayerPanel } from '../components/map/LayerPanel'
import { FloorSelector } from '../components/map/FloorSelector'
import { UndergroundToggle } from '../components/map/UndergroundToggle'
import { PropertyPopup } from '../components/map/PropertyPopup'
import { UndergroundAssetPopup } from '../components/map/UndergroundAssetPopup'
import { SkeletonCard } from '../components/common/Loading'
import { useMap } from '../hooks/useMap'
import { undergroundAssets } from '../data/mapData'
import { resolveSpatialTarget } from '../data/spatialData'
import type { MapLayer, MeasureTool, UndergroundAsset, UndergroundMode } from '../types/map'

export function CadastralMap() {
  const { layers, buildings, underground, loading } = useMap()
  const [layerState, setLayerState] = useState<MapLayer[]>([])
  const [undergroundMode, setUndergroundMode] = useState<UndergroundMode>('surface')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedAsset, setSelectedAsset] = useState<UndergroundAsset | null>(null)
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null)
  const [measureTool, setMeasureTool] = useState<MeasureTool>(null)
  const [layerPanelOpen, setLayerPanelOpen] = useState(true)
  const sceneRef = useRef<CadastralSceneHandle>(null)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    if (layers.length > 0) {
      const t = setTimeout(() => setLayerState(layers), 0)
      return () => clearTimeout(t)
    }
  }, [layers])

  const locate = searchParams.get('locate')
  const selectParam = searchParams.get('select')
  useEffect(() => {
    const target = locate ?? selectParam
    if (!target || buildings.length === 0) return
    const resolved = resolveSpatialTarget(target)
    if (!resolved) return
    const t = setTimeout(() => {
      if (resolved.assetId) {
        const asset = undergroundAssets.find((a) => a.id === resolved.assetId) ?? null
        setSelectedAsset(asset)
        setSelectedId(null)
        setSelectedFloor(null)
        if (asset) setUndergroundMode(asset.kind === 'metro' ? 'combined' : 'underground')
        return
      }
      if (resolved.buildingId) {
        const explicitFloor = searchParams.get('floor')
        const level =
          explicitFloor !== null && explicitFloor !== '' ? Number(explicitFloor) : (resolved.floor ?? null)
        setSelectedId(resolved.buildingId)
        setSelectedFloor(level !== null && !Number.isNaN(level) ? level - 1 : null)
        setSelectedAsset(null)
      }
    }, 0)
    return () => clearTimeout(t)
  }, [locate, selectParam, searchParams, buildings])

  const selected = buildings.find((b) => b.id === selectedId) ?? null

  const toggleLayer = (id: string) =>
    setLayerState((list) => list.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)))

  const changeOpacity = (id: string, opacity: number) =>
    setLayerState((list) => list.map((l) => (l.id === id ? { ...l, opacity } : l)))

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
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-card">
          <p className="text-sm font-semibold text-slate-900">3D Cadastral Map</p>
          <p className="text-[11px] text-slate-500">Connecting to spatial services…</p>
        </div>
        <SkeletonCard rows={8} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <MapHeaderBar onFullscreen={toggleFullscreen} />

      <div className="flex flex-col-reverse gap-4 xl:grid xl:grid-cols-4">
        <div className="space-y-4 xl:col-span-1">
          {layerPanelOpen ? (
            <div className="animate-fade-in">
              <LayerPanel layers={layerState} onToggle={toggleLayer} onOpacityChange={changeOpacity} />
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-slate-200 bg-white/60 px-4 py-3 text-[11px] leading-5 text-slate-500">
              Layer panel hidden. Use the <span className="font-semibold text-primary-600">Layers</span> tool on
              the map to reopen it.
            </p>
          )}
          <UndergroundToggle mode={undergroundMode} onChange={setUndergroundMode} />

          {selected ? (
            <FloorSelector
              building={selected}
              selectedFloor={selectedFloor}
              onSelectFloor={setSelectedFloor}
            />
          ) : (
            <p className="rounded-xl border border-dashed border-slate-200 bg-white/60 px-4 py-3 text-[11px] leading-5 text-slate-600">
              Select a building on the map to inspect its floor-wise volumes and vertical status.
            </p>
          )}
        </div>

        <div
          data-map-canvas
          className="relative min-h-[560px] overflow-hidden rounded-2xl border border-slate-200 bg-navy-950 shadow-card xl:col-span-3"
        >
          <CadastralScene
            ref={sceneRef}
            mode="interactive"
            buildings={buildings}
            layers={layerState}
            underground={underground}
            selectedId={selectedId}
            onSelect={(id) => {
              setSelectedId(id)
              setSelectedAsset(null)
              if (!id) setSelectedFloor(null)
            }}
            onAssetSelect={(asset) => {
              setSelectedAsset(asset)
              if (asset) setSelectedId(null)
            }}
            undergroundMode={undergroundMode}
            selectedFloor={selectedFloor}
            measureTool={measureTool}
            className="h-[540px] w-full rounded-xl xl:h-[620px]"
          />

          {/* Camera group — top right */}
          <div className="absolute right-3 top-3 z-10">
            <MapCameraControls
              onHome={() => {
                sceneRef.current?.home()
                setSelectedFloor(null)
                setSelectedAsset(null)
              }}
              onZoomIn={() => sceneRef.current?.zoomIn()}
              onZoomOut={() => sceneRef.current?.zoomOut()}
              onRotate={() => sceneRef.current?.rotate()}
              onReset={() => {
                sceneRef.current?.reset()
                setSelectedFloor(null)
                setSelectedId(null)
                setSelectedAsset(null)
              }}
            />
          </div>

          {/* Tool group — top left */}
          <div className="absolute left-3 top-3 z-10">
            <MapToolControls
              measureTool={measureTool}
              onMeasureToolChange={setMeasureTool}
              layerPanelOpen={layerPanelOpen}
              onToggleLayers={() => setLayerPanelOpen((o) => !o)}
            />
          </div>

          {/* Legend — bottom left */}
          <div className="absolute bottom-3 left-3 z-10">
            <span className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white/90 px-3 py-1.5 shadow-card backdrop-blur-sm">
              <LegendChip color="#10b981" label="Surface" />
              <LegendChip color="#2563eb" label="Vertical" />
              <LegendChip color="#8b5cf6" label="Underground" />
            </span>
          </div>

          {selected && (
            <div className="absolute bottom-3 right-3 z-10 max-w-[300px]">
              <PropertyPopup building={selected} onClose={() => setSelectedId(null)} />
            </div>
          )}

          {!selected && selectedAsset && (
            <div className="absolute bottom-3 right-3 z-10 max-w-[300px]">
              <UndergroundAssetPopup asset={selectedAsset} onClose={() => setSelectedAsset(null)} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function LegendChip({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[10px] font-medium text-slate-600">
      <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}