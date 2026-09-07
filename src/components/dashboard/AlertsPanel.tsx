import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Info,
  type LucideIcon,
} from 'lucide-react'
import type { Alert } from '../../types/dashboard'
import { cn } from '../../utils/helpers'
import { Card } from '../common/Card'

const severityMap: Record<
  Alert['severity'],
  { icon: LucideIcon; container: string; iconColor: string }
> = {
  critical: { icon: AlertTriangle, container: 'border-red-500/30 bg-red-500/[0.06]', iconColor: 'text-red-400' },
  warning: { icon: AlertTriangle, container: 'border-amber-500/30 bg-amber-500/[0.06]', iconColor: 'text-amber-400' },
  info: { icon: Info, container: 'border-sky-500/30 bg-sky-500/[0.06]', iconColor: 'text-sky-400' },
  success: { icon: CheckCircle2, container: 'border-emerald-500/30 bg-emerald-500/[0.06]', iconColor: 'text-emerald-400' },
}

interface AlertsPanelProps {
  alerts: Alert[]
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  return (
    <Card
      title="Alerts & Notifications"
      subtitle="Items requiring attention"
      className="h-full"
    >
      <div className="space-y-2">
        {alerts.map((alert) => {
          const styles = severityMap[alert.severity]
          return (
            <div
              key={alert.id}
              className={cn('flex items-start gap-3 rounded-xl border p-3 backdrop-blur-sm', styles.container)}
            >
              <span className={cn('mt-0.5 shrink-0', styles.iconColor)}>
                <styles.icon size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs font-semibold text-slate-100">{alert.title}</p>
                </div>
                <p className="mt-0.5 text-[11px] text-slate-400">{alert.description}</p>
              </div>
              <span className="shrink-0 text-[10px] text-slate-500">{alert.time}</span>
            </div>
          )
        })}
      </div>
      <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/[0.06] py-2 text-xs font-medium text-slate-400 transition-colors hover:border-primary-400/30 hover:text-primary-300">
        <Bell size={13} />
        View all notifications
      </button>
    </Card>
  )
}