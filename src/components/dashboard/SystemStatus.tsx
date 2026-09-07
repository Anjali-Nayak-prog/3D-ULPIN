import { Activity } from 'lucide-react'
import type { SystemService } from '../../types/dashboard'
import { cn } from '../../utils/helpers'
import { Card } from '../common/Card'

interface SystemStatusProps {
  services: SystemService[]
}

const statusMap = {
  operational: { label: 'Operational', dot: 'bg-emerald-400', text: 'text-emerald-400' },
  degraded: { label: 'Degraded', dot: 'bg-amber-400', text: 'text-amber-400' },
  down: { label: 'Down', dot: 'bg-red-400', text: 'text-red-400' },
}

export function SystemStatus({ services }: SystemStatusProps) {
  const allOperational = services.every((s) => s.status === 'operational')

  return (
    <Card
      title="System Status"
      subtitle={`${services.length} core services monitored`}
    >
      <div className="mb-4 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3">
        <Activity size={18} className="text-emerald-400" />
        <div>
          <p className="text-sm font-semibold text-emerald-300">
            {allOperational ? 'All Systems Operational' : 'System Degraded'}
          </p>
          <p className="text-[11px] text-slate-400">Last checked 2 minutes ago</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {services.map((service) => {
          const styles = statusMap[service.status]
          return (
            <div
              key={service.id}
              className="flex items-center justify-between rounded-lg border border-white/[0.06] px-3.5 py-2.5"
            >
              <span className="flex items-center gap-2.5 text-sm text-slate-200">
                <span className={cn('h-2 w-2 rounded-full', styles.dot, service.status === 'operational' && 'animate-pulse-soft')} />
                {service.name}
              </span>
              <span className="flex items-center gap-3">
                <span className="hidden font-mono text-[11px] text-slate-500 md:inline">
                  {service.latency}ms · {service.uptime}%
                </span>
                <span className={cn('text-xs font-medium', styles.text)}>{styles.label}</span>
              </span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}