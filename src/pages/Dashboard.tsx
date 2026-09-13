import { useNavigate } from 'react-router-dom'
import {
  Database,
  Eye,
  Fingerprint,
  Map as MapIcon,
  Sparkles,
  ArrowRight,
  Boxes,
} from 'lucide-react'
import { useState } from 'react'
import { dashboardStats } from '../data/dashboardData'
import { cadastralBlockBuildings } from '../data/mapData'
import { StatCard } from '../components/dashboard/StatCard'
import { CityOverview } from '../components/dashboard/CityOverview'
import { useDashboard } from '../hooks/useDashboard'
import { SkeletonCard } from '../components/common/Loading'
import { cn } from '../utils/helpers'
import type { StatCardData } from '../types/dashboard'

const workflowSteps = [
  { label: 'Data Processing', icon: Database, to: '/data-processing', color: 'text-blue-600 bg-blue-500/10' },
  { label: 'AI Extraction', icon: Sparkles, to: '/ai-processing', color: 'text-purple-600 bg-purple-500/10' },
  { label: 'Floor Segmentation', icon: Boxes, to: '/ai-processing', color: 'text-cyan-600 bg-cyan-500/10' },
  { label: '3D Parcel Delineation', icon: MapIcon, to: '/map', color: 'text-amber-600 bg-amber-500/10' },
  { label: 'Topology Validation', icon: Eye, to: '/validation', color: 'text-emerald-600 bg-emerald-500/10' },
  { label: '3D ULPIN Generation', icon: Fingerprint, to: '/ulpin-generator', color: 'text-rose-600 bg-rose-500/10' },
]

export function Dashboard() {
  const navigate = useNavigate()
  const { stats, loading } = useDashboard()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selectedUlpin = cadastralBlockBuildings.find((b) => b.id === selectedId)?.ulpin

  const statsSafe: StatCardData[] = stats.length > 0 ? stats.slice(0, 4) : dashboardStats

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-slate-900">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/15 border border-primary-500/30">
              <Fingerprint size={20} className="text-primary-600" />
            </span>
            3D ULPIN &amp; Vertical Property Mapping
          </h1>
          <p className="mt-1.5 pl-[52px] text-sm text-slate-500">
            Volumetric cadastral intelligence for Maharashtra
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() =>
              navigate(selectedUlpin ? `/map?locate=${encodeURIComponent(selectedUlpin)}` : '/map')
            }
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-100/70 px-3.5 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-primary-400/30 hover:text-slate-900"
          >
            <MapIcon size={14} />
            Open 3D Map
          </button>
          <button
            onClick={() => navigate('/ulpin-generator')}
            className="flex items-center gap-2 rounded-lg bg-primary-500 px-3.5 py-2 text-xs font-medium text-white shadow-glow-sm transition-all hover:bg-primary-600"
          >
            <Fingerprint size={14} />
            Generate ULPIN
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} rows={2} />
            ))}
          </div>
          <SkeletonCard rows={5} />
        </div>
      ) : (
        <>
          <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {statsSafe.map((stat, index) => (
              <StatCard key={stat.id} stat={stat} index={index} />
            ))}
          </section>

          <section>
            <CityOverview selectedId={selectedId} onSelect={setSelectedId} />
          </section>

          <section className="rounded-xl border border-slate-200 bg-navy-900/70 px-5 py-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Cadastral Pipeline</h3>
                <p className="text-[11px] text-slate-500">Spatial data flows through AI models to produce 3D ULPINs</p>
              </div>
              <button
                onClick={() => navigate('/data-processing')}
                className="flex items-center gap-1.5 text-[11px] text-primary-600 transition-colors hover:text-primary-600"
              >
                View pipeline <ArrowRight size={12} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
              {workflowSteps.map((step, i) => (
                <button
                  key={step.label}
                  onClick={() => navigate(step.to)}
                  className="group flex flex-col items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-100/50 px-3 py-4 transition-all duration-200 hover:border-primary-400/25 hover:shadow-glow-sm"
                >
                  <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl', step.color)}>
                    <step.icon size={18} />
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 text-center leading-tight group-hover:text-slate-900 transition-colors">
                    {step.label}
                  </span>
                  {i < workflowSteps.length - 1 && (
                    <span className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 text-slate-700">
                      <ArrowRight size={10} />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
