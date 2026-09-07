import { BrainCircuit, Building2, Clock4, Layers3, Sparkles, type LucideIcon } from 'lucide-react'
import { cn } from '../../utils/helpers'

interface AIStat {
  label: string
  value: string
  delta: string
  icon: LucideIcon
  trend: 'up' | 'down' | 'neutral'
}

const stats: AIStat[] = [
  { label: 'Buildings Detected', value: '184', delta: '+12 this batch', icon: Building2, trend: 'up' },
  { label: 'Detection Confidence', value: '94.2%', delta: '+1.1% vs last run', icon: Sparkles, trend: 'up' },
  { label: 'Floors Segmented', value: '1,248', delta: '+96 this batch', icon: Layers3, trend: 'up' },
  { label: 'Processing Time', value: '2m 43s', delta: '18% faster', icon: Clock4, trend: 'up' },
]

export function AIProcessingCard() {
  return (
    <div className="rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-500/[0.07] to-transparent p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/15">
          <BrainCircuit size={22} className="text-purple-400" />
        </span>
        <div>
          <h3 className="text-base font-bold text-white">AI Model Pipeline</h3>
          <p className="text-xs text-slate-400">Vision + geometry models · v2.4.1</p>
        </div>
        <span className="ml-auto flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-[11px] font-medium text-purple-300">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse-soft" />
          Model active
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group flex items-start gap-3 rounded-xl border border-white/[0.06] bg-navy-900/70 p-4 transition-all duration-200 hover:border-purple-400/30 hover:shadow-glow-sm"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
              <stat.icon size={16} className="text-purple-400" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                {stat.label}
              </p>
              <p className="mt-0.5 text-xl font-bold text-white">{stat.value}</p>
              <p className={cn('mt-0.5 text-[11px]', stat.trend === 'up' ? 'text-emerald-400' : 'text-slate-500')}>
                {stat.delta}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}