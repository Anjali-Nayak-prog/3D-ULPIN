import type { LucideIcon } from 'lucide-react'
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  FileSpreadsheet,
  Fingerprint,
  Layers,
  Sparkles,
} from 'lucide-react'
import type { Activity } from '../../types/dashboard'
import { Card } from '../common/Card'

const iconMap: Record<Activity['type'], { icon: LucideIcon; color: string }> = {
  ulpin: { icon: Fingerprint, color: 'text-primary-400 bg-primary-500/10' },
  upload: { icon: FileSpreadsheet, color: 'text-cyan-400 bg-cyan-500/10' },
  conflict: { icon: AlertTriangle, color: 'text-red-400 bg-red-500/10' },
  update: { icon: Building2, color: 'text-emerald-400 bg-emerald-500/10' },
  floorplan: { icon: Layers, color: 'text-purple-400 bg-purple-500/10' },
  drone: { icon: Sparkles, color: 'text-sky-400 bg-sky-500/10' },
  ai: { icon: Sparkles, color: 'text-purple-400 bg-purple-500/10' },
  validation: { icon: ArrowRight, color: 'text-amber-400 bg-amber-500/10' },
}

interface RecentActivityProps {
  activities: Activity[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card
      title="Recent Activity"
      subtitle="Latest events across the corpus"
      className="h-full"
    >
      <div className="relative space-y-1">
        <div className="absolute bottom-3 left-[18px] top-3 w-px bg-white/[0.06]" />
        {activities.map((activity) => {
          const styles = iconMap[activity.type]
          return (
            <div key={activity.id} className="relative flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-white/[0.03]">
              <span className={`z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] ${styles.color}`}>
                <styles.icon size={15} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs font-semibold text-slate-200">{activity.title}</p>
                  <span className="shrink-0 text-[10px] text-slate-500">{activity.time}</span>
                </div>
                <p className="mt-0.5 truncate font-mono text-[11px] text-slate-500">{activity.description}</p>
              </div>
              <button className="shrink-0 rounded p-1 text-[11px] font-medium text-primary-400 opacity-0 transition-opacity hover:text-primary-300 group-hover:opacity-100">
                View
              </button>
            </div>
          )
        })}
      </div>
    </Card>
  )
}