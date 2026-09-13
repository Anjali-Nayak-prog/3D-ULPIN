import { useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Boxes,
  CheckCircle2,
  Eye,
  Home,
  Map as MapIcon,
  RotateCw,
  Square,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { cadastralBlockBuildings, cadastralBlockUnderground } from '../../data/mapData'
import { Card } from '../common/Card'
import { cn } from '../../utils/helpers'
import { CadastralScene, type CadastralSceneHandle } from '../cadastral/CadastralScene'

const badgeFor = [
  { key: 'verified', label: 'Verified property', hex: '#10b981', tone: 'text-emerald-600' },
  { key: 'pending', label: 'Pending validation', hex: '#f59e0b', tone: 'text-amber-600' },
  { key: 'conflict', label: 'Spatial conflict', hex: '#ef4444', tone: 'text-red-600' },
  { key: 'new', label: 'New property', hex: '#38bdf8', tone: 'text-sky-600' },
] as const

export function CityOverview({
  selectedId = null,
  onSelect,
}: {
  selectedId?: string | null
  onSelect?: (id: string | null) => void
} = {}) {
  const navigate = useNavigate()
  const sceneRef = useRef<CadastralSceneHandle>(null)

  const buildings = useMemo(() => cadastralBlockBuildings, [])

  const selected = buildings.find((b) => b.id === selectedId) ?? null

  const stats = useMemo(() => {
    const counts = { verified: 0, pending: 0, conflict: 0, new: 0 }
    buildings.forEach((b) => {
      counts[b.status] += 1
    })
    const total = buildings.length
    const percent = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0)
    return [
      { key: 'verified', value: counts.verified, percent: percent(counts.verified) },
      { key: 'pending', value: counts.pending, percent: percent(counts.pending) },
      { key: 'conflict', value: counts.conflict, percent: percent(counts.conflict) },
      { key: 'new', value: counts.new, percent: percent(counts.new) },
    ] as const
  }, [buildings])

    const openMap = () => {
    navigate(selected ? `/map?locate=${encodeURIComponent(selected.ulpin)}` : '/map')
  }

  return (
    <Card
      title="3D City Overview"
      subtitle="Volumetric cadastre overlay — Pune urban corpus"
      padding="none"
      className="overflow-hidden"
      action={
        <button
          onClick={openMap}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-3 py-1.5 text-xs font-medium text-white shadow-glow-sm transition-all hover:bg-primary-600"
        >
          <MapIcon size={14} />
          Open 3D Map
        </button>
      }
    >
      <div className="bg-grid relative">
        {/* Legend — top-left */}
        <div className="absolute left-4 top-4 z-10">
          <div className="rounded-xl border border-slate-200 bg-white/90 p-2 shadow-card backdrop-blur-md">
            <p className="px-2 pb-1 pt-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Legend
            </p>
            <div className="space-y-0.5">
              {badgeFor.map((item) => (
                <div key={item.key} className="flex items-center gap-2 px-2 py-0.5">
                  <Square size={11} style={{ color: item.hex, fill: item.hex, opacity: 0.85 }} />
                  <span className="text-xs text-slate-600">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Camera controls — bottom center */}
        <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2">
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white/90 p-1 shadow-card backdrop-blur-md">
            <ControlButton label="Home" onClick={() => sceneRef.current?.home()}>
              <Home size={15} />
            </ControlButton>
            <ControlButton label="Zoom in" onClick={() => sceneRef.current?.zoomIn()}>
              <ZoomIn size={15} />
            </ControlButton>
            <ControlButton label="Zoom out" onClick={() => sceneRef.current?.zoomOut()}>
              <ZoomOut size={15} />
            </ControlButton>
            <ControlButton label="Rotate view" onClick={() => sceneRef.current?.rotate()}>
              <RotateCw size={15} />
            </ControlButton>
          </div>
        </div>

        {/* Caption — top-right, does not cover geometry */}
        <div className="absolute right-4 top-4 z-10 hidden sm:block">
          <span className="rounded-lg border border-slate-200 bg-white/90 px-2.5 py-1.5 text-[10px] font-medium text-slate-500 shadow-card backdrop-blur-md">
            2D Parcel → Building → Floors → 3D Property Volume → 3D ULPIN
          </span>
        </div>

        <CadastralScene
          ref={sceneRef}
          mode="overview"
          buildings={buildings}
          underground={cadastralBlockUnderground}
          undergroundMode="combined"
          selectedId={selectedId}
          onSelect={onSelect}
          className="h-[480px] w-full sm:h-[520px]"
        />
      </div>

      <div className="grid grid-cols-2 divide-slate-200 border-t border-slate-200 bg-navy-950/40 sm:grid-cols-4 sm:divide-x">
        {stats.map((stat) => {
          const meta = badgeFor.find((b) => b.key === stat.key)!
          return (
            <SummaryStat
              key={stat.key}
              icon={
                stat.key === 'verified' ? (
                  <CheckCircle2 size={14} className="mb-0.5 text-emerald-600" />
                ) : stat.key === 'pending' ? (
                  <Eye size={14} className="mb-0.5 text-amber-600" />
                ) : stat.key === 'conflict' ? (
                  <Square size={14} className="mb-0.5 text-red-600" />
                ) : (
                  <Boxes size={14} className="mb-0.5 text-sky-600" />
                )
              }
              label={meta.label}
              value={String(stat.value)}
              percent={stat.percent}
              tone={meta.tone}
            />
          )
        })}
      </div>
    </Card>
  )
}

function ControlButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      title={label}
      className="rounded-lg p-2 text-slate-500 transition-all hover:bg-slate-200/60 hover:text-slate-900"
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
  icon: React.ReactNode
  label: string
  value: string
  percent: number
  tone: string
}) {
  return (
    <div className="flex flex-col px-4 py-3.5">
      <div className="flex items-center gap-1">
        {icon}
        <span className="text-[11px] font-medium text-slate-500">{label}</span>
      </div>
      <div className="mt-1 flex items-baseline justify-between gap-2">
        <span className="text-lg font-bold text-slate-900">{value}</span>
        <span className={cn('text-xs font-semibold', tone)}>{percent}%</span>
      </div>
    </div>
  )
}