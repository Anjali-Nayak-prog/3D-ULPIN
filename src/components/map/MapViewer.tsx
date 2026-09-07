import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { Maximize } from 'lucide-react'
import type {
  MapBuilding,
  MapLayer,
  MeasureTool,
  UndergroundAsset,
  UndergroundMode,
  ViewMode,
} from '../../types/map'
import { STATUS_COLORS } from '../../utils/constants'
import { isoBoxGeometry, isoProject, shadeHex } from '../../utils/isometric'
import { cn } from '../../utils/helpers'

const TILE_2D = 30
const TILE_3D = 34
const HEIGHT_SCALE = 1.1
const EXTENT = { minX: -0.6, maxX: 14.6, minZ: -0.6, maxZ: 10.6 }

const UG_KIND_COLORS: Record<UndergroundAsset['kind'], string> = {
  water: '#38bdf8',
  sewer: '#a855f7',
  power: '#f59e0b',
  metro: '#f87171',
  parking: '#34d399',
  telecom: '#818cf8',
}

const statusBadgeHex: Record<string, string> = {
  verified: STATUS_COLORS.verified.hex,
  pending: STATUS_COLORS.pending.hex,
  conflict: STATUS_COLORS.conflict.hex,
  new: STATUS_COLORS.new.hex,
}

interface MapViewerProps {
  buildings: MapBuilding[]
  layers: MapLayer[]
  underground: UndergroundAsset[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  viewMode: ViewMode
  undergroundMode: UndergroundMode
  selectedFloor: number | null
  measureTool: MeasureTool
  onMeasured?: (label: string) => void
}

export function MapViewer({
  buildings,
  layers,
  underground,
  selectedId,
  onSelect,
  viewMode,
  undergroundMode,
  selectedFloor,
  measureTool,
  onMeasured,
}: MapViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(0.95)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const rotation = 0
  const dragStart = useRef<{ x: number; y: number; px: number; py: number } | null>(null)
  const [measureResult, setMeasureResult] = useState<string | null>(null)

  const origin3d = isoProject(EXTENT.minX, EXTENT.minZ, 0, { tile: TILE_3D, heightScale: HEIGHT_SCALE })
  const corner3d = isoProject(EXTENT.maxX, EXTENT.maxZ, 0, { tile: TILE_3D, heightScale: HEIGHT_SCALE })
  const viewBox3d = `${origin3d.x - 70} ${origin3d.y - 300} ${corner3d.x - origin3d.x + 140} ${corner3d.y - origin3d.y + 340}`
  const viewBox2d = `-50 -50 ${EXTENT.maxX * TILE_2D + 100} ${EXTENT.maxZ * TILE_2D + 100}`

  const centerX = (EXTENT.maxX * TILE_2D + 100) / 2
  const centerY = (EXTENT.maxZ * TILE_2D + 100) / 2

  const layerVisible = useCallback(
    (type: MapLayer['type']) => layers.find((l) => l.type === type)?.visible ?? true,
    [layers],
  )

  const transformGroup = `translate(${pan.x * zoom}, ${pan.y * zoom}) scale(${zoom}) rotate(${rotation} ${centerX} ${centerY})`

  const handlePointerDown = (e: ReactPointerEvent) => {
    if (e.button !== 0) return
    dragStart.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y }
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
  }

  const handlePointerMove = (e: ReactPointerEvent) => {
    if (!dragStart.current) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    setPan({ x: dragStart.current.px + dx, y: dragStart.current.py + dy })
  }

  const handlePointerUp = () => {
    dragStart.current = null
  }

  const handleWheel = (e: React.WheelEvent) => {
    setZoom((z) => Math.min(Math.max(z * (e.deltaY < 0 ? 1.12 : 0.9), 0.4), 2.6))
  }

  const enterFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen()
    } else {
      void containerRef.current?.requestFullscreen()
    }
  }

  const handleBuildingClick = (building: MapBuilding) => {
    onSelect(selectedId === building.id ? null : building.id)
    if (measureTool) {
      const label =
        measureTool === 'height'
          ? `${building.name}: ${building.height} m`
          : measureTool === 'area'
            ? `${building.name}: ${building.landArea.toLocaleString('en-IN')} m²`
            : `${building.name}: ~${(building.width * 4.5).toFixed(1)} m`
      setMeasureResult(label)
      onMeasured?.(label)
    }
  }

  const showUnderground = undergroundMode !== 'surface'
  const showSurface = undergroundMode !== 'underground'

  const segment = (path: { x: number; z: number }[], depth: number) =>
    path
      .map((p) => isoProject(p.x, p.z, -depth, { tile: TILE_3D, heightScale: HEIGHT_SCALE }))
      .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(' ')

  const segment2d = (path: { x: number; z: number }[]) =>
    path.map((p) => `${p.x * TILE_2D},${p.z * TILE_2D}`).join(' ')

  const roadLines2d = [
    '50,-50 50,338',
    '260,-50 260,338',
    '450,-50 450,338',
    '-50,110 470,110',
    '-50,230 470,230',
  ]

  const roadLines3d = underground
    .filter((a) => ['metro', 'water'].includes(a.kind))
    .slice(0, 4)
    .map((a) => segment(a.path, a.depth + 0.5))

  return (
    <div
      ref={containerRef}
      className="bg-grid relative h-[540px] overflow-hidden rounded-xl border border-white/[0.07] bg-navy-950/70"
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <svg
        viewBox={viewMode === '3d' ? viewBox3d : viewBox2d}
        className="h-full w-full cursor-grab touch-none select-none active:cursor-grabbing"
      >
        <g transform={transformGroup}>
          {viewMode === '2d' ? (
            <>
              {layerVisible('roads') &&
                roadLines2d.map((line) => (
                  <polyline
                    key={line}
                    points={line}
                    stroke="rgba(100,116,139,0.55)"
                    strokeWidth={16}
                    strokeLinecap="round"
                    fill="none"
                  />
                ))}

              {layerVisible('parcels') && (
                <g stroke="rgba(56,189,248,0.4)" strokeWidth={1} fill="none">
                  {Array.from({ length: 12 }).map((_, i) => {
                    const base = buildings[i % buildings.length]
                    return (
                      <rect
                        key={i}
                        x={(base?.gridX ?? i) * TILE_2D}
                        y={(base?.gridZ ?? i) * 30}
                        width={90}
                        height={70}
                        rx={4}
                      />
                    )
                  })}
                </g>
              )}

              {layerVisible('buildings') &&
                buildings.map((b) => {
                  const color = statusBadgeHex[b.status]
                  const selected = selectedId === b.id
                  return (
                    <g
                      key={b.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleBuildingClick(b)
                      }}
                      opacity={selectedId && !selected ? 0.3 : 1}
                      className="cursor-pointer"
                    >
                      <rect
                        x={b.gridX * TILE_2D}
                        y={b.gridZ * TILE_2D}
                        width={b.width * TILE_2D}
                        height={b.depth * TILE_2D}
                        rx={3}
                        fill={selected ? shadeHex(color, 1.15) : color}
                        stroke={selected ? '#e0f2fe' : 'rgba(255,255,255,0.25)'}
                        strokeWidth={selected ? 2 : 0.6}
                      />
                      <text
                        x={b.gridX * TILE_2D + (b.width * TILE_2D) / 2}
                        y={b.gridZ * TILE_2D + (b.depth * TILE_2D) / 2 + 3}
                        textAnchor="middle"
                        fontSize={9}
                        fill="#f8fafc"
                        fontWeight={500}
                        pointerEvents="none"
                      >
                        {b.height.toFixed(0)}
                      </text>
                    </g>
                  )
                })}

              {showUnderground &&
                underground.map((asset) => (
                  <g key={asset.id} opacity={0.75}>
                    <polyline
                      points={segment2d(asset.path)}
                      fill="none"
                      stroke={UG_KIND_COLORS[asset.kind]}
                      strokeWidth={3}
                      strokeDasharray="8 5"
                    />
                    {asset.path.map((p, idx) => (
                      <circle
                        key={`${asset.id}-${idx}`}
                        cx={p.x * TILE_2D}
                        cy={p.z * TILE_2D}
                        r={3}
                        fill={UG_KIND_COLORS[asset.kind]}
                      />
                    ))}
                  </g>
                ))}
            </>
          ) : (
            <>
              <polygon
                points={[
                  isoProject(EXTENT.minX, EXTENT.minZ, 0, { tile: TILE_3D, heightScale: HEIGHT_SCALE }),
                  isoProject(EXTENT.maxX, EXTENT.minZ, 0, { tile: TILE_3D, heightScale: HEIGHT_SCALE }),
                  isoProject(EXTENT.maxX, EXTENT.maxZ, 0, { tile: TILE_3D, heightScale: HEIGHT_SCALE }),
                  isoProject(EXTENT.minX, EXTENT.maxZ, 0, { tile: TILE_3D, heightScale: HEIGHT_SCALE }),
                ].map((p) => `${p.x},${p.y}`).join(' ')}
                fill="#0b1424"
                stroke="rgba(96,165,250,0.16)"
                strokeWidth={1.5}
              />

              {layerVisible('roads') &&
                roadLines3d.map((line, i) => (
                  <polyline
                    key={i}
                    points={line}
                    stroke="rgba(100,116,139,0.4)"
                    strokeWidth={14}
                    strokeLinecap="round"
                    fill="none"
                  />
                ))}

              {layerVisible('buildings') &&
                buildings.map((b) => {
                  const geom = isoBoxGeometry(b.gridX, b.gridZ, b.width, b.depth, b.height / 4, {
                    tile: TILE_3D,
                    heightScale: HEIGHT_SCALE,
                  })
                  const base = statusBadgeHex[b.status]
                  const selected = selectedId === b.id
                  return (
                    <g
                      key={b.id}
                      className="cursor-pointer"
                      opacity={selectedId && !selected ? 0.3 : 1}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleBuildingClick(b)
                      }}
                    >
                      <polygon
                        points={geom.left}
                        fill={selected ? shadeHex(base, 0.72) : shadeHex(base, 0.6)}
                        stroke="rgba(0,0,0,0.25)"
                        strokeWidth={0.5}
                      />
                      <polygon
                        points={geom.right}
                        fill={selected ? shadeHex(base, 0.86) : shadeHex(base, 0.76)}
                        stroke="rgba(0,0,0,0.25)"
                        strokeWidth={0.5}
                      />
                      <polygon
                        points={geom.top}
                        fill={selected ? shadeHex(base, 1.15) : base}
                        stroke={selected ? '#e0f2fe' : 'rgba(255,255,255,0.18)'}
                        strokeWidth={selected ? 1.2 : 0.5}
                      />
                      {selected && selectedFloor !== null && (
                        <polygon
                          points={isoBoxGeometry(b.gridX, b.gridZ, b.width, b.depth, Math.max(0, selectedFloor * b.height / 4 / b.floors), {
                            tile: TILE_3D,
                            heightScale: HEIGHT_SCALE,
                          }).top}
                          fill="rgba(255,255,255,0.28)"
                          stroke="#ffffff"
                          strokeWidth={1.4}
                          strokeDasharray="4 3"
                        />
                      )}
                      {selected && (
                        <text
                          x={isoProject(b.gridX, b.gridZ, b.height / 4 + 1, { tile: TILE_3D, heightScale: HEIGHT_SCALE }).x}
                          y={isoProject(b.gridX, b.gridZ, b.height / 4 + 1, { tile: TILE_3D, heightScale: HEIGHT_SCALE }).y}
                          fontSize={10}
                          fill="#e0f2fe"
                          fontWeight={600}
                        >
                          {b.name}
                        </text>
                      )}
                    </g>
                  )
                })}

              {showUnderground &&
                underground.map((asset) => (
                  <g
                    key={asset.id}
                    opacity={asset.kind === 'metro' && undergroundMode === 'underground' ? 0.9 : 0.55}
                  >
                    <polyline
                      points={segment(asset.path, asset.depth)}
                      fill="none"
                      stroke={UG_KIND_COLORS[asset.kind]}
                      strokeWidth={asset.kind === 'metro' ? 5 : 3}
                      strokeDasharray={asset.kind === 'parking' ? '1 0' : '8 5'}
                    />
                    {asset.path.map((p, idx) => (
                      <circle
                        key={`${asset.id}-${idx}`}
                        cx={isoProject(p.x, p.z, -asset.depth, { tile: TILE_3D, heightScale: HEIGHT_SCALE }).x}
                        cy={isoProject(p.x, p.z, -asset.depth, { tile: TILE_3D, heightScale: HEIGHT_SCALE }).y}
                        r={3}
                        fill={UG_KIND_COLORS[asset.kind]}
                        stroke="#0b1424"
                        strokeWidth={1}
                      />
                    ))}
                  </g>
                ))}
            </>
          )}
        </g>
      </svg>

      {/* View mode badge + underground legend */}
      <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-1.5">
        <span className="rounded-lg border border-white/[0.08] bg-navy-900/85 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-slate-300 backdrop-blur-sm">
          {viewMode === '3d' ? '3D View' : '2D View'}
        </span>
        {showUnderground && (
          <span className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-[10px] text-purple-300 backdrop-blur-sm">
            Underground mode active
          </span>
        )}
      </div>

      <div className="pointer-events-none absolute bottom-4 right-4 flex flex-col items-end gap-1.5">
        {measureResult && (
          <span className="rounded-lg border border-primary-400/40 bg-navy-900/90 px-3 py-1.5 font-mono text-[11px] text-primary-300 shadow-glow-sm backdrop-blur-sm animate-slide-up">
            {measureResult}
          </span>
        )}
        <span className="flex items-center gap-2 rounded-md border border-white/[0.07] bg-navy-900/80 px-2 py-1 text-[9px] text-slate-500 backdrop-blur-sm">
          <span className="flex items-center gap-1">
            <span className={cn('h-1.5 w-1.5 rounded-full', showSurface ? 'bg-emerald-400' : 'bg-transparent border border-white/40')} />
            Surface
          </span>
          <span className="flex items-center gap-1">
            <span className={cn('h-1.5 w-1.5 rounded-full', showUnderground ? 'bg-purple-400' : 'bg-transparent border border-white/40')} />
            Underground
          </span>
        </span>
      </div>

      {/* Fullscreen button overlaid */}
      <button
        onClick={enterFullscreen}
        title="Fullscreen"
        className="absolute right-4 top-4 rounded-lg border border-white/[0.08] bg-navy-900/85 p-2 text-slate-400 backdrop-blur-sm transition-all hover:border-primary-400/30 hover:text-white"
      >
        <Maximize size={14} />
      </button>
    </div>
  )
}