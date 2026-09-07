import {
  AlertOctagon,
  GitBranch,
  Landmark,
  MapPinOff,
  ShieldAlert,
  TriangleAlert,
} from 'lucide-react'
import type { Conflict } from '../../types/validation'
import {
  CONFLICT_SEVERITY,
  CONFLICT_STATUS,
  CONFLICT_TYPES,
} from '../../utils/constants'
import { formatDate } from '../../utils/formatters'
import { cn } from '../../utils/helpers'
import { Badge } from '../common/Badge'
import { Button } from '../common/Button'

const typeIconMap = {
  'ownership-overlap': ShieldAlert,
  'vertical-overlap': TriangleAlert,
  'boundary-error': MapPinOff,
  'underground-utility': GitBranch,
  'outside-parcel': Landmark,
}

interface ConflictCardProps {
  conflict: Conflict
  onResolve: (id: string) => void
  onIgnore: (id: string) => void
}

export function ConflictCard({ conflict, onResolve, onIgnore }: ConflictCardProps) {
  const severity = CONFLICT_SEVERITY[conflict.severity]
  const status = CONFLICT_STATUS[conflict.status]
  const typeInfo = CONFLICT_TYPES[conflict.type]
  const Icon = typeIconMap[conflict.type]

  return (
    <div
      className={cn(
        'group rounded-xl border bg-navy-900/70 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-glow-sm',
        conflict.severity === 'critical'
          ? 'border-red-500/25'
          : conflict.severity === 'high'
            ? 'border-orange-500/25'
            : 'border-white/[0.07]',
        (conflict.status === 'resolved' || conflict.status === 'ignored') && 'opacity-70',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border',
              severity.bg,
            )}
          >
            <Icon size={18} className={severity.text} />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">{typeInfo.label}</p>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <Badge tone={severityLabelToTone(conflict.severity)}>
                {severity.label} Severity
              </Badge>
              <Badge tone={statusLabelToTone(conflict.status)} dot>
                {status.label}
              </Badge>
              <span className="text-[10px] text-slate-600">
                {conflict.detectedBy === 'ai' ? 'AI detected' : conflict.detectedBy === 'rule-engine' ? 'Rule engine' : 'Manual'} ·{' '}
                {formatDate(conflict.createdAt)}
              </span>
            </div>
          </div>
        </div>
        {conflict.severity === 'critical' && (
          <AlertOctagon size={16} className="shrink-0 animate-pulse-soft text-red-400" />
        )}
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-400">{conflict.description}</p>

      <div className="mt-3 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2">
        <p className="text-[10px] uppercase tracking-wider text-slate-500">Affected properties</p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {conflict.affectedProperties.map((prop) => (
            <span key={prop} className="rounded-md border border-white/[0.06] bg-navy-950 px-2 py-0.5 font-mono text-[10px] text-slate-400">
              {prop}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Button size="sm" variant="outline">
          View
        </Button>
        <Button
          size="sm"
          variant="success"
          disabled={conflict.status === 'resolved'}
          onClick={() => onResolve(conflict.id)}
        >
          {conflict.status === 'resolved' ? 'Resolved' : 'Resolve'}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          disabled={conflict.status === 'ignored'}
          onClick={() => onIgnore(conflict.id)}
        >
          {conflict.status === 'ignored' ? 'Ignored' : 'Ignore'}
        </Button>
      </div>
    </div>
  )
}

function severityLabelToTone(severity: Conflict['severity']): 'red' | 'orange' | 'amber' | 'blue' {
  switch (severity) {
    case 'critical':
      return 'red'
    case 'high':
      return 'orange'
    case 'medium':
      return 'amber'
    case 'low':
      return 'blue'
  }
}

function statusLabelToTone(
  status: Conflict['status'],
): 'red' | 'amber' | 'green' | 'slate' {
  switch (status) {
    case 'open':
      return 'red'
    case 'in-progress':
      return 'amber'
    case 'resolved':
      return 'green'
    case 'ignored':
      return 'slate'
  }
}