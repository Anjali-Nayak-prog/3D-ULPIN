import {
  AlertTriangle,
  Box,
  Building2,
  DoorOpen,
  Drill,
  Map,
  TrendingDown,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import type { StatCardData } from '../../types/dashboard'
import { cn } from '../../utils/helpers'

const iconMap: Record<StatCardData['icon'], LucideIcon> = {
  map: Map,
  box: Box,
  building: Building2,
  door: DoorOpen,
  drill: Drill,
  alert: AlertTriangle,
}

const colorMap: Record<StatCardData['color'], { bg: string; icon: string; glow: string }> = {
  blue: { bg: 'bg-blue-500/10', icon: 'text-blue-400', glow: 'group-hover:shadow-[0_0_24px_rgba(59,130,246,0.25)]' },
  purple: { bg: 'bg-purple-500/10', icon: 'text-purple-400', glow: 'group-hover:shadow-[0_0_24px_rgba(168,85,247,0.25)]' },
  cyan: { bg: 'bg-cyan-500/10', icon: 'text-cyan-400', glow: 'group-hover:shadow-[0_0_24px_rgba(34,211,238,0.25)]' },
  green: { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', glow: 'group-hover:shadow-[0_0_24px_rgba(16,185,129,0.25)]' },
  amber: { bg: 'bg-amber-500/10', icon: 'text-amber-400', glow: 'group-hover:shadow-[0_0_24px_rgba(245,158,11,0.25)]' },
  red: { bg: 'bg-red-500/10', icon: 'text-red-400', glow: 'group-hover:shadow-[0_0_24px_rgba(239,68,68,0.25)]' },
}

interface StatCardProps {
  stat: StatCardData
  index?: number
}

export function StatCard({ stat, index = 0 }: StatCardProps) {
  const Icon = iconMap[stat.icon]
  const colors = colorMap[stat.color]
  const positive = stat.change >= 0

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border border-white/[0.06] bg-navy-900/70 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.12]',
        colors.glow,
        'animate-slide-up',
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', colors.bg)}>
          <Icon size={19} className={colors.icon} />
        </div>
        <span
          className={cn(
            'flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
            positive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400',
          )}
        >
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(stat.change)}%
        </span>
      </div>

      <div className="mt-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
          {stat.title}
        </p>
        <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
      </div>
    </div>
  )
}