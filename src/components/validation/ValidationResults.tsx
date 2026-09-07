import { useMemo, useState } from 'react'
import { CheckCircle2, Clock, Filter, XCircle } from 'lucide-react'
import type { ConflictStatus } from '../../types/validation'
import { CONFLICT_SEVERITY, CONFLICT_STATUS, CONFLICT_TYPES } from '../../utils/constants'
import { cn } from '../../utils/helpers'
import { EmptyState } from '../common/EmptyState'
import { ConflictCard } from './ConflictCard'
import type { Conflict } from '../../types/validation'

interface ValidationResultsProps {
  conflicts: Conflict[]
  onResolve: (id: string) => void
  onIgnore: (id: string) => void
}

type SeverityFilter = 'all' | Conflict['severity']
type StatusFilter = 'all' | ConflictStatus

export function ValidationResults({ conflicts, onResolve, onIgnore }: ValidationResultsProps) {
  const [severity, setSeverity] = useState<SeverityFilter>('all')
  const [status, setStatus] = useState<StatusFilter>('all')

  const filtered = useMemo(
    () =>
      conflicts.filter(
        (c) =>
          (severity === 'all' || c.severity === severity) &&
          (status === 'all' || c.status === status),
      ),
    [conflicts, severity, status],
  )

  const stats = useMemo(() => {
    const open = conflicts.filter((c) => c.status === 'open').length
    const resolved = conflicts.filter((c) => c.status === 'resolved').length
    const critical = conflicts.filter((c) => c.severity === 'critical').length
    return { open, resolved, critical }
  }, [conflicts])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatTile
          icon={<XCircle size={17} className="text-red-400" />}
          label="Open Conflicts"
          value={String(stats.open)}
          tone="text-white"
        />
        <StatTile
          icon={<Clock size={17} className="text-amber-400" />}
          label="Resolved"
          value={String(stats.resolved)}
          tone="text-white"
        />
        <StatTile
          icon={<CheckCircle2 size={17} className="text-red-400" />}
          label="Critical"
          value={String(stats.critical)}
          tone="text-white"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/[0.07] bg-navy-900/70 px-3 py-2.5">
        <Filter size={14} className="text-slate-500" />
        <FilterChip
          label="All severities"
          active={severity === 'all'}
          onClick={() => setSeverity('all')}
        />
        {Object.entries(CONFLICT_SEVERITY).map(([key, value]) => (
          <FilterChip
            key={key}
            label={value.label}
            active={severity === key}
            onClick={() => setSeverity(severity === key ? 'all' : key as SeverityFilter)}
          />
        ))}
        <span className="mx-1 h-4 w-px bg-white/[0.08]" />
        <FilterChip
          label="All statuses"
          active={status === 'all'}
          onClick={() => setStatus('all')}
        />
        {Object.entries(CONFLICT_STATUS).map(([key, value]) => (
          <FilterChip
            key={key}
            label={value.label}
            active={status === key}
            onClick={() => setStatus(status === key ? 'all' : key as StatusFilter)}
          />
        ))}
      </div>

      <div className="mb-1 flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Showing <span className="font-semibold text-slate-300">{filtered.length}</span> of{' '}
          {conflicts.length} conflicts
        </p>
        <span className="text-[11px] text-slate-600">
          {Object.keys(CONFLICT_TYPES).length} conflict classes monitored
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-white/[0.06] bg-navy-900/50">
          <EmptyState
            title="No conflicts match the filter"
            description="Adjust the severity or status filters to widen the result set."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          {filtered.map((conflict) => (
            <ConflictCard
              key={conflict.id}
              conflict={conflict}
              onResolve={onResolve}
              onIgnore={onIgnore}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all duration-150',
        active
          ? 'border-primary-400/50 bg-primary-500/15 text-primary-300'
          : 'border-white/[0.07] text-slate-500 hover:text-slate-300',
      )}
    >
      {label}
    </button>
  )
}

function StatTile({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: string
  tone: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-navy-900/70 px-4 py-3.5">
      {icon}
      <div>
        <p className={cn('text-xl font-bold', tone)}>{value}</p>
        <p className="text-[11px] text-slate-500">{label}</p>
      </div>
    </div>
  )
}