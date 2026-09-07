import { useState, type MouseEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Boxes,
  CheckCircle2,
  Eye,
  Home,
  Layers,
  Locate,
  Map as MapIcon,
  Settings2,
  Square,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { generateCityBuildings } from '../../data/mapData'
import type { MapBuilding } from '../../types/map'
import { statusSummary } from '../../data/dashboardData'
import { Card } from '../common/Card'
import { isoBoxGeometry, isoProject, shadeHex } from '../../utils/isometric'
import { cn } from '../../utils/helpers'
import { STATUS_COLORS } from '../../utils/constants'
import { useToast } from '../common/Toast'
import type { PropertyStatus } from '../../types/property'

const HALF_TILE = 17
const TILE = 34
const HEIGHT_SCALE = 1.15
const EXTENT = { minX: -0.8, maxX: 14.8, minZ: -0.8, maxZ: 10.8 }

const badgeFor: Record<PropertyStatus, { label: string; hex: string }> = {
  verified: { label: 'Verified', hex: STATUS_COLORS.verified.hex },
  pending: { label: 'Pending', hex: STATUS_COLORS.pending.hex },
  conflict: { label: 'Conflict', hex: STATUS_COLORS.conflict.hex },
  new: { label: 'New', hex: STATUS_COLORS.new.hex },
}

export function CityOverview() {
  const navigate = useNavigate()
  const toast = useToast()
  const [buildings] = useState<MapBuilding[]>(() => generateCityBuildings())
  const [zoom, setZoom] = useState(1)
  const [showLabels, setShowLabels] = useState(true)
  const [measureMode, setMeasureMode] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const origin = isoProject(EXTENT.minX, EXTENT.minZ, 0, {
    tile: HALF_TILE * 2,
    heightScale: HEIGHT_SCALE,
  })
  const corner = isoProject(EXTENT.maxX, EXTENT.maxZ, 0, {
    tile: HALF_TILE * 2,
    heightScale: HEIGHT_SCALE,
  })

  const width = corner.x - origin.x + 120
  const height = corner.y - origin.y + 260

  const groundPoly = [
    isoProject(EXTENT.minX, EXTENT.minZ, 0, { tile: TILE, heightScale: HEIGHT_SCALE }),
    isoProject(EXTENT.maxX, EXTENT.minZ, 0, { tile: TILE, heightScale: HEIGHT_SCALE }),
    isoProject(EXTENT.maxX, EXTENT.maxZ, 0, { tile: TILE, heightScale: HEIGHT_SCALE }),
    isoProject(EXTENT.minX, EXTENT.maxZ, 0, { tile: TILE, heightScale: HEIGHT_SCALE }),
  ]
    .map((p) => `${p.x},${p.y}`)
    .join(' ')

  const handleBuildingClick = (
    e: MouseEvent,
    building: MapBuilding,
  ) => {
    e.stopPropagation()
    setSelectedId((current) => (current === building.id ? null : building.id))
    if (measureMode) {
      toast.info('Height measurement', `${building.name}: ${building.height} m`)
    }
  }

  return (
    <Card
      title="3D City Overview"
      subtitle="Volumetric cadastre overlay — Pune urban corpus"
      padding="none"
      className="overflow-hidden"
      action={
        <button
          onClick={() => navigate('/map')}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-3 py-1.5 text-xs font-medium text-white shadow-glow-sm transition-all hover:bg-primary-400"
        >
          <MapIcon size={14} />
          Open 3D Map
        </button>
      }
    >
      <div className="bg-grid relative">
        <div
          className="absolute left-4 top-4 z-10 flex flex-col gap-1.5 rounded-xl border border-white/[0.08] bg-navy-900/85 p-1.5 backdrop-blur-md"
          style={{ width: 132 }}
        >
          <p className="px-2 pt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Legend
          </p>
          <div className="space-y-1">
            {Object.entries(badgeFor).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2 px-2 py-0.5">
                <Square size={11} style={{ color: value.hex, fill: value.hex, opacity: 0.85 }} />
                <span className="text-xs text-slate-300">{value.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-xl border border-white/[0.08] bg-navy-900/85 p-1.5 backdrop-blur-md"
        >
          <div className="flex items-center gap-1">
            <ControlButton label="Home" onClick={() => { setZoom(1); setMeasureMode(false) }}><Home size={15} /></ControlButton>
            <ControlButton label="Settings" onClick={() => setShowLabels((s) => !s)}><Settings2 size={15} /></ControlButton>
            <ControlButton label="Zoom in" onClick={() => setZoom((z) => Math.min(z * 1.2, 2.4))}><ZoomIn size={15} /></ControlButton>
            <ControlButton label="Zoom out" onClick={() => setZoom((z) => Math.max(z / 1.2, 0.55))}><ZoomOut size={15} /></ControlButton>
            <ControlButton label="Measure" active={measureMode} onClick={() => {
              setMeasureMode((m) => !m)
              toast.info('Measure mode', measureMode ? 'Measure disabled' : 'Click a building to measure height')
            }}><Locate size={15} /></ControlButton>
            <ControlButton label="Layers" onClick={() => toast.info('Layers', '10 spatial layers available in the 3D Cadastral Map')}><Layers size={15} /></ControlButton>
          </div>
        </div>

        <div
          className="relative w-full cursor-default overflow-hidden transition-all duration-500"
          style={{ height: 520, cursor: measureMode ? 'crosshair' : 'default' }}
          onClick={() => setSelectedId(null)}
        >
          <svg
            viewBox={`${origin.x - 60} ${origin.y - 260} ${width} ${height}`}
            className="h-full w-full"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: '50% 45%',
              transition: 'transform 0.4s ease',
            }}
          >
            <polygon points={groundPoly} fill="#0b1424" stroke="rgba(96,165,250,0.15)" strokeWidth={1.5} />

            {buildings.map((b) => {
              const geom = isoBoxGeometry(b.gridX, b.gridZ, b.width, b.depth, b.height / 4, {
                tile: TILE,
                heightScale: HEIGHT_SCALE,
              })
              const base = badgeFor[b.status].hex
              const selected = selectedId === b.id
              return (
                <g
                  key={b.id}
                  className="cursor-pointer transition-opacity duration-200"
                  opacity={selectedId && !selected ? 0.35 : 1}
                  onClick={(e) => handleBuildingClick(e, b)}
                >
                  <polygon
                    points={geom.left}
                    fill={selected ? shadeHex(base, 0.72) : shadeHex(base, 0.62)}
                    stroke={selected ? '#93c5fd' : 'rgba(0,0,0,0.25)'}
                    strokeWidth={selected ? 1.5 : 0.5}
                  />
                  <polygon
                    points={geom.right}
                    fill={selected ? shadeHex(base, 0.86) : shadeHex(base, 0.78)}
                    stroke={selected ? '#93c5fd' : 'rgba(0,0,0,0.25)'}
                    strokeWidth={selected ? 1.5 : 0.5}
                  />
                  <polygon
                    points={geom.top}
                    fill={selected ? shadeHex(base, 1.15) : base}
                    stroke={selected ? '#e0f2fe' : 'rgba(255,255,255,0.18)'}
                    strokeWidth={selected ? 1.2 : 0.5}
                  />
                  {showLabels && b.width > 0.95 && (
                    <text
                      x={isoProject(b.gridX + b.width / 2, b.gridZ + b.depth / 2, b.height / 4 + 2.2, { tile: TILE, heightScale: HEIGHT_SCALE }).x}
                      y={isoProject(b.gridX + b.width / 2, b.gridZ + b.depth / 2, b.height / 4 + 2.2, { tile: TILE, heightScale: HEIGHT_SCALE }).y}
                      textAnchor="middle"
                      fontSize={selectedId ? 9 : 7}
                      fill={selected ? '#e0f2fe' : 'rgba(226,232,240,0.65)'}
                      fontWeight={selected ? 600 : 500}
                    >
                      {b.height.toFixed(0)}
                    </text>
                  )}
                  {selected && (
                    <g transform={`translate(${isoProject(b.gridX + b.width / 2, b.gridZ + b.depth / 2, b.height / 4 + 8, { tile: TILE, heightScale: HEIGHT_SCALE }).x}, ${isoProject(b.gridX + b.width / 2, b.gridZ + b.depth / 2, b.height / 4 + 8, { tile: TILE, heightScale: HEIGHT_SCALE }).y})`}>
                      <rect x={-70} y={-14} width={140} height={26} rx={6} fill="#0d1424" stroke="#93c5fd" strokeOpacity={0.5} />
                      <text textAnchor="middle" y={4} fontSize={10} fill="#e0f2fe">
                        {b.name} · {b.height} m
                      </text>
                    </g>
                  )}
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-2 divide-white/[0.06] border-t border-white/[0.06] bg-navy-950/40 sm:grid-cols-4 sm:divide-x">
        <SummaryStat icon={<CheckCircle2 size={14} className="mb-0.5 text-emerald-400" />} label="Verified" value={statusSummary.verified.toLocaleString('en-IN')} percent={statusSummary.verifiedPercent} tone="text-emerald-400" />
        <SummaryStat icon={<Eye size={14} className="mb-0.5 text-amber-400" />} label="Pending" value={statusSummary.pending.toLocaleString('en-IN')} percent={statusSummary.pendingPercent} tone="text-amber-400" />
        <SummaryStat icon={<Square size={14} className="mb-0.5 text-red-400" />} label="Conflict" value={String(statusSummary.conflict)} percent={statusSummary.conflictPercent} tone="text-red-400" />
        <SummaryStat icon={<Boxes size={14} className="mb-0.5 text-sky-400" />} label="New" value={statusSummary.new.toLocaleString('en-IN')} percent={statusSummary.newPercent} tone="text-sky-400" />
      </div>
    </Card>
  )
}

function ControlButton({
  children,
  label,
  onClick,
  active = false,
}: {
  children: ReactNode
  label: string
  onClick: () => void
  active?: boolean
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      title={label}
      className={cn(
        'rounded-lg p-2 text-slate-400 transition-all hover:bg-white/[0.06] hover:text-white',
        active && 'bg-primary-500/15 text-primary-300',
      )}
    >
      {children}
    </button>
  )
}

function SummaryStat({
  icon,
  label,
  value,
  percent,
  tone,
}: {
  icon: ReactNode
  label: string
  value: string
  percent: number
  tone: string
}) {
  return (
    <div className="flex flex-col px-4 py-3.5">
      <div className="flex items-center gap-1">
        {icon}
        <span className="text-[11px] font-medium text-slate-400">{label}</span>
      </div>
      <div className="mt-1 flex items-baseline justify-between gap-2">
        <span className="text-lg font-bold text-white">{value}</span>
        <span className={cn('text-xs font-semibold', tone)}>{percent}%</span>
      </div>
    </div>
  )
}