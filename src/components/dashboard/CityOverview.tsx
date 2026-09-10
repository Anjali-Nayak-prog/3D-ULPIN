import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
  type Ref,
} from 'react'
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
import { cn } from '../../utils/helpers'
import { STATUS_COLORS } from '../../utils/constants'
import { useToast } from '../common/Toast'
import type { PropertyStatus } from '../../types/property'
import type { CitySceneHandle } from './CityScene3D'

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
  const [SceneComp, setSceneComp] = useState<ComponentType<{
    buildings: MapBuilding[]
    selectedId: string | null
    showLabels: boolean
    measureMode: boolean
    onSelect: (id: string | null) => void
    onMeasure: (building: MapBuilding) => void
    ref?: Ref<CitySceneHandle>
  }> | null>(null)
  const [showLabels, setShowLabels] = useState(true)
  const [measureMode, setMeasureMode] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Lazily load the Three.js scene so the WebGL chunk only loads with this card.
  useEffect(() => {
    let active = true
    void import('./CityScene3D').then((mod) => {
      if (active) setSceneComp(() => mod.CityScene3D)
    })
    return () => {
      active = false
    }
  }, [])

  const handleSelect = (id: string | null) => {
    if (id === null) {
      setSelectedId(null)
    } else {
      setSelectedId((current) => (current === id ? null : id))
    }
  }

  const handleMeasure = (building: MapBuilding) => {
    toast.info('Height measurement', `${building.name}: ${building.height} m`)
  }

  const sceneRef = useRef<CitySceneHandle | null>(null)

  const getScene = () => sceneRef.current

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
        <div className="absolute left-4 top-4 z-10 flex flex-col gap-1.5 rounded-xl border border-white/[0.08] bg-navy-900/85 p-1.5 backdrop-blur-md" style={{ width: 132 }}>
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

        <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-xl border border-white/[0.08] bg-navy-900/85 p-1.5 backdrop-blur-md">
          <div className="flex items-center gap-1">
            <ControlButton
              label="Home"
              onClick={() => {
                getScene()?.reset()
                setMeasureMode(false)
              }}
            >
              <Home size={15} />
            </ControlButton>
            <ControlButton label="Settings" onClick={() => setShowLabels((s) => !s)}>
              <Settings2 size={15} />
            </ControlButton>
            <ControlButton label="Zoom in" onClick={() => getScene()?.zoomIn()}>
              <ZoomIn size={15} />
            </ControlButton>
            <ControlButton label="Zoom out" onClick={() => getScene()?.zoomOut()}>
              <ZoomOut size={15} />
            </ControlButton>
            <ControlButton
              label="Measure"
              active={measureMode}
              onClick={() => {
                setMeasureMode((m) => !m)
                toast.info('Measure mode', measureMode ? 'Measure disabled' : 'Click a building to measure height')
              }}
            >
              <Locate size={15} />
            </ControlButton>
            <ControlButton
              label="Layers"
              onClick={() => toast.info('Layers', '10 spatial layers available in the 3D Cadastral Map')}
            >
              <Layers size={15} />
            </ControlButton>
          </div>
        </div>

        <div className="relative w-full overflow-hidden" style={{ height: 520 }}>
          {SceneComp ? (
            <SceneComp
              ref={(node) => {
                sceneRef.current = node
              }}
              buildings={buildings}
              selectedId={selectedId}
              showLabels={showLabels}
              measureMode={measureMode}
              onSelect={handleSelect}
              onMeasure={handleMeasure}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary-400/30 border-t-primary-400" />
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Loading 3D scene…
              </p>
            </div>
          )}
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
      aria-label={label}
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