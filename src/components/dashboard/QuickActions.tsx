import {
  FileText,
  Fingerprint,
  Orbit,
  ShieldCheck,
  Sparkles,
  Upload,
  type LucideIcon,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '../../utils/helpers'
import { Card } from '../common/Card'
import { quickActions } from '../../data/dashboardData'

const colorMap: Record<string, string> = {
  blue: 'text-blue-400 bg-blue-500/10',
  cyan: 'text-cyan-400 bg-cyan-500/10',
  purple: 'text-purple-400 bg-purple-500/10',
  green: 'text-emerald-400 bg-emerald-500/10',
  amber: 'text-amber-400 bg-amber-500/10',
  pink: 'text-pink-400 bg-pink-500/10',
}

const iconMap: Record<string, LucideIcon> = {
  fingerprint: Fingerprint,
  upload: Upload,
  sparkles: Sparkles,
  'shield-check': ShieldCheck,
  orbit: Orbit,
  'file-text': FileText,
}

export function QuickActions() {
  const navigate = useNavigate()

  return (
    <Card
      title="Quick Actions"
      subtitle="Common workflows"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {quickActions.map((action) => {
          const Icon = iconMap[action.icon]
          return (
            <button
              key={action.id}
              onClick={() => navigate(action.to)}
              className="group flex flex-col gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-400/30 hover:bg-white/[0.045] hover:shadow-glow-sm"
            >
              <span className={cn('flex h-9 w-9 items-center justify-center rounded-lg', colorMap[action.color])}>
                <Icon size={17} />
              </span>
              <span>
                <span className="block text-sm font-semibold text-slate-100 group-hover:text-white">
                  {action.title}
                </span>
                <span className="mt-1 block text-xs leading-4 text-slate-500">
                  {action.description}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </Card>
  )
}